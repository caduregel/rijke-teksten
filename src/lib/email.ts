import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const siteUrl = "https://rijke-teksten.vercel.app";
const logoUrl = `${siteUrl}/LR.svg`;

// Inline styles + table layout since most email clients strip <style> blocks and ignore modern CSS.
function magicLinkEmailHtml(url: string) {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid #e4e4e7;">
            <img src="${logoUrl}" alt="Lees Routine" width="28" height="28" style="vertical-align:middle;" />
            <span style="font-size:18px;font-weight:600;color:#18181b;vertical-align:middle;margin-left:10px;">Lees<span style="color:#6d28d9;">Routine</span></span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;color:#27272a;font-size:15px;line-height:1.6;">
            <p style="margin:0 0 16px;">Klik op de knop hieronder om in te loggen bij Rijke Teksten.</p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="border-radius:8px;background-color:#6d28d9;">
                  <a href="${url}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                    Inloggen
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:24px 0 0;font-size:13px;color:#71717a;">Deze link verloopt na 1 uur.</p>
            <p style="margin:16px 0 0;font-size:13px;color:#71717a;word-break:break-all;">
              Werkt de knop niet? Kopieer deze link: <a href="${url}" style="color:#6d28d9;">${url}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background-color:#fafafa;border-top:1px solid #e4e4e7;font-size:12px;color:#a1a1aa;">
            Je ontvangt deze e-mail omdat er een inloglink is aangevraagd voor Rijke Teksten.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

function magicLinkEmailText(url: string) {
  return `Klik op de onderstaande link om in te loggen bij Rijke Teksten:\n${url}\n\nDeze link verloopt na 1 uur.`;
}

export async function sendMagicLinkEmail(email: string, url: string) {
  if (!resend) {
    throw new Error(`failed to send magic link, no resend instance: ${resend}`)
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Rijke Teksten <inlog@leesroutine.nl>",
    to: email,
    subject: "Je inloglink voor Rijke Teksten",
    html: magicLinkEmailHtml(url),
    text: magicLinkEmailText(url),
  });

  if (error) {
    throw new Error(`Failed to send magic link email: ${error.message}`);
  }
}

