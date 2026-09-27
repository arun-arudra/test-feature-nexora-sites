import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import { headers } from "next/headers";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { StickyWhatsApp } from "@/components/layout/StickyWhatsApp";
import { V2Footer } from "@/components/v2/V2Footer";
import { V2Header } from "@/components/v2/V2Header";
import { siteConfig } from "@/config/site";
import { isCmsAdminPath } from "@/lib/cms/admin-path";
import "./globals.css";
import "../styles/theme-v2.css";

const heading = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.brandName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdmin = isCmsAdminPath(pathname);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.brandName,
    description: siteConfig.description,
    url: siteConfig.url,
    areaServed: siteConfig.serviceAreas,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    hasMap: siteConfig.mapsUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
  };

  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${outfit.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <GoogleAnalytics />
        {isAdmin ? (
          children
        ) : (
          <div className="theme-v2 flex min-h-full flex-1 flex-col bg-bg font-sans text-text">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <V2Header />
            <main className="flex-1 overflow-x-clip">{children}</main>
            <V2Footer />
            <StickyWhatsApp />
            <ChatbotWidget />
            <AnalyticsBeacon />
          </div>
        )}
      </body>
    </html>
  );
}
