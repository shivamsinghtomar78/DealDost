import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/common/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DealDost - Daily Deals, Food Spots & Local Discovery",
  description:
    "Discover community-curated deals, food spots, and neighbourhood updates in one place.",
  keywords: [
    "deals", "food spots", "local discovery", "India", "Amazon deals",
    "Flipkart deals", "Zepto deals", "best momos", "chole bhature delhi",
    "neighbourhood events", "community deals",
  ],
  openGraph: {
    title: "DealDost - Your Daily Deals & Local Discovery App",
    description: "Daily deals, food spots, and neighbourhood updates",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-bg-main antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
