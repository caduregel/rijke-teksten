// TODO: swap this out for a real email provider (Resend, Postmark, ...) before going live.
export async function sendMagicLinkEmail(email: string, url: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[dev] Magic link for ${email}: ${url}`);
    return;
  }

  throw new Error("sendMagicLinkEmail has no production email provider configured yet");
}
