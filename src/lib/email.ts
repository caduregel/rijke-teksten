import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Falls back to console logging in dev, or if no API key is configured yet.
export async function sendMagicLinkEmail(email: string, url: string) {
  if (!resend) {
    throw new Error(`failed to send magic link, no resend instance: ${resend}`)
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Rijke Teksten <inlog@leesroutine.nl>",
    to: email,
    subject: "Je inloglink voor Rijke Teksten",
    html: `<p>Klik op de onderstaande link om in te loggen:</p><p><a href="${url}">${url}</a></p><p>Deze link verloopt na 1 uur.</p> <br /> <p>Als die link niet werkt, kopieer hem dan hier: ${url}</p>`,
  });

  if (error) {
    throw new Error(`Failed to send magic link email: ${error.message}`);
  }
}

