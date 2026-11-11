"use client";

import Link from "@/components/router-link";
import { usePathname } from "@/lib/router-compat";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

const PRIMARY = ["/dashboard", "/orders", "/tables", "/pos"];
export function MobileBottomNav({ onMore }: { onMore: () => void }) {
  const pathname = usePathname();
  const items = PRIMARY.map((href) => NAV_ITEMS.find((item) => item.href === href)).filter((item) => !!item);
  const itemClass = "relative flex h-16 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium";
  return <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
    {items.map((item) => { const active = pathname === item.href || pathname.startsWith(`${item.href}/`); const Icon = item.icon; return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn(itemClass, active ? "text-primary" : "text-muted-foreground")}><Icon className="h-5 w-5" /><span className="max-w-full truncate px-1">{item.labelKey.split(".").at(-1)}</span></Link>; })}
    <button type="button" onClick={onMore} className={cn(itemClass, "text-muted-foreground")}><MoreHorizontal className="h-5 w-5" /><span>More</span></button>
  </nav>;
}
