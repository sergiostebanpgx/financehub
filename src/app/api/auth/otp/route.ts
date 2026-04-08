import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/resend";
import crypto from "crypto";
import { z } from "zod";

const otpSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("send"),
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
  }),
  z.object({
    action: z.literal("verify"),
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    token: z.string().trim().length(6, "El codigo debe tener 6 digitos."),
  }),
]);

export async function POST(request: Request) {
  try {
    const parsed = otpSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Solicitud invalida." },
        { status: 400 },
      );
    }

    if (parsed.data.action === "send") {
      const { email } = parsed.data;
      const token = crypto.randomInt(100000, 999999).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      // Limpiar tokens anteriores para este email
      await prisma.verificationToken.deleteMany({ where: { email } });

      await prisma.verificationToken.create({
        data: { email, token, expires },
      });

      await sendOtpEmail(email, token);
      return NextResponse.json({ message: "Código enviado" });
    }

    const { email, token } = parsed.data;
    const record = await prisma.verificationToken.findFirst({
      where: { email, token },
    });

    if (!record || record.expires < new Date()) {
      return NextResponse.json(
        { message: "Código inválido o expirado" },
        { status: 400 },
      );
    }

    // Código válido: eliminar token y retornar éxito
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No fue posible procesar la solicitud OTP.";

    console.error("OTP error:", message);

    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}
