import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { api } from "@/lib/api";

const SITE_URL = process.env.SITE_URL ?? "https://your-site.netlify.app";

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
    <html lang="en">
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
