import { KioskApp } from "@/components/kiosk/kiosk-app";
import { I18nProvider } from "@/lib/i18n/context";
import { useEffect } from "react";

export default function KioskPage({ params }: { params: { token: string } }) {
  const { token } = params;
  useEffect(() => {
    const start = "/kiosk/" + token;
    const manifest = { id: start, name: "POTKO", short_name: "POTKO", start_url: start, scope: start, display: "fullscreen", orientation: "landscape", background_color: "#F5F7F8", theme_color: "#F47D45", lang: "es", icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }] };
    const url = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" }));
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!link) { link = document.createElement("link"); link.rel = "manifest"; document.head.append(link); }
    link.href = url;
    return () => URL.revokeObjectURL(url);
  }, [token]);
  return <I18nProvider fixedLocale="es"><KioskApp token={token} /></I18nProvider>;
}
