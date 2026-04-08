import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { serializeSavingGoal } from "@/lib/serializers";
import { createSavingGoalSchema, getValidationMessage } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await getUserIdOrUnauthorized();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const goals = await prisma.savingGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals.map(serializeSavingGoal));
  } catch {
    return NextResponse.json(
      { message: "No fue posible cargar las metas de ahorro." },
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
    const payload = createSavingGoalSchema.parse(await request.json());
    const goal = await prisma.savingGoal.create({
      data: {
        name: payload.name,
        targetAmount: payload.targetAmount,
        savedAmount: payload.savedAmount ?? 0,
        userId,
      },
    });
    return NextResponse.json(serializeSavingGoal(goal), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getValidationMessage(error) },
      { status: 400 },
    );
  }
}
