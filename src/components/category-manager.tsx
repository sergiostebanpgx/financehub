"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { TrashIcon, EditIcon } from "@/components/ui/pretty-icons";
import { getCategoryIcon } from "@/lib/category-icons";
import { Modal } from "@/components/ui/modal";
import type { Category } from "@/types/finance";

type CategoryManagerProps = {
  initialCategories: Category[];
};

const AVAILABLE_ICONS = [
  "wallet", "utensils", "bus", "house", "film", "shopping", "income",
];

const PRESET_COLORS = [
  "#22d3ee", "#fb7185", "#818cf8", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#60a5fa",
];

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [formModal, setFormModal] = useState<boolean>(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    color: PRESET_COLORS[0],
    icon: AVAILABLE_ICONS[0],
  });

  function resetForm() {
    setForm({ name: "", color: PRESET_COLORS[0], icon: AVAILABLE_ICONS[0] });
    setEditingId(null);
    setError(null);
    setFormModal(false);
  }

  function handleEdit(category: Category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      color: category.color,
      icon: category.icon ?? AVAILABLE_ICONS[0],
    });
    setFormModal(true);
  }

  async function confirmDelete() {
    if (!deleteModalId) return;
    startTransition(async () => {
      try {
        const response = await fetch(`/api/categories/${deleteModalId}`, { method: "DELETE" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Error al eliminar.");
        setDeleteModalId(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al eliminar.");
      }
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
        const method = editingId ? "PATCH" : "POST";
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message ?? "Error al guardar.");
        }
        resetForm();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar.");
      }
    });
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <button 
          onClick={() => { resetForm(); setFormModal(true); }}
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Categoría
        </button>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initialCategories.map((category) => {
          const Icon = getCategoryIcon(category.icon);
          return (
            <div
              key={category.id}
              className="group bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between gap-4 hover:bg-white/[0.08] transition-all backdrop-blur-sm"
            >
              <div className="flex items-center gap-5">
                <div
                  className="h-14 w-14 flex items-center justify-center rounded-2xl border transition-transform group-hover:scale-110 shadow-lg"
                  style={{
                    backgroundColor: `${category.color}15`,
                    borderColor: `${category.color}40`,
                    color: category.color,
                  }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-100">{category.name}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-cyan-400 transition-all"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteModalId(category.id)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-rose-400 transition-all"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Modal de Formulario */}
      <Modal 
        isOpen={formModal} 
        onClose={resetForm} 
        title={editingId ? "Editar Categoría" : "Crear Categoría"}
      >
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nombre de categoría</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-base focus:outline-none focus:border-cyan-400/50 transition-all placeholder:text-slate-700"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Suscripciones, Viajes..."
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Icono representativo</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map((iconName) => {
                const Icon = getCategoryIcon(iconName);
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setForm({ ...form, icon: iconName })}
                    className={`h-12 w-12 flex items-center justify-center rounded-xl border transition-all ${
                      form.icon === iconName
                        ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                        : "border-white/5 bg-white/5 text-slate-500 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Color de marca</label>
            <div className="flex flex-wrap gap-4">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`h-10 w-10 rounded-full border-4 transition-transform ${
                    form.color === color ? "border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-rose-400 text-xs bg-rose-400/10 p-4 rounded-xl">{error}</p>}

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={resetForm}
              className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-500/20"
              disabled={isPending}
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Eliminación */}
      <Modal 
        isOpen={!!deleteModalId} 
        onClose={() => setDeleteModalId(null)} 
        title="Eliminar Categoría"
      >
        <div className="space-y-6">
          <p className="text-slate-400 leading-relaxed">
            ¿Confirmas la eliminación de esta categoría? Solo se podrá completar si no tiene movimientos financieros asociados.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setDeleteModalId(null)}
              className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={confirmDelete}
              className="flex-1 px-6 py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-2xl font-bold transition-all"
              disabled={isPending}
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
