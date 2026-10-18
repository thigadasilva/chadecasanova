interface DadosLinha {
  nomeProduto: string;
  nomePresenteador: string;
  emailPresenteador: string;
  telefonePresenteador: string;
  dataReserva: string;
}

/**
 * Adiciona uma linha na planilha Google via SheetDB.
 * Configure SHEETDB_API_URL com a URL da sua API SheetDB.
 *
 * Como configurar:
 * 1. Acesse https://sheetdb.io e conecte sua planilha Google
 * 2. Copie a URL da API (ex: https://sheetdb.io/api/v1/XXXXXXXXXX)
 * 3. Configure SHEETDB_API_URL no .env.local
 *
 * A planilha deve ter as colunas (primeira linha):
 * Produto | Nome | Email | Telefone | Data
 */
export async function adicionarLinhaSheets(dados: DadosLinha): Promise<void> {
  const sheetdbUrl = process.env.SHEETDB_API_URL;

  if (!sheetdbUrl) {
    console.warn("[SheetDB] SHEETDB_API_URL não configurado. Planilha não atualizada.");
    return;
  }

  // Formata a data ISO para o padrão brasileiro (DD/MM/YYYY)
  const dataFormatada = new Date(dados.dataReserva).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const payload = {
    data: [
      {
        Produto: dados.nomeProduto,
        Nome: dados.nomePresenteador,
        Email: dados.emailPresenteador,
        Telefone: dados.telefonePresenteador,
        Data: dataFormatada,
      },
    ],
  };

  const response = await fetch(sheetdbUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[SheetDB] Erro ao adicionar linha:", text);
    throw new Error(`SheetDB retornou status ${response.status}`);
  }
}
