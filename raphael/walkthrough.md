# 🏡 Projeto Concluído: Chá de Casa Nova

O desenvolvimento do site foi concluído com sucesso! Ele foi arquitetado para ser rápido, seguro e muito fácil de usar no celular. Abaixo você encontra o resumo do que foi implementado e os próximos passos.

## ✨ O que foi construído

1. **Design System "Rosé"**:
   - Tema romântico e elegante.
   - Fontes *Playfair Display* (títulos) e *Inter* (textos).
   - Efeitos visuais modernos (backdrop blur, sombras suaves, micro-animações).
   - Layout 100% responsivo (mobile-first).

2. **Fluxo de Reserva (Anti-corrida)**:
   - Se duas pessoas tentarem reservar o mesmo presente no mesmo milissegundo, o banco de dados (Supabase) garante que apenas uma consiga, exibindo uma mensagem amigável para a outra.
   - O usuário é automaticamente redirecionado para a página do produto no Mercado Livre ao confirmar.
   - Produtos reservados ganham um selo "Já escolhido" e opacidade reduzida, mas ainda permitem que as pessoas cliquem para ver o item.

3. **Integrações Assíncronas**:
   - **Resend**: Dispara um email HTML lindamente formatado (seguindo o tema visual do site) avisando você sobre quem reservou o quê.
   - **SheetDB**: Salva automaticamente uma linha na sua planilha do Google Sheets.

4. **Camadas de Segurança**:
   - **Rate Limiting**: Configurado via Upstash Redis para suportar o ambiente serverless da Vercel. Bloqueia IPs que tentarem fazer mais de 5 reservas em 10 minutos.
   - **Honeypot**: Um campo invisível no formulário pega robôs (bots preenchem tudo).
   - **reCAPTCHA v3**: Código já embutido. Basta adicionar as chaves para ter análise de score invisível.
   - **Validação de Dados**: O backend usa `Zod` para garantir que e-mails e telefones sejam reais antes de bater no banco.

---

## 🚀 Como testar agora mesmo

Você já pode rodar o projeto localmente para ver como ficou com os dados mockados!

1. Abra seu terminal.
2. Acesse a pasta do projeto e inicie o servidor:
   ```bash
   cd c:\Users\cliente\Downloads\raphael
   npm run dev
   ```
3. Abra `http://localhost:3000` no seu navegador.

> [!TIP]
> **Desenvolvimento local sem Supabase**
> O site foi programado para funcionar com *dados mockados* (fictícios) enquanto as chaves do Supabase não forem configuradas. Você pode testar toda a interface e o filtro de categorias imediatamente!

---

## ⚙️ Próximos Passos (Configuração de Produção)

Quando você for subir para a Vercel, siga este passo a passo:

### 1. Configure as Variáveis de Ambiente
Na raiz do projeto, existe um arquivo chamado `\.env.example`. Copie o conteúdo dele, crie um arquivo chamado `.env.local` na sua máquina (e depois cadastre na aba *Environment Variables* da Vercel) e preencha os valores.

### 2. Configure o Banco de Dados (Supabase)
No diretório `supabase/schema.sql`, deixei o script completo pronto.
- Vá no painel do Supabase > SQL Editor e cole o script.
- Ele criará as tabelas, índices e as regras de segurança (RLS).
- Você poderá cadastrar seus presentes manualmente usando o Table Editor do Supabase.

### 3. Deploy na Vercel
1. Faça o commit e push do projeto para um repositório no GitHub.
2. Na Vercel, importe o repositório.
3. Cole as variáveis do seu `.env.local` nas configurações da Vercel antes de clicar em "Deploy".

> [!NOTE]
> Deixei uma imagem de espaço reservado (placeholder) muito bonita para a capa. Quando quiser trocar, basta alterar a variável `NEXT_PUBLIC_FOTO_CAPA_URL` ou substituir a imagem base do projeto.

---

Se precisar de qualquer ajuste no design ou tiver dúvidas na hora de conectar o Supabase ou o SheetDB, me avise!
