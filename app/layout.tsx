import type { Metadata, Viewport } from "next";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PortraitGuard from "@/components/PortraitGuard";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enchanted Tools",
  description: "Explorez l'espace Enchanted Tools",
  icons: {
    icon: "/enchanted_tools.svg",
    shortcut: "/enchanted_tools.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Enchanted Tools",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1B35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="text-white" style={{ backgroundColor: '#0D1B35' }}>
        <ServiceWorkerRegistration />
        <PortraitGuard />
        {children}
      </body>
    </html>
  );
}
