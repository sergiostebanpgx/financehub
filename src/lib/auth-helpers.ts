import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

type Authorized = {
  userId: string;
};

type Unauthorized = {
  response: NextResponse<{ message: string }>;
};

export async function getUserIdOrUnauthorized(): Promise<
  Authorized | Unauthorized
> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    const response = NextResponse.json(
      { message: "No autorizado. Inicia sesion para continuar." },
      { status: 401 },
    );

    return {
      response,
    } satisfies Unauthorized;
  }

  return {
    userId,
  } satisfies Authorized;
}
