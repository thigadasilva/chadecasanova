"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Produto } from "@/lib/types";

// ─── Schema de validação ──────────────────────────────────────────────────────

const ReservaFormSchema = z.object({
  nome: z.string().min(2, "Digite seu nome completo"),
  email: z.string().email("Email inválido"),
  telefone: z
    .string()
    .min(10, "Digite um telefone válido com DDD")
    .regex(/^[\d\s\(\)\-\+]+$/, "Apenas números são permitidos"),
  website: z.string().optional(), // honeypot
});

type ReservaFormData = z.infer<typeof ReservaFormSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReservaModalProps {
  produto: Produto;
  onFechar: () => void;
  onSucesso: (produto: Produto, linkML: string) => void;
}

// ─── Tipos de estado ──────────────────────────────────────────────────────────

type EstadoModal = "formulario" | "carregando" | "escolha_entrega" | "info_envio" | "sucesso" | "erro";

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ReservaModal({ produto, onFechar, onSucesso }: ReservaModalProps) {
  const [estado, setEstado] = useState<EstadoModal>("formulario");
  const [mensagemErro, setMensagemErro] = useState("");
  const [linkML, setLinkML] = useState("");
  const [copied, setCopied] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  function handleEntregarPessoalmente() {
    setEstado("sucesso");
    onSucesso(produto, linkML);
    setTimeout(() => {
      window.open(linkML, "_blank");
    }, 1800);
  }

  function handleComprarEnvio() {
    setEstado("sucesso");
    onSucesso(produto, linkML);
    window.open(linkML, "_blank");
  }

  function handleCopiarEndereco() {
    const address = "Salvador, Areia Branca\nCEP: 41412-334\nCondomínio Lagoa do Abaeté\nTorre 6, Apartamento 402";
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservaFormData>({
    resolver: zodResolver(ReservaFormSchema),
  });

  // Fechar com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onFechar]);

  // Bloquear scroll do body enquanto modal aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Fechar ao clicar no backdrop
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onFechar();
  }

  // Obter token reCAPTCHA v3 (se configurado)
  async function obterRecaptchaToken(): Promise<string | undefined> {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey || typeof window === "undefined" || !window.grecaptcha) return undefined;
    try {
      return await window.grecaptcha.execute(siteKey, { action: "reservar" });
    } catch {
      return undefined;
    }
  }

  // Submissão do formulário
  async function onSubmit(data: ReservaFormData) {
    setEstado("carregando");
    setMensagemErro("");

    try {
      const recaptchaToken = await obterRecaptchaToken();

      const response = await fetch("/api/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produtoId: produto.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          website: data.website,
          recaptchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMensagemErro(result.error ?? "Ocorreu um erro inesperado.");
        setEstado("erro");
        return;
      }

      // Sucesso!
      setLinkML(result.linkMercadoLivre ?? produto.link_mercado_livre);
      setEstado("escolha_entrega");
    } catch {
      setMensagemErro("Erro de conexão. Verifique sua internet e tente novamente.");
      setEstado("erro");
    }
  }

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <div className="modal-panel">
        {/* Botão fechar */}
        <button
          className="modal-close"
          onClick={onFechar}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        {/* ── ESTADO: FORMULÁRIO ── */}
        {(estado === "formulario" || estado === "carregando") && (
          <>
            {/* Cabeçalho */}
            <div style={{ marginBottom: "1.5rem", paddingRight: "2rem" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 4px" }}>
                🎁 Você escolheu
              </p>
              <h2
                id="modal-titulo"
                style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text)", margin: 0, lineHeight: 1.35 }}
              >
                {produto.nome}
              </h2>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Honeypot oculto */}
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Nome */}
                <div className="form-group">
                  <label className="form-label" htmlFor="modal-nome">
                    Seu nome completo *
                  </label>
                  <input
                    id="modal-nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Ex: Maria Silva"
                    className={`form-input${errors.nome ? " error" : ""}`}
                    {...register("nome")}
                  />
                  {errors.nome && (
                    <span className="form-error" role="alert">{errors.nome.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="modal-email">
                    Seu email *
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Ex: maria@email.com"
                    className={`form-input${errors.email ? " error" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="form-error" role="alert">{errors.email.message}</span>
                  )}
                </div>

                {/* Telefone */}
                <div className="form-group">
                  <label className="form-label" htmlFor="modal-telefone">
                    Seu WhatsApp *
                  </label>
                  <input
                    id="modal-telefone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Ex: (11) 99999-9999"
                    className={`form-input${errors.telefone ? " error" : ""}`}
                    {...register("telefone")}
                  />
                  {errors.telefone && (
                    <span className="form-error" role="alert">{errors.telefone.message}</span>
                  )}
                </div>

                {/* Botão */}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={estado === "carregando"}
                  id="btn-confirmar-reserva"
                  style={{ marginTop: "0.5rem", padding: "0.85rem 1.5rem", fontSize: "0.9rem" }}
                >
                  {estado === "carregando" ? (
                    <>
                      <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      Confirmando...
                    </>
                  ) : (
                    "✓ Confirmar escolha"
                  )}
                </button>

                <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", textAlign: "center", margin: 0 }}>
                  Você será redirecionado ao Mercado Livre para comprar o produto.
                </p>
              </div>
            </form>
          </>
        )}

        {/* ── ESTADO: ESCOLHA ENTREGA ── */}
        {estado === "escolha_entrega" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <h2
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.25rem", color: "var(--color-text)", margin: "0 0 0.5rem" }}
            >
              Como você deseja receber o presente?
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                onClick={handleEntregarPessoalmente}
                className="w-full flex flex-col items-center gap-1 p-4 rounded-[16px] border-[1.5px] border-[var(--color-border)] bg-white text-[var(--color-text)] hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer"
              >
                <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>🎉 Vou entregar no almoço</span>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Levo o presente pessoalmente no dia.</span>
              </button>
              
              <button
                onClick={() => setEstado("info_envio")}
                className="w-full flex flex-col items-center gap-1 p-4 rounded-[16px] border-[1.5px] border-[var(--color-border)] bg-white text-[var(--color-text)] hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer"
              >
                <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>📦 Quero enviar para o casal</span>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Não poderei comparecer e vou enviar diretamente para o endereço.</span>
              </button>
            </div>
          </div>
        )}

        {/* ── ESTADO: INFO ENVIO ── */}
        {estado === "info_envio" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <h2
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.25rem", color: "var(--color-text)", margin: "0 0 1.25rem" }}
            >
              📦 Endereço para envio
            </h2>
            
            <div style={{ background: "var(--color-secondary)", padding: "1.25rem", borderRadius: "12px", textAlign: "left", marginBottom: "1.5rem", color: "var(--color-text)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Salvador, Areia Branca<br />
              CEP: 41412-334<br />
              Condomínio Lagoa do Abaeté<br />
              Torre 6, Apartamento 402
            </div>

            <button
              onClick={handleCopiarEndereco}
              className="btn-secondary"
              style={{ marginBottom: "1rem", padding: "0.85rem 1rem", fontSize: "0.9rem", width: "100%" }}
            >
              {copied ? "Endereço copiado! ✓" : "📋 Copiar endereço"}
            </button>

            <button
              onClick={handleComprarEnvio}
              className="btn-primary"
              style={{ padding: "0.85rem 1.5rem", fontSize: "0.95rem", width: "100%" }}
            >
              🛒 Comprar no Mercado Livre
            </button>
          </div>
        )}

        {/* ── ESTADO: SUCESSO ── */}
        {estado === "sucesso" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div className="success-icon">🎁</div>
            <h2
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.35rem", color: "var(--color-text)", margin: "0 0 0.5rem" }}
            >
              Presente confirmado!
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              Obrigado pela sua escolha! 💕<br />
              Você será redirecionado ao Mercado Livre agora.
            </p>
            <a
              href={linkML}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-flex" }}
            >
              Ir para o Mercado Livre ↗
            </a>
            <button
              onClick={onFechar}
              className="btn-secondary"
              style={{ marginTop: "0.75rem" }}
            >
              Voltar à lista
            </button>
          </div>
        )}

        {/* ── ESTADO: ERRO ── */}
        {estado === "erro" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>😔</div>
            <h2
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "1.2rem", color: "var(--color-text)", margin: "0 0 0.75rem" }}
            >
              Ops! Algo deu errado.
            </h2>
            <p style={{ color: "#dc2626", fontSize: "0.9rem", margin: "0 0 1.5rem", lineHeight: 1.6, padding: "0.75rem 1rem", background: "#fff1f2", borderRadius: 12 }}>
              {mensagemErro}
            </p>
            <button
              onClick={() => setEstado("formulario")}
              className="btn-primary"
              style={{ marginBottom: "0.5rem" }}
            >
              Tentar novamente
            </button>
            <button onClick={onFechar} className="btn-secondary">
              Fechar
            </button>
          </div>
        )}
      </div>

      {/* Animação de loading spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Declaração global para reCAPTCHA ─────────────────────────────────────────
declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}
