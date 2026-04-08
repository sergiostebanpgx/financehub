"use client";

import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { OtpInput } from "@/components/ui/otp-input";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [otpModal, setOtpModal] = useState(false);

  async function startRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // 1. Enviar OTP antes de crear usuario
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, action: 'send' }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.message ?? "Error al enviar código de verificación");
        }
        setOtpModal(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al iniciar el proceso de verificación");
      }
    });
  }

  async function handleVerifyAndRegister(otp: string) {
    startTransition(async () => {
      try {
        // 2. Verificar OTP
        const res = await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, action: 'verify', token: otp }),
        });
        const otpData = await res.json().catch(() => null);
        if (!res.ok) throw new Error(otpData?.message ?? "Código incorrecto");

        // 3. Crear usuario
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const registerData = await response.json().catch(() => null);
        if (!response.ok) throw new Error(registerData?.message ?? "No fue posible crear la cuenta");

        // 4. Iniciar sesión
        const result = await signIn("credentials", { email, password, redirect: false });
        if (result?.error) throw new Error("Error al iniciar sesión");

        router.push("/");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error durante el registro");
        setOtpModal(false);
      }
    });
  }

  return (
    <>
      <form className="space-y-4" onSubmit={startRegistration}>
        <label className="field-label">
          Nombre
          <input className="field-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
        </label>
        <label className="field-label">
          Correo
          <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        </label>
        <label className="field-label">
          Contraseña
          <input className="field-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 8 caracteres" minLength={8} required />
        </label>

        {error && <p className="status-error rounded-xl px-3 py-2 text-sm">{error}</p>}

        <button type="submit" className="btn-gradient w-full" disabled={isPending}>
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</> : <><UserPlus className="h-4 w-4" /> Crear cuenta</>}
        </button>
      </form>

      <Modal isOpen={otpModal} onClose={() => setOtpModal(false)} title="Verifica tu correo">
        <div className="text-center space-y-6">
          <p className="text-slate-400 text-sm">Ingresa el código enviado a {email}</p>
          <OtpInput onComplete={handleVerifyAndRegister} />
        </div>
      </Modal>
    </>
  );
}
