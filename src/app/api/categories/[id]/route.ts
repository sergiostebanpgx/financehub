import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getValidationMessage, updateCategorySchema } from "@/lib/validators";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: Context) {
  const authResult = await getUserIdOrUnauthorized();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { userId } = authResult;

  const { id } = await context.params;

  try {
    const existing = await prisma.category.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "No existe la categoria seleccionada." },
        { status: 404 },
      );
    }

    const payload = updateCategorySchema.parse(await request.json());

    const updated = await prisma.category.update({
      where: { id },
      data: payload,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: getValidationMessage(error) },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, context: Context) {
  const authResult = await getUserIdOrUnauthorized();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { userId } = authResult;

  const { id } = await context.params;

  try {
    // Verificar si tiene transacciones asociadas
    const transactionsCount = await prisma.transaction.count({
      where: { categoryId: id },
    });

    if (transactionsCount > 0) {
      return NextResponse.json(
        { message: "No puedes eliminar una categoria que tiene movimientos asociados." },
        { status: 400 },
      );
    }

    const deleted = await prisma.category.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "No existe la categoria seleccionada." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "No fue posible eliminar la categoria." },
      { status: 400 },
    );
  }
}
