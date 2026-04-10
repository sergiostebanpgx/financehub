"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/ui/otp-input";
import {
  PowerIcon,
  SettingsIcon,
  TrashIcon,
} from "@/components/ui/pretty-icons";

type SettingsManagerProps = {
  userName: string;
  userEmail: string;
};

export function SettingsManager({ userName, userEmail }: SettingsManagerProps) {
  const router = useRouter();
  const [isPending] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [otpModal, setOtpModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    (() => Promise<void>) | null
  >(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteForm, setDeleteForm] = useState({
    confirmation: "",
    password: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: userName });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const canDeleteAccount =
    deleteForm.confirmation.trim().toUpperCase() === "ELIMINAR" &&
    deleteForm.password.trim().length >= 8;

  // Función envoltorio para disparar la verificación antes de ejecutar la acción
  const requestVerification = async (action: () => Promise<void>) => {
    setMessage(null);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, action: "send" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data?.message ?? "Error al enviar el código de verificación",
        );
      }
      setPendingAction(() => action);
      setOtpModal(true);
    } catch (error) {
      setMessage({
        type: "error",
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
      body: JSON.stringify({ email: userEmail, action: "verify", token: otp }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok && pendingAction) {
      setOtpModal(false);
      await pendingAction();
    } else {
      setMessage({ type: "error", text: data?.message ?? "Código incorrecto" });
    }
  };

  async function onUpdateProfile() {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profileForm.name }),
    });
    if (res.ok) {
      setMessage({ type: "success", text: "Perfil actualizado con éxito" });
      router.refresh();
    } else {
      setMessage({ type: "error", text: "Error al actualizar el nombre" });
    }
  }

  async function onUpdatePassword() {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new,
      }),
    });
    if (res.ok) {
      setMessage({ type: "success", text: "Contraseña cambiada con éxito" });
      setPasswordForm({ current: "", new: "", confirm: "" });
    } else {
      const data = await res.json();
      setMessage({
        type: "error",
        text: data.message ?? "Error al cambiar la contraseña",
      });
    }
  }

  function closeDeleteModal(force = false) {
    if (isDeleting && !force) return;
    setDeleteModal(false);
    setDeleteForm({ confirmation: "", password: "" });
  }

  async function onDeleteAccount() {
    if (!canDeleteAccount) {
      setMessage({
        type: "error",
        text: 'Escribe "ELIMINAR" y tu contraseña actual para continuar.',
      });
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: deleteForm.password,
          confirmationText: deleteForm.confirmation,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message ?? "No fue posible eliminar la cuenta.");
      }

      setMessage({
        type: "success",
        text: "Tu cuenta fue eliminada correctamente. Redirigiendo...",
      });
      closeDeleteModal(true);
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "No fue posible eliminar la cuenta.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-10">
      {message && (
        <div
          className={`p-4 rounded-2xl font-bold text-sm animate-in fade-in slide-in-from-top-4 ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
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
            <h3 className="text-2xl font-black tracking-tight text-white">
              Información Personal
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
              Gestiona tu identidad
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestVerification(onUpdateProfile);
          }}
          className="space-y-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                Nombre Completo
              </Label>
              <Input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl px-6 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                Correo Electrónico
              </Label>
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
            <h3 className="text-2xl font-black tracking-tight text-white">
              Seguridad
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
              Actualiza tus credenciales
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestVerification(onUpdatePassword);
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
              Contraseña Actual
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
              className="h-14 bg-slate-950/60 border-white/5 rounded-2xl px-6 font-bold"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                Nueva Contraseña
              </Label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={passwordForm.new}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new: e.target.value })
                }
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl px-6 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                Confirmar Nueva Contraseña
              </Label>
              <Input
                type="password"
                placeholder="Repite la contraseña"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
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

      {/* Zona de peligro */}
      <section className="bg-slate-900/40 border border-rose-500/15 rounded-[2.5rem] p-8 sm:p-10 space-y-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <TrashIcon className="h-7 w-7 text-rose-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Zona de peligro
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
              Acciones permanentes
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2 max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-300">
                Eliminar cuenta
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Esta acción es irreversible. Se eliminarán tu cuenta,
                categorías, movimientos, metas, deudas y el historial asociado a
                tu perfil.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                setDeleteForm({ confirmation: "", password: "" });
                setDeleteModal(true);
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-rose-400/25 bg-rose-500/10 px-5 py-3 text-sm font-black text-rose-100 transition-all hover:bg-rose-500/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </section>

      {/* Modal de Verificación */}
      <Modal
        isOpen={otpModal}
        onClose={() => setOtpModal(false)}
        title="Verificación de Seguridad"
      >
        <div className="text-center space-y-6">
          <p className="text-slate-400 text-sm">
            Hemos enviado un código de 6 dígitos a tu correo registrado.
          </p>
          <OtpInput onComplete={handleVerifyOtp} />
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal}
        onClose={closeDeleteModal}
        title="Confirmar eliminación de cuenta"
      >
        <div className="space-y-5">
          {message?.type === "error" ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">
              {message.text}
            </div>
          ) : null}

          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-slate-200">
            <p className="font-bold text-rose-300">
              Esta acción no se puede deshacer.
            </p>
            <p className="mt-2 leading-relaxed">
              Se eliminarán definitivamente tu cuenta y todos los datos
              relacionados: perfil, categorías, registros financieros, metas,
              deudas e historial.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
              Escribe ELIMINAR
            </Label>
            <Input
              value={deleteForm.confirmation}
              onChange={(e) =>
                setDeleteForm({ ...deleteForm, confirmation: e.target.value })
              }
              placeholder="ELIMINAR"
              className="h-12 bg-slate-950/60 border-white/5 rounded-2xl px-5 font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
              Confirma tu contraseña actual
            </Label>
            <Input
              type="password"
              value={deleteForm.password}
              onChange={(e) =>
                setDeleteForm({ ...deleteForm, password: e.target.value })
              }
              placeholder="••••••••"
              className="h-12 bg-slate-950/60 border-white/5 rounded-2xl px-5 font-bold"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => closeDeleteModal()}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onDeleteAccount}
              disabled={!canDeleteAccount || isDeleting}
              className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-black text-white transition-all hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar cuenta"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
