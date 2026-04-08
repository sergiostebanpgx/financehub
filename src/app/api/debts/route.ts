import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { serializeDebt } from "@/lib/serializers";
import { createDebtSchema, getValidationMessage } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await getUserIdOrUnauthorized();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const debts = await prisma.debt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(debts.map(serializeDebt));
  } catch {
    return NextResponse.json(
      { message: "No fue posible cargar las deudas." },
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
    const payload = createDebtSchema.parse(await request.json());
    const debt = await prisma.debt.create({
      data: {
        name: payload.name,
        totalAmount: payload.totalAmount,
        paidAmount: payload.paidAmount ?? 0,
        userId,
      },
    });
    return NextResponse.json(serializeDebt(debt), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getValidationMessage(error) },
      { status: 400 },
    );
  }
}
