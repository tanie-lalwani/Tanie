import { useEffect } from "react";

export default function ExternalRedirect({ to, label }: { to: string; label?: string }) {
  useEffect(() => {
    // Use replace to avoid keeping redirect route in history
    window.location.replace(to);
  }, [to]);

  return (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <p className="mb-4">Redirecting to {label ?? to}…</p>
      <a href={to} className="underline text-sky-700">Continue to {label ?? to}</a>
    </div>
  );
}
