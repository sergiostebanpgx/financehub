"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsIcon, PowerIcon } from "@/components/ui/pretty-icons";
import { Modal } from "@/components/ui/modal";
import { OtpInput } from "@/components/ui/otp-input";

type SettingsManagerProps = {
  userName: string;
  userEmail: string;
};

export function SettingsManager({ userName, userEmail }: SettingsManagerProps) {
  const router = useRouter();
  const [isPending] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [otpModal, setOtpModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  const [profileForm, setProfileForm] = useState({ name: userName });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });

  // Función envoltorio para disparar la verificación antes de ejecutar la acción
  const requestVerification = async (action: () => Promise<void>) => {
    setMessage(null);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, action: 'send' }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message ?? "Error al enviar el código de verificación");
      }
      setPendingAction(() => action);
      setOtpModal(true);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : "Error al enviar el código de verificación",
      });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, action: 'verify', token: otp }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok && pendingAction) {
      setOtpModal(false);
      await pendingAction();
    } else {
      setMessage({ type: 'error', text: data?.message ?? "Código incorrecto" });
    }
  };

  async function onUpdateProfile() {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ name: profileForm.name }),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: "Perfil actualizado con éxito" });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: "Error al actualizar el nombre" });
    }
  }

  async function onUpdatePassword() {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ 
        currentPassword: passwordForm.current, 
        newPassword: passwordForm.new 
      }),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: "Contraseña cambiada con éxito" });
      setPasswordForm({ current: "", new: "", confirm: "" });
    } else {
      const data = await res.json();
      setMessage({ type: 'error', text: data.message ?? "Error al cambiar la contraseña" });
    }
  }

  return (
    <div className="max-w-4xl space-y-10">
      {message && (
        <div className={`p-4 rounded-2xl font-bold text-sm animate-in fade-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Perfil */}
      <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 sm:p-10 space-y-8 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl">
            <SettingsIcon className="h-7 w-7 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">Información Personal</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">Gestiona tu identidad</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); requestVerification(onUpdateProfile); }} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nombre Completo</Label>
              <Input 
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl px-6 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Correo Electrónico</Label>
              <Input 
                value={userEmail}
                disabled
                className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 font-bold text-slate-500 cursor-not-allowed opacity-60"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
          >
            {isPending ? "Procesando..." : "Guardar Cambios"}
          </button>
        </form>
      </section>

      {/* Seguridad */}
      <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 sm:p-10 space-y-8 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl">
            <PowerIcon className="h-7 w-7 text-rose-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">Seguridad</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">Actualiza tus credenciales</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); requestVerification(onUpdatePassword); }} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Contraseña Actual</Label>
            <Input 
              type="password"
              placeholder="••••••••"
              value={passwordForm.current}
              onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
              className="h-14 bg-slate-950/60 border-white/5 rounded-2xl px-6 font-bold"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nueva Contraseña</Label>
              <Input 
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={passwordForm.new}
                onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl px-6 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Confirmar Nueva Contraseña</Label>
              <Input 
                type="password"
                placeholder="Repite la contraseña"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl px-6 font-bold"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="px-10 py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]"
          >
            {isPending ? "Procesando..." : "Cambiar Contraseña"}
          </button>
        </form>
      </section>

      {/* Modal de Verificación */}
      <Modal isOpen={otpModal} onClose={() => setOtpModal(false)} title="Verificación de Seguridad">
        <div className="text-center space-y-6">
          <p className="text-slate-400 text-sm">Hemos enviado un código de 6 dígitos a tu correo registrado.</p>
          <OtpInput onComplete={handleVerifyOtp} />
        </div>
      </Modal>
    </div>
  );
}

