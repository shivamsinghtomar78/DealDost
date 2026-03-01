import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { BottomNav } from "@/components/common/BottomNav";

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
  title: "DealDost — Daily Deals, Food Spots & Local Discovery",
  description:
    "Apne sheher ki best deals, khana aur events — sab ek jagah. Discover community-curated deals from Amazon, Flipkart, Zepto & more, find the best local food spots, and stay connected with your neighbourhood.",
  keywords: [
    "deals", "food spots", "local discovery", "India", "Amazon deals",
    "Flipkart deals", "Zepto deals", "best momos", "chole bhature delhi",
    "neighbourhood events", "community deals",
  ],
  openGraph: {
    title: "DealDost — Your Daily Deals & Local Discovery App",
    description: "Apne sheher ki best deals, khana aur events — sab ek jagah",
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
        <Navbar />
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-1 ml-0 lg:ml-64 min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
