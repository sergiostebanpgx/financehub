import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres").optional(),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) return false;
  return true;
}, { 
  message: "Debes incluir la contraseña actual para poder establecer una nueva",
  path: ["currentPassword"]
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        message: result.error.issues[0]?.message ?? "Datos no válidos" 
      }, { status: 400 });
    }

    const payload = result.data;
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const updateData: any = {};
    
    // Actualizar nombre si se proporciona
    if (payload.name) {
      updateData.name = payload.name;
    }

    // Actualizar contraseña si se proporciona la nueva
    if (payload.newPassword) {
      if (!payload.currentPassword) {
        return NextResponse.json({ message: "La contraseña actual es obligatoria" }, { status: 400 });
      }

      // IMPORTANTE: El campo en la DB es passwordHash
      const isPasswordValid = await bcrypt.compare(payload.currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json({ message: "La contraseña actual es incorrecta" }, { status: 400 });
      }

      updateData.passwordHash = await bcrypt.hash(payload.newPassword, 12);
    }

    // Si no hay nada que actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No se enviaron campos para actualizar" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ 
      message: "Hubo un error inesperado al procesar la solicitud" 
    }, { status: 500 });
  }
}
