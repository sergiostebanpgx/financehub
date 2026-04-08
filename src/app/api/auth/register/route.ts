import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { defaultCategories } from "@/lib/default-categories";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z
    .string({ message: "El nombre es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(80, "El nombre no puede superar los 80 caracteres."),
  email: z
    .string({ message: "El correo es obligatorio." })
    .trim()
    .email("Correo invalido.")
    .transform((value) => value.toLowerCase()),
  password: z
    .string({ message: "La contrasena es obligatoria." })
    .min(8, "La contrasena debe tener minimo 8 caracteres.")
    .max(72, "La contrasena es demasiado larga."),
});

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con ese correo." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    await prisma.category.createMany({
      data: defaultCategories.map((category) => ({
        ...category,
        userId: user.id,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message
        : "No fue posible crear la cuenta.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
