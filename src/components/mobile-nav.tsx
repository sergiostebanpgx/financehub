"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardIcon, CategoryWalletIcon, SettingsIcon } from "@/components/ui/pretty-icons";
import { SignOutButton } from "@/components/sign-out-button";

type NavItem = {
  label: string;
  icon: string; // Cambiado a string
  href: string;
  active: boolean;
};

type MobileNavProps = {
  items: NavItem[];
  userInitial: string;
};

export function MobileNav({ items, userInitial }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Mapeo dinámico de iconos
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dashboard": return DashboardIcon;
      case "categories": return CategoryWalletIcon;
      case "settings": return SettingsIcon;
      default: return SettingsIcon;
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="flex items-center justify-between lg:hidden mb-6">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">FinanceHub</span>
        </div>
        
        <div className="w-10 h-10 flex items-center justify-center">
           <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-white/10 text-white">
            {userInitial}
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-slate-900 border-r border-white/5 p-6 transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-white">FinanceHub</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white" aria-label="Cerrar menú">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <Link
                key={`mobile-drawer-${item.label}`}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-white/5"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-white/5">
          <SignOutButton className="w-full justify-start px-4 py-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-colors" />
        </div>
      </aside>
    </>
  );
}
