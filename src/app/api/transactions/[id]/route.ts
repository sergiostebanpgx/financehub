import { Prisma, type TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serializers";
import { getValidationMessage, updateTransactionSchema } from "@/lib/validators";

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
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "No existe un movimiento con ese id para tu cuenta." },
        { status: 404 },
      );
    }

    const payload = updateTransactionSchema.parse(await request.json());
    const data: Record<string, unknown> = {};

    if (payload.type) data.type = payload.type as TransactionType;
    if (payload.amount !== undefined) {
      data.amount = new Prisma.Decimal(payload.amount);
    }
    if (payload.description !== undefined) data.description = payload.description;
    if (payload.date !== undefined) data.date = payload.date;
    if (payload.notes !== undefined) data.notes = payload.notes;
    if (payload.categoryId !== undefined) {
      const category = await prisma.category.findFirst({
        where: {
          id: payload.categoryId,
          userId,
        },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { message: "La categoria seleccionada no existe para tu cuenta." },
          { status: 400 },
        );
      }

      data.categoryId = payload.categoryId;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(serializeTransaction(updated));
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
    const deleted = await prisma.transaction.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "No existe un movimiento con ese id para tu cuenta." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "No fue posible eliminar la transaccion." },
      { status: 400 },
    );
  }
}
