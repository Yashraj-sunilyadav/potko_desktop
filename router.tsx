import { Component, lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AppProviders } from "@/components/providers/app-providers";
import DashboardGroupLayout from "@/app/(dashboard)/layout";
import "@/app/globals.css";
const pageLoaders = import.meta.glob("./app/**/page.tsx") as Record<string, () => Promise<{ default: ComponentType<any> }>>;
const routeRows = Object.entries(pageLoaders).map(([file, loader]) => {
  let route = file.slice("./app/".length, -"/page.tsx".length);
  route = route.replace(/\([^/]+\)\//g, "").replace(/^\([^/]+\)$/, "");
  route = route.replace(/\[\.\.\.([^\]]+)\]/g, "*").replace(/\[([^\]]+)\]/g, ":$1");
  return { route, Page: lazy(loader), dashboard: file.startsWith("./app/(dashboard)/") };
});
function LoadingPage() { return <div className="min-h-screen animate-pulse bg-background" aria-label="Loading page" />; }
class PageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-start justify-center gap-3 p-8 text-foreground">
      <h1 className="text-2xl font-semibold">This preview page hit an error</h1>
      <p className="text-sm text-muted-foreground">The rest of POTKO is still available. Reload this page or choose another section from the navigation.</p>
      <button type="button" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground" onClick={() => window.location.reload()}>Reload page</button>
    </main>;
  }
}
function RoutePage({ Page }: { Page: ComponentType<any> }) {
  const params = useParams();
  return <PageErrorBoundary><Suspense fallback={<LoadingPage />}><Page params={params} /></Suspense></PageErrorBoundary>;
}
function DashboardPage({ Page }: { Page: ComponentType<any> }) {
  const params = useParams();
  const loc = useLocation();
  return <DashboardGroupLayout key={loc.pathname}><PageErrorBoundary><Suspense fallback={<LoadingPage />}><Page params={params} /></Suspense></PageErrorBoundary></DashboardGroupLayout>;
}
function NotFound() { return <main className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-bold">Page not found</h1><a href="/" className="text-primary underline">Return to POTKO POS</a></main>; }
export default function App() {
  return <AppProviders><div className="min-h-full flex-1"><Routes>
    {routeRows.map(({route, Page, dashboard}) => route === "" || route === "login" || route === "signup" ? <Route key={route || "/"} path={route || "/"} element={<Navigate to="/dashboard" replace />} /> : <Route key={route} path={route} element={dashboard ? <DashboardPage Page={Page}/> : <RoutePage Page={Page}/>} />)}
    <Route path="*" element={<NotFound/>}/>
  </Routes></div></AppProviders>;
}
