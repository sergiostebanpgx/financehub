import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serializers";
import { createTransactionSchema, getValidationMessage } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authResult = await getUserIdOrUnauthorized();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number(searchParams.get("limit") ?? "20");
    const take = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 20;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
      take,
    });

    return NextResponse.json(transactions.map(serializeTransaction));
  } catch {
    return NextResponse.json(
      { message: "No fue posible cargar los movimientos." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authResult = await getUserIdOrUnauthorized();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const payload = createTransactionSchema.parse(await request.json());
    const category = await prisma.category.findFirst({
      where: {
        id: payload.categoryId,
        userId,
      },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { message: "La categoria seleccionada no existe para este usuario." },
        { status: 400 },
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: payload.type,
        amount: payload.amount,
        description: payload.description,
        date: payload.date,
        notes: payload.notes,
        categoryId: payload.categoryId,
        userId,
      },
      include: { category: true },
    });

    return NextResponse.json(serializeTransaction(transaction), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getValidationMessage(error) },
      { status: 400 },
    );
  }
}
