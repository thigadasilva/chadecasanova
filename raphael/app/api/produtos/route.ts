import { getSupabaseClient } from "@/lib/supabase";
import type { Produto } from "@/lib/types";
import { PRODUTOS_MOCK } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Se o Supabase não estiver configurado, retorna dados mock
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(PRODUTOS_MOCK);
  }

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("produtos")
      .select(
        "id, nome, imagem_url, link_mercado_livre, categoria, reservado, reservado_por, reservado_em"
      )
      .order("reservado", { ascending: true }) // disponíveis primeiro
      .order("nome", { ascending: true });

    if (error) {
      console.error("[API /produtos] Erro Supabase:", error.message);
      return NextResponse.json(
        { error: "Não foi possível carregar os produtos." },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Produto[]);
  } catch (err) {
    console.error("[API /produtos] Erro inesperado:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
