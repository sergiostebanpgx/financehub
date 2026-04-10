import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main className="login-shell mx-auto flex min-h-dvh w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="login-card w-full max-w-[460px] p-8 sm:p-10 animate-scale-in">
        <div className="text-center">
          <p className="chip-badge mx-auto inline-flex items-center gap-2 px-5 py-2">
            <span>FinanceHub</span>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.22em] text-cyan-100/90">
              BETA
            </span>
          </p>

          <h1
            className="panel-title mt-8 animate-slide-up text-center text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ animationDelay: "150ms" }}
          >
            Bienvenido de nuevo
          </h1>
          <p
            className="panel-subtitle mt-4 animate-slide-up text-center text-base"
            style={{ animationDelay: "250ms" }}
          >
            Inicia sesión para acceder a tu dashboard financiero.
          </p>
        </div>

        <div
          className="mt-10 animate-slide-up"
          style={{ animationDelay: "350ms" }}
        >
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
