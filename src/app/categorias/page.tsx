import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CategoryManager } from "@/components/category-manager";
import { SignOutButton } from "@/components/sign-out-button";
import { MobileNav } from "@/components/mobile-nav";
import {
  CategoryWalletIcon,
  DashboardIcon,
  ReportsIcon,
  SettingsIcon,
} from "@/components/ui/pretty-icons";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const navigationItems = [
  { label: "Dashboard", icon: "dashboard", href: "/", active: false },
  {
    label: "Categorías",
    icon: "categories",
    href: "/categorias",
    active: true,
  },
  { label: "Ajustes", icon: "settings", href: "/ajustes", active: false },
  {
    label: "Reportar bugs",
    icon: "reports",
    href: "https://github.com/sergiostebanpgx/financehub/issues/new",
    active: false,
    external: true,
  },
];

export default async function CategoriasPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [categories, user] = await Promise.all([
    prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);

  const userName = user?.name ?? "Usuario";
  const userInitial = userName.trim()[0]?.toUpperCase() ?? "U";

  return (
    <main className="dashboard-shell h-dvh bg-slate-950 text-slate-50 overflow-hidden flex flex-col lg:flex-row">
      {/* Desktop Sidebar - Fixed Left */}
      <aside className="hidden lg:flex flex-col w-75 h-full shrink-0 border-r border-white/5 p-8 bg-slate-950">
        <div className="flex items-center gap-3 px-2 mb-12">
          <span className="text-xl font-bold tracking-tight text-white">
            Finance<span className="text-cyan-400">Hub</span>
          </span>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon =
              item.icon === "dashboard"
                ? DashboardIcon
                : item.icon === "categories"
                  ? CategoryWalletIcon
                  : item.icon === "reports"
                    ? ReportsIcon
                    : SettingsIcon;
            return (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer noopener" : undefined}
                aria-label={
                  item.external
                    ? `${item.label} (abre en una nueva pestaña)`
                    : item.label
                }
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                  item.active
                    ? "bg-white/10 text-cyan-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${item.active ? "text-cyan-400" : "group-hover:text-cyan-400 transition-colors"}`}
                />
                <span className="font-semibold">{item.label}</span>
                {item.active && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="h-11 w-11 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-slate-900 border-2 border-white/10">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate text-white">
                {userName}
              </p>
              <p className="text-xs text-slate-500 truncate font-medium">
                Premium Account
              </p>
            </div>
          </div>
          <SignOutButton className="w-full justify-start px-4 py-3.5 rounded-2xl hover:bg-rose-500/10 hover:text-rose-400 transition-colors group text-sm font-bold" />
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
        <div className="mx-auto w-full max-w-300 px-4 py-6 sm:px-8 lg:px-10 space-y-10">
          <MobileNav items={navigationItems} userInitial={userInitial} />

          <section className="animate-slide-up">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Gestión de{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
                Categorías
              </span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Personaliza cómo clasificas tus movimientos financieros.
            </p>
          </section>

          <div className="animate-slide-up delay-100 pb-10">
            <CategoryManager initialCategories={categories} />
          </div>
        </div>
      </div>
    </main>
  );
}
