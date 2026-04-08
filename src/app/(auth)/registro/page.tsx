import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main className="login-shell mx-auto flex min-h-dvh w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="login-card mx-auto w-full max-w-[460px] p-8 sm:p-10 animate-scale-in">
        <p className="chip-badge inline-flex px-5 py-2">
          FinanceHub
        </p>

        <h1
          className="panel-title mt-8 animate-slide-up text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ animationDelay: "150ms" }}
        >
          Crea tu cuenta
        </h1>
        <p
          className="panel-subtitle mt-3 animate-slide-up text-sm sm:text-base"
          style={{ animationDelay: "250ms" }}
        >
          Configura tu acceso y empieza a registrar tus movimientos hoy.
        </p>

        <div
          className="mt-8 animate-slide-up"
          style={{ animationDelay: "350ms" }}
        >
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
