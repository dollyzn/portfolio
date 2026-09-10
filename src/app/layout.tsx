import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.role}`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Natã Santos",
    "Desenvolvedor Full Stack",
    "React",
    "Node.js",
    "TypeScript",
    "Desenvolvedor Brasília",
    "Portfólio",
  ],
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: `${site.name} - Portfólio`,
    title: `${site.name} - ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f5fb" },
    { media: "(prefers-color-scheme: dark)", color: "#02040A" },
  ],
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: [site.github],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brasília",
    addressRegion: "DF",
    addressCountry: "BR",
  },
  knowsAbout: [
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "REST APIs",
    "SQL",
  ],
};

/** Sem JavaScript não existe intro: libera o conteúdo que o CSS esconde. */
const noScriptCss = `#conteudo,body>header,body>footer,body>nav{opacity:1!important;transform:none!important;filter:none!important;pointer-events:auto!important}body{overflow:visible!important}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-void">
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noScriptCss }} />
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
