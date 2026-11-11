"use client";

import type { SessionUser } from "@nodedr-restaurant/types";
import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { BrandFooter } from "./brand-footer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { SidebarNav } from "./sidebar-nav";
import { BranchSwitcher } from "./branch-switcher";
import { Logo } from "./logo";

function RestaurantBrand() {
  return <div className="flex items-center gap-2.5"><Logo size={32} /><span className="text-base font-bold tracking-[0.12em] text-sidebar-foreground">POTKO</span></div>;
}

function DemoProfile({ user }: { user?: SessionUser }) {
  const { theme, setTheme } = useTheme();
  return <div className="flex items-center gap-3">
    <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:inline-flex">LOCAL PREVIEW</span>
    <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary" aria-label="Toggle theme">
      <Sun className="h-[18px] w-[18px] dark:hidden" /><Moon className="hidden h-[18px] w-[18px] dark:block" />
    </button>
    <div className="hidden text-right sm:block"><p className="text-sm font-medium">{user?.name ?? "POTKO Admin"}</p><p className="text-xs text-muted-foreground">Manager preview</p></div>
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">AM</div>
  </div>;
}

export function AppShell({ user, children }: { user?: SessionUser; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  return <div className="flex min-h-screen bg-background">
    {!sidebarHidden && <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center px-5"><RestaurantBrand /></div>
      <div className="px-3 pb-3"><BranchSwitcher /></div>
      <div className="flex-1 overflow-y-auto py-2"><SidebarNav /></div>
      <BrandFooter />
    </aside>}
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 bg-sidebar p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-16 items-center px-5"><RestaurantBrand /></div>
        <div className="px-3 pb-3"><BranchSwitcher /></div>
        <div className="flex-1 overflow-y-auto py-2"><SidebarNav onNavigate={() => setMobileOpen(false)} /></div>
        <BrandFooter />
      </SheetContent>
    </Sheet>
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
          <button type="button" onClick={() => setSidebarHidden((hidden) => !hidden)} className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary lg:flex" aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"} title={sidebarHidden ? "Show sidebar" : "Hide sidebar"}>{sidebarHidden ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}</button>
          <div className="hidden lg:block"><p className="text-xs text-muted-foreground">RESTAURANT OPERATIONS</p><p className="text-sm font-semibold">Admin dashboard</p></div>
        </div>
        <DemoProfile user={user} />
      </header>
      <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8">{children}</main>
    </div>
    <MobileBottomNav onMore={() => setMobileOpen(true)} />
  </div>;
}
