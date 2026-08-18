import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Tanie Lalwani",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#04111b] px-6 text-center text-sky-100">
      <h1 className="mb-4 text-7xl font-bold tracking-tight text-white sm:text-9xl">404</h1>
      <h2 className="mb-4 text-2xl font-medium sm:text-3xl">Page Not Found</h2>
      <p className="mb-8 max-w-md text-sky-200/70">
        The page you are looking for might have been moved, deleted, or never existed.
      </p>
      <Link
        href="/"
        className="rounded-full border border-sky-400/30 bg-sky-500/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-500/20 hover:border-sky-400/50"
      >
        Return to Home
      </Link>
    </div>
  );
}
