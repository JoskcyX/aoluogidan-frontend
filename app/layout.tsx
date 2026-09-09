import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { api } from "@/lib/api";

const SITE_URL =
  process.env.SITE_URL ?? "https://aoluogidan.com";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await api
    .getSiteSettings()
    .catch(() => ({ settings: null }));

  const siteName =
    settings?.siteTitle ?? "Aoluogidan & Co.";

  const description =
    settings?.siteDescription ??
    "Aoluogidan & Co. provides legal services and representation in Nigeria.";

  const ogImage =
    settings?.defaultSeoImageUrl ??
    settings?.logoUrl ??
    undefined;

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },

    description,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    verification: settings?.googleVerification
      ? {
        google: settings.googleVerification,
      }
      : undefined,

    icons: settings?.logoUrl
      ? {
        icon: settings.logoUrl,
        shortcut: settings.logoUrl,
        apple: settings.logoUrl,
      }
      : undefined,

    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description,
      locale: "en_NG",
      images: ogImage
        ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: siteName,
          },
        ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await api
    .getSiteSettings()
    .catch(() => ({ settings: null }));

  const gaId = settings?.googleAnalyticsId;

  return (
    <html lang="en-NG">
      <body className="antialiased">
        {children}

        <Toaster
          position="top-right"
          toastOptions={{ duration: 4000 }}
        />

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />

            <Script
              id="ga4-init"
              strategy="afterInteractive"
            >
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