import { cn } from "@/lib/utils";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return <img src="/potko-icon.jpeg" alt="POTKO" width={size} height={size} className={cn("shrink-0 rounded-[23%] object-cover", className)} />;
}
