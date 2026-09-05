import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { api } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await api.getSiteSettings().catch(() => ({ settings: null }));
  return {
    title: {
      default: settings?.siteTitle ?? "A. OluOgidan & co",
      template: `%s | ${settings?.siteTitle ?? "A. OluOgidan & co"}`,
    },
    description: settings?.siteDescription ?? undefined,
    verification: settings?.googleVerification
      ? { google: settings.googleVerification }
      : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
