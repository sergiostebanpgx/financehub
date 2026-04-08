import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { serializeDebt } from "@/lib/serializers";
import { getValidationMessage, updateDebtSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

type DebtUpdateData = {
  name?: string;
  totalAmount?: Prisma.Decimal;
  paidAmount?: Prisma.Decimal;
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
    const existing = await prisma.debt.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "No existe la deuda seleccionada." },
        { status: 404 },
      );
    }

    const payload = updateDebtSchema.parse(await request.json());
    const data: DebtUpdateData = {};

    if (payload.name !== undefined) data.name = payload.name;
    if (payload.totalAmount !== undefined) data.totalAmount = new Prisma.Decimal(payload.totalAmount);
    if (payload.paidAmount !== undefined) data.paidAmount = new Prisma.Decimal(payload.paidAmount);

    const updated = await prisma.debt.update({
      where: { id },
      data,
    });

    return NextResponse.json(serializeDebt(updated));
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
    const deleted = await prisma.debt.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "No existe la deuda seleccionada." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "No fue posible eliminar la deuda." },
      { status: 400 },
    );
  }
}
