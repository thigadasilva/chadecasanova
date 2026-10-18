"use client";

import { useCallback, useEffect, useState } from "react";
import ProdutoCard from "@/components/ProdutoCard";
import ReservaModal from "@/components/ReservaModal";
import Hero from "@/components/Hero";
import EventInfo from "@/components/EventInfo";
import type { Produto } from "@/lib/types";

// ─── Configuração do site (via env ou padrão) ─────────────────────────────────
const NOME_CASAL =
  process.env.NEXT_PUBLIC_NOME_CASAL ?? "Raphael & Karol";

const MENSAGEM_BOAS_VINDAS =
  process.env.NEXT_PUBLIC_MENSAGEM_BOAS_VINDAS ??
  "Estamos construindo nosso lar juntos e adoraríamos contar com a sua presença nessa conquista tão especial! 🏡";

const DATA_EVENTO =
  process.env.NEXT_PUBLIC_DATA_EVENTO ?? "";

// ─── Imagem de capa placeholder ───────────────────────────────────────────────
const FOTO_CAPA =
  process.env.NEXT_PUBLIC_FOTO_CAPA_URL ??
  "https://images.unsplash.com/photo-1516685018646-549198525c1b?w=1200&q=80";

// ─── Componente de esqueleto de carregamento ──────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        background: "#fff",
      }}
    >
      <div className="skeleton" style={{ width: "100%", paddingTop: "85%" }} />
      <div style={{ padding: "1rem" }}>
        <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: "55%", marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 36, borderRadius: 50 }} />
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function HomePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todos");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  // Carregar produtos
  const carregarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");
      const res = await fetch("/api/produtos");
      if (!res.ok) throw new Error("Erro ao carregar lista de presentes.");
      const data: Produto[] = await res.json();
      setProdutos(data);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // Categorias únicas
  const categorias = [
    "Todos",
    ...Array.from(
      new Set(produtos.map((p) => p.categoria).filter(Boolean) as string[])
    ).sort(),
  ];

  // Filtro
  const produtosFiltrados =
    categoriaAtiva === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaAtiva);

  // Contadores
  const totalDisponiveis = produtos.filter((p) => !p.reservado).length;
  const totalReservados = produtos.filter((p) => p.reservado).length;

  // Ao confirmar reserva com sucesso
  function handleSucesso(produto: Produto, _linkML: string) {
    // Marca o produto como reservado localmente (sem refetch)
    setProdutos((prev) =>
      prev.map((p) => (p.id === produto.id ? { ...p, reservado: true } : p))
    );
    // Fecha o modal após alguns segundos (o modal se auto-fecha via redirect)
    setTimeout(() => setProdutoSelecionado(null), 3500);
  }

  return (
    <>
      {/* reCAPTCHA v3 — carregado só quando a chave estiver configurada */}
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        />
      )}

      {/* ── HERO ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── INFORMAÇÕES DO EVENTO ────────────────────────────── */}
      <EventInfo />

      {/* ── CONTEÚDO PRINCIPAL ───────────────────────────────── */}
      <main
        id="presentes"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)",
        }}
      >
        {/* Título da seção */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="divider-rose" style={{ marginBottom: "1.25rem" }}>
            <span>💕</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-playfair, Georgia, serif)",
              fontSize: "clamp(1.4rem, 3.5vw, 1.9rem)",
              fontWeight: 700,
              color: "var(--color-text)",
              margin: "0 0 0.4rem",
            }}
          >
            Lista de Presentes
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem", margin: 0 }}>
            Chá de Casa Nova — {NOME_CASAL}
          </p>

          {/* Contadores */}
          {!carregando && produtos.length > 0 && (
            <div
              style={{
                display: "inline-flex",
                gap: "1.5rem",
                marginTop: "1rem",
                padding: "0.6rem 1.5rem",
                background: "var(--color-secondary)",
                borderRadius: 50,
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                <strong style={{ color: "var(--color-primary)" }}>{totalDisponiveis}</strong> disponíveis
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                <strong style={{ color: "var(--color-accent)" }}>{totalReservados}</strong> escolhidos
              </span>
            </div>
          )}
        </div>

        {/* Filtros de categoria */}
        {!carregando && categorias.length > 2 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "0.5rem",
              marginBottom: "1.5rem",
              scrollbarWidth: "none",
            }}
          >
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`filtro-btn${categoriaAtiva === cat ? " ativo" : ""}`}
                onClick={() => setCategoriaAtiva(cat)}
                id={`filtro-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Estado de erro */}
        {erro && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#dc2626",
            }}
          >
            <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>😔</p>
            <p style={{ margin: "0 0 1rem" }}>{erro}</p>
            <button className="btn-primary" style={{ width: "auto", padding: "0.6rem 1.5rem" }} onClick={carregarProdutos}>
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de produtos */}
        {!erro && (
          <div className="produtos-grid">
            {carregando
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : produtosFiltrados.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  onEscolher={setProdutoSelecionado}
                />
              ))}
          </div>
        )}

        {/* Estado vazio após filtro */}
        {!carregando && !erro && produtosFiltrados.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
            <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🔍</p>
            <p>Nenhum produto encontrado nessa categoria.</p>
          </div>
        )}
      </main>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "1.5rem 1rem",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.78rem",
          background: "var(--color-secondary)",
        }}
      >
        <p style={{ margin: 0 }}>
          💕 Feito com amor para o Chá de Casa Nova de{" "}
          <strong style={{ color: "var(--color-primary)" }}>{NOME_CASAL}</strong>
        </p>
      </footer>

      {/* ── MODAL DE RESERVA ─────────────────────────────────── */}
      {produtoSelecionado && (
        <ReservaModal
          produto={produtoSelecionado}
          onFechar={() => setProdutoSelecionado(null)}
          onSucesso={handleSucesso}
        />
      )}
    </>
  );
}
