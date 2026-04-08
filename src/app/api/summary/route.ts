import { NextResponse } from "next/server";
import { getUserIdOrUnauthorized } from "@/lib/auth-helpers";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await getUserIdOrUnauthorized();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { userId } = authResult;

  try {
    const data = await getDashboardData(userId);
    return NextResponse.json(data.summary);
  } catch {
    return NextResponse.json(
      { message: "No fue posible calcular el resumen." },
      { status: 500 },
    );
  }
}
