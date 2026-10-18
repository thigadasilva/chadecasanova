import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { enviarEmailCasal } from "@/lib/resend";
import { adicionarLinhaSheets } from "@/lib/sheets";
import { checkRateLimit } from "@/lib/rateLimit";

// ─── Schemas de validação ─────────────────────────────────────────────────────

const ReservaSchema = z.object({
  produtoId: z.string().uuid("ID de produto inválido"),
  nome: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(120, "Nome muito longo"),
  email: z.string().email("Email inválido"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .max(20, "Telefone inválido")
    .regex(/^[\d\s\(\)\-\+]+$/, "Telefone deve conter apenas números"),
  website: z.string().optional(), // campo honeypot
  recaptchaToken: z.string().optional(),
});

// ─── Verificação reCAPTCHA v3 ─────────────────────────────────────────────────

async function verificarRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    // reCAPTCHA não configurado — fail open em dev
    console.warn("[reCAPTCHA] RECAPTCHA_SECRET_KEY não configurado. Pulando verificação.");
    return true;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`,
      }
    );
    const data = await response.json();
    const score = data.score ?? 0;
    // Score >= 0.5 é humano; abaixo disso é suspeito
    return data.success === true && score >= 0.5;
  } catch (err) {
    console.error("[reCAPTCHA] Erro na verificação:", err);
    return false;
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Rate limiting por IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
      {
        status: 429,
        headers: remaining !== undefined ? { "X-RateLimit-Remaining": String(remaining) } : {},
      }
    );
  }

  // 2. Parse e validação do body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const parse = ReservaSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.issues[0].message },
      { status: 422 }
    );
  }

  const { produtoId, nome, email, telefone, website, recaptchaToken } =
    parse.data;

  // 3. Honeypot — rejeitar silenciosamente se preenchido por bot
  if (website && website.length > 0) {
    // Simula sucesso para não alertar o bot, mas não faz nada
    return NextResponse.json({ ok: true });
  }

  // 4. reCAPTCHA v3
  if (recaptchaToken) {
    const captchaOk = await verificarRecaptcha(recaptchaToken);
    if (!captchaOk) {
      return NextResponse.json(
        { error: "Verificação de segurança falhou. Recarregue a página e tente novamente." },
        { status: 403 }
      );
    }
  }

  // 5. Inicializar cliente admin do Supabase
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Servidor não configurado corretamente." },
      { status: 500 }
    );
  }
  const admin = createAdminClient();

  // 6. Buscar dados do produto (nome + link)
  const { data: produto, error: erroProduto } = await admin
    .from("produtos")
    .select("id, nome, link_mercado_livre, reservado")
    .eq("id", produtoId)
    .single();

  if (erroProduto || !produto) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  if (produto.reservado) {
    return NextResponse.json(
      {
        error:
          "Esse presente acabou de ser escolhido por outra pessoa. Por favor, escolha outro! 💕",
        jaReservado: true,
      },
      { status: 409 }
    );
  }

  // 7. UPDATE condicional — WHERE reservado = false (evita race condition)
  const { data: updated, error: erroUpdate } = await admin
    .from("produtos")
    .update({
      reservado: true,
      reservado_por: nome,
      reservado_em: new Date().toISOString(),
    })
    .eq("id", produtoId)
    .eq("reservado", false) // ← condição atômica anti-race
    .select("id");

  if (erroUpdate) {
    console.error("[Reservar] Erro no update:", erroUpdate.message);
    return NextResponse.json(
      { error: "Erro interno ao reservar o presente." },
      { status: 500 }
    );
  }

  // Se nenhuma linha foi afetada, outro usuário reservou ao mesmo tempo
  if (!updated || updated.length === 0) {
    return NextResponse.json(
      {
        error:
          "Esse presente acabou de ser escolhido por outra pessoa. Por favor, escolha outro! 💕",
        jaReservado: true,
      },
      { status: 409 }
    );
  }

  // 8. INSERT na tabela reservas
  const dataReserva = new Date().toISOString();

  const { error: erroReserva } = await admin.from("reservas").insert({
    produto_id: produtoId,
    nome,
    email,
    telefone,
    criado_em: dataReserva,
  });

  if (erroReserva) {
    console.error("[Reservar] Erro ao salvar reserva:", erroReserva.message);
    // Não revertemos o update — o produto já foi reservado com sucesso
  }

  // 9. Disparos assíncronos (email + sheets) — não bloqueiam a resposta se falharem
  const dadosNotificacao = {
    nomePresenteador: nome,
    emailPresenteador: email,
    telefonePresenteador: telefone,
    nomeProduto: produto.nome,
    dataReserva,
  };

  await Promise.allSettled([
    enviarEmailCasal(dadosNotificacao),
    adicionarLinhaSheets(dadosNotificacao),
  ]);

  // 10. Sucesso — retorna link do ML para redirecionar
  return NextResponse.json({
    ok: true,
    linkMercadoLivre: produto.link_mercado_livre,
    nomeProduto: produto.nome,
  });
}
