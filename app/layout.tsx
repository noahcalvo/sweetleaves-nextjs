import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AgeGate from "./components/AgeGate";
import AlpineIQProvider from "./components/AlpineIQProvider";
import PageViewTracker from "./components/PageViewTracker";
import Nav from "./components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Sweetleaves Cannabis",
    template: "%s | Sweetleaves",
  },
  description:
    "Sweetleaves Cannabis Dispensary in the North Loop of Minneapolis, MN.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sweetleaves Cannabis",
    description:
      "Sweetleaves Cannabis Dispensary in the North Loop of Minneapolis, MN.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AgeGate>
          <div className="min-h-screen flex flex-col dark:bg-emerald-950 bg-white">
            <AlpineIQProvider />
            <PageViewTracker />
            <Nav />

            <main className="flex-1 w-full">
              <div className="mx-auto w-full max-w-3xl px-6 py-8">{children}</div>
            </main>

            <footer className="w-full border-t border-zinc-200 dark:border-zinc-800">
              <div className="mx-auto w-full max-w-3xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
                &copy; {new Date().getFullYear()} SweetLeaves
              </div>
            </footer>
          </div>
        </AgeGate>
      </body>
    </html>
  );
}
