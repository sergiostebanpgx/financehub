"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales inválidas. Intenta nuevamente.");
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="field-label">
        Correo
        <input
          className="field-input login-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
          required
        />
      </label>

      <label className="field-label">
        Contraseña
        <input
          className="field-input login-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Contraseña"
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p className="status-error rounded-xl px-3 py-2 text-sm">
          {error}
        </p>
      )}

      <button type="submit" className="btn-gradient mt-2 w-full py-3.5 text-base" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          <>
            Ingresar
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-(--text-secondary) pt-1 text-center text-[1.02rem]">
        ¿No tienes cuenta?{" "}
        <Link className="text-(--accent-cyan) font-semibold hover:text-cyan-200" href="/registro">
          Crear cuenta
        </Link>
      </p>

      <p className="text-(--text-secondary) text-center text-[1.02rem]">
        <Link className="login-link" href="/registro">
          Recuperar acceso
        </Link>
      </p>
    </form>
  );
}
