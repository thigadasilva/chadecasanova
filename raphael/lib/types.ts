export interface Produto {
  id: string;
  nome: string;
  imagem_url: string;
  link_mercado_livre: string;
  categoria?: string | null;
  reservado: boolean;
  reservado_por?: string | null;
  reservado_em?: string | null;
}

/**
 * Produtos mockados para desenvolvimento sem Supabase configurado.
 * Serão substituídos pelos dados reais após conectar ao Supabase.
 */
export const PRODUTOS_MOCK: Produto[] = [
  {
    id: "mock-1",
    nome: "Jogo de Panelas Antiaderente 5 Peças",
    imagem_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
    link_mercado_livre: "https://www.mercadolivre.com.br",
    categoria: "Cozinha",
    reservado: false,
  },
  {
    id: "mock-2",
    nome: "Liquidificador 1000W com Jarra de Vidro",
    imagem_url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
    link_mercado_livre: "https://www.mercadolivre.com.br",
    categoria: "Cozinha",
    reservado: true,
    reservado_por: "Ana",
  },
  {
    id: "mock-3",
    nome: "Jogo de Cama Queen 400 Fios",
    imagem_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    link_mercado_livre: "https://www.mercadolivre.com.br",
    categoria: "Quarto",
    reservado: false,
  },
  {
    id: "mock-4",
    nome: "Aspirador de Pó Robô Inteligente",
    imagem_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    link_mercado_livre: "https://www.mercadolivre.com.br",
    categoria: "Casa",
    reservado: false,
  },
  {
    id: "mock-5",
    nome: "Cafeteira Expresso Automática",
    imagem_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    link_mercado_livre: "https://www.mercadolivre.com.br",
    categoria: "Cozinha",
    reservado: true,
    reservado_por: "Carlos",
  },
  {
    id: "mock-6",
    nome: "Toalhas de Banho Felpudas — Kit 4 Peças",
    imagem_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    link_mercado_livre: "https://www.mercadolivre.com.br",
    categoria: "Banheiro",
    reservado: false,
  },
  {
    id: "mock-7",
    nome: "Micro-ondas 30L Espelhado",
    imagem_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
    link_mercado_livre: "https://www.mercadolivre.com.br",
    categoria: "Cozinha",
    reservado: false,
  },
  {
    id: "mock-8",
    nome: "Luminária de Mesa Design Nórdico",
    imagem_url: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=400&q=80",
    link_mercado_livre: "https://www.mercadolivre.com.br",
    categoria: "Decoração",
    reservado: false,
  },
];
