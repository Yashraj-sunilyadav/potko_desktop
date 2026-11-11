import { Bell } from "lucide-react";
export function NotificationBell() {
  return <button type="button" aria-label="Notifications are disabled in preview" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground"><Bell className="h-[18px] w-[18px]" /></button>;
}
