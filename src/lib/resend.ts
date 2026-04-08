import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM ?? 'onboarding@resend.dev';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendOtpEmail(email: string, otp: string) {
  if (!resend) {
    throw new Error("RESEND_API_KEY no esta configurada.");
  }

  const { error } = await resend.emails.send({
    from: `FinanceHub <${resendFrom}>`,
    to: email,
    subject: 'Tu código de verificación - FinanceHub',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #020617; color: #f8fafc; padding: 40px; border-radius: 24px;">
        <h1 style="color: #22d3ee; margin-bottom: 20px;">Verificación FinanceHub</h1>
        <p style="font-size: 16px; line-height: 1.5;">Hola,</p>
        <p style="font-size: 16px; line-height: 1.5;">Para continuar, ingresa el siguiente código de 6 dígitos:</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 16px; text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.5em; color: #fff;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #64748b;">Este código expira en 10 minutos. Si no solicitaste este código, ignora este mensaje.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Resend no pudo enviar el correo OTP.");
  }
}
