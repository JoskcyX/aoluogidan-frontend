import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { api } from "@/lib/api";

// Self-hosted via Next.js at build time (no runtime request to Google's CDN).
// This is what actually guarantees Poppins renders everywhere, including
// in-app browsers (TikTok, Instagram, etc.) that block third-party font
// requests and silently fall back to the device's system font instead.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = process.env.SITE_URL ?? "https://aoluogidan.com";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await api.getSiteSettings().catch(() => ({ settings: null }));
  const siteName = settings?.siteTitle ?? "A. OluOgidan & co";
  const description = settings?.siteDescription ?? undefined;
  const ogImage = settings?.defaultSeoImageUrl ?? settings?.logoUrl ?? undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    verification: settings?.googleVerification
      ? { google: settings.googleVerification }
      : undefined,
    icons: settings?.logoUrl ? { icon: settings.logoUrl, shortcut: settings.logoUrl, apple: settings.logoUrl } : undefined,
    // Site-wide social preview defaults. Individual pages (blog posts, team
    // profiles, practice areas) override `openGraph.images`/`title` in their
    // own generateMetadata, so this only shows up where a page doesn't.
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description,
      url: SITE_URL,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await api.getSiteSettings().catch(() => ({ settings: null }));
  const gaId = settings?.googleAnalyticsId;

  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
