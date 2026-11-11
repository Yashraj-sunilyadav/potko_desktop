import { FlaskConical } from "lucide-react";
export default function PayReturnPage() {
  return <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
    <FlaskConical className="h-12 w-12 text-primary" aria-hidden />
    <h1 className="text-2xl font-semibold">POTKO preview mode</h1>
    <p className="text-muted-foreground">Payment status is not connected in this front-end prototype.</p>
  </main>;
}
