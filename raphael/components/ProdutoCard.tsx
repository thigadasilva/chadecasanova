"use client";

import type { Produto } from "@/lib/types";

interface ProdutoCardProps {
  produto: Produto;
  onEscolher: (produto: Produto) => void;
}

export default function ProdutoCard({ produto, onEscolher }: ProdutoCardProps) {
  const { nome, imagem_url, link_mercado_livre, categoria, reservado } = produto;

  return (
    <article className={`produto-card${reservado ? " reservado" : ""}`}>
      {/* Imagem */}
      <div className="produto-img-wrapper">
        <img
          src={imagem_url}
          alt={nome}
          className="produto-img"
          loading="lazy"
        />

        {/* Badge "Já escolhido" */}
        {reservado && (
          <div className="badge-reservado">
            <span>✓</span>
            <span>Já escolhido</span>
          </div>
        )}

        {/* Badge de categoria */}
        {categoria && !reservado && (
          <div className="badge-categoria">{categoria}</div>
        )}
      </div>

      {/* Corpo */}
      <div className="produto-body">
        <h3 className="produto-nome">{nome}</h3>

        {categoria && reservado && (
          <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", margin: 0 }}>
            {categoria}
          </p>
        )}

        {/* Ações */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.25rem" }}>
          {!reservado ? (
            /* Produto disponível */
            <>
              <button
                className="btn-primary"
                onClick={() => onEscolher(produto)}
                id={`escolher-${produto.id}`}
                aria-label={`Escolher o presente: ${nome}`}
              >
                🎁 Escolher este presente
              </button>
              <a
                href={link_mercado_livre}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                aria-label={`Ver ${nome} no Mercado Livre`}
              >
                Ver no Mercado Livre ↗
              </a>
            </>
          ) : (
            /* Produto reservado */
            <a
              href={link_mercado_livre}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label={`Ver ${nome} no Mercado Livre`}
            >
              Ver no Mercado Livre ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
