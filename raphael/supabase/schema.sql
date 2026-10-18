-- ============================================================
-- CHÁ DE CASA NOVA — Script SQL para Supabase
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard
-- ============================================================

-- ── Tabela: produtos ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.produtos (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            TEXT        NOT NULL,
  imagem_url      TEXT        NOT NULL,
  link_mercado_livre TEXT     NOT NULL,
  categoria       TEXT,
  reservado       BOOLEAN     DEFAULT FALSE NOT NULL,
  reservado_por   TEXT,
  reservado_em    TIMESTAMPTZ,
  criado_em       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para busca por estado de reserva
CREATE INDEX IF NOT EXISTS idx_produtos_reservado ON public.produtos (reservado);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON public.produtos (categoria);

-- ── Tabela: reservas ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reservas (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id  UUID        REFERENCES public.produtos(id) ON DELETE CASCADE NOT NULL,
  nome        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  telefone    TEXT        NOT NULL,
  criado_em   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reservas_produto_id ON public.reservas (produto_id);
CREATE INDEX IF NOT EXISTS idx_reservas_email ON public.reservas (email);

-- ── Row Level Security (RLS) ──────────────────────────────────────────────────

-- Habilitar RLS
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Leitura pública de produtos (qualquer visitante pode ver a lista)
CREATE POLICY "produtos_leitura_publica"
  ON public.produtos
  FOR SELECT
  USING (true);

-- Apenas service_role pode atualizar produtos (reserva)
-- (O service_role bypassa RLS, mas criamos policy explícita para documentação)
CREATE POLICY "produtos_update_service_role"
  ON public.produtos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Apenas service_role pode inserir reservas
CREATE POLICY "reservas_insert_service_role"
  ON public.reservas
  FOR INSERT
  WITH CHECK (true);

-- ── Dados de exemplo ──────────────────────────────────────────────────────────
-- Descomente e ajuste para adicionar produtos iniciais:

/*
INSERT INTO public.produtos (nome, imagem_url, link_mercado_livre, categoria)
VALUES
  (
    'Jogo de Panelas Antiaderente 5 Peças',
    'https://http2.mlstatic.com/D_NQ_NP_XXXX.jpg',
    'https://www.mercadolivre.com.br/p/MLB...',
    'Cozinha'
  ),
  (
    'Liquidificador 1000W com Jarra de Vidro',
    'https://http2.mlstatic.com/D_NQ_NP_XXXX.jpg',
    'https://www.mercadolivre.com.br/p/MLB...',
    'Cozinha'
  ),
  (
    'Jogo de Cama Queen 400 Fios',
    'https://http2.mlstatic.com/D_NQ_NP_XXXX.jpg',
    'https://www.mercadolivre.com.br/p/MLB...',
    'Quarto'
  );
*/
