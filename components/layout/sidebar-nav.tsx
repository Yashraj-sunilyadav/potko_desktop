"use client";

import Link from "@/components/router-link";
import { usePathname } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { NAV_ITEMS } from "./nav-items";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useI18n();
  return <nav aria-label="Admin navigation" className="flex flex-col gap-1 px-3">
    {NAV_ITEMS.map((item) => {
      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
      const Icon = item.icon;
      return <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground")}>
        <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />{t(item.labelKey)}
      </Link>;
    })}
  </nav>;
}
