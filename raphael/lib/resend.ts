import { Resend } from "resend";

interface DadosReserva {
  nomePresenteador: string;
  emailPresenteador: string;
  telefonePresenteador: string;
  nomeProduto: string;
}

/**
 * Envia email de notificação para o casal quando um presente é escolhido.
 */
export async function enviarEmailCasal(dados: DadosReserva) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Resend] RESEND_API_KEY não configurado. Email não enviado.");
    return;
  }
  const resend = new Resend(apiKey);

  const emailDestino = process.env.EMAIL_CASAL;
  if (!emailDestino) {
    console.warn("[Resend] EMAIL_CASAL não configurado. Email não enviado.");
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#fdf8f6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(200,132,140,0.12);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#c8848c,#9d5a62);padding:36px 40px;text-align:center;">
              <div style="font-size:2.2rem;margin-bottom:8px;">🏡</div>
              <h1 style="margin:0;color:#fff;font-size:1.4rem;font-family:Georgia,serif;font-weight:600;letter-spacing:0.02em;">
                Novo Presente Escolhido!
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.82);font-size:0.9rem;font-family:Arial,sans-serif;">
                Raphael &amp; Karol — Chá de Casa Nova
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 24px;font-size:1rem;color:#7c6464;font-family:Arial,sans-serif;line-height:1.6;">
                Boa notícia! Alguém acaba de escolher um presente da lista:
              </p>

              <!-- Destaque do produto -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede8;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:0.75rem;font-weight:600;color:#c8848c;text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">
                      🎁 Presente
                    </p>
                    <p style="margin:0;font-size:1.15rem;font-weight:600;color:#3d2c2c;font-family:Georgia,serif;">
                      ${dados.nomeProduto}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Dados da pessoa -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 14px;">
                    <p style="margin:0 0 3px;font-size:0.73rem;font-weight:600;color:#7c6464;text-transform:uppercase;letter-spacing:0.06em;font-family:Arial,sans-serif;">👤 Nome</p>
                    <p style="margin:0;font-size:1rem;color:#3d2c2c;font-family:Arial,sans-serif;">${dados.nomePresenteador}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;border-top:1px solid #f0ddd9;padding-top:14px;">
                    <p style="margin:0 0 3px;font-size:0.73rem;font-weight:600;color:#7c6464;text-transform:uppercase;letter-spacing:0.06em;font-family:Arial,sans-serif;">✉️ Email</p>
                    <p style="margin:0;font-size:1rem;color:#3d2c2c;font-family:Arial,sans-serif;">
                      <a href="mailto:${dados.emailPresenteador}" style="color:#c8848c;text-decoration:none;">${dados.emailPresenteador}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;border-top:1px solid #f0ddd9;padding-top:14px;">
                    <p style="margin:0 0 3px;font-size:0.73rem;font-weight:600;color:#7c6464;text-transform:uppercase;letter-spacing:0.06em;font-family:Arial,sans-serif;">📱 WhatsApp</p>
                    <p style="margin:0;font-size:1rem;color:#3d2c2c;font-family:Arial,sans-serif;">
                      <a href="https://wa.me/55${dados.telefonePresenteador.replace(/\D/g, '')}" style="color:#c8848c;text-decoration:none;">${dados.telefonePresenteador}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#fdf8f6;padding:20px 40px;text-align:center;border-top:1px solid #f0ddd9;">
              <p style="margin:0;font-size:0.78rem;color:#7c6464;font-family:Arial,sans-serif;">
                💕 Lista de Chá de Casa Nova — Raphael &amp; Karol
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const { error } = await resend.emails.send({
    from: "Chá de Casa Nova <onboarding@resend.dev>",
    to: emailDestino,
    subject: `🎁 ${dados.nomePresenteador} escolheu "${dados.nomeProduto}"!`,
    html,
  });

  if (error) {
    console.error("[Resend] Erro ao enviar email:", error);
    throw new Error(`Falha ao enviar email: ${error.message}`);
  }
}
