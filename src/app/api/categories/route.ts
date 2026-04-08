import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createCategorySchema, getValidationMessage } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await getUserIdOrUnauthorized();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { message: "No fue posible cargar las categorias." },
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
    const payload = createCategorySchema.parse(await request.json());
    const category = await prisma.category.create({
      data: {
        ...payload,
        userId,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getValidationMessage(error) },
      { status: 400 },
    );
  }
}
