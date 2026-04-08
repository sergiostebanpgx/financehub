import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { serializeSavingGoal } from "@/lib/serializers";
import { getValidationMessage, updateSavingGoalSchema } from "@/lib/validators";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

type SavingGoalUpdateData = {
  name?: string;
  targetAmount?: number;
  savedAmount?: number;
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
    const existing = await prisma.savingGoal.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "No existe la meta de ahorro seleccionada." },
        { status: 404 },
      );
    }

    const payload = updateSavingGoalSchema.parse(await request.json());
    const data: SavingGoalUpdateData = {};

    if (payload.name !== undefined) data.name = payload.name;
    if (payload.targetAmount !== undefined) data.targetAmount = payload.targetAmount;
    if (payload.savedAmount !== undefined) data.savedAmount = payload.savedAmount;

    const updated = await prisma.savingGoal.update({
      where: { id },
      data,
    });

    return NextResponse.json(serializeSavingGoal(updated));
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
    const deleted = await prisma.savingGoal.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "No existe la meta de ahorro seleccionada." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "No fue posible eliminar la meta de ahorro." },
      { status: 400 },
    );
  }
}
