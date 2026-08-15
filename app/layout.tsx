import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AssistantWidget } from "@/components/assistant-widget";
import { CommandPalette } from "@/components/command-palette";
import { Providers } from "@/app/providers";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import { BootIntro } from "@/components/boot-intro";
import { ConsoleGreeting } from "@/components/console-greeting";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = "Ankit Negi - Full-Stack Developer & AI Engineer";
const description =
  "Full-stack developer and AI engineer building multi-agent systems, RAG pipelines, and production-grade web applications.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Ankit Negi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0e11",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ankit Negi",
  url: SITE_URL,
  jobTitle: "Full-Stack Developer & AI Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Indian Institute of Information Technology, (IIIT), Chennai",
  },
  knowsAbout: [
    "Full-Stack Development",
    "React",
    "Next.js",
    "Python",
    "LangGraph",
    "Multi-Agent Systems",
    "RAG",
  ],
  sameAs: [
    "https://github.com/ankitnegi-dev",
    "https://linkedin.com/in/ankit-negi-2aa98232a",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text-primary)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <BootIntro />
          <Nav />
          {children}
          <Footer />
          <AssistantWidget />
          <CommandPalette />
          <ConsoleGreeting />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}