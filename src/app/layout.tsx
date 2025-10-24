import type { Metadata } from "next";
import {Inter} from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react"
import { QueryProvider } from "@/components/QueryProvider";
import { ServiceWorkerProvider } from "@/components/ServiceWorkerProvider";
import { SpeedInsights } from '@vercel/speed-insights/next';


export const metadata: Metadata = {
  title: "OPTCG Sim Themer",
  description: "Generate custom themes for OPTCG Sim.",
};

const inter = Inter({
  subsets: ["latin"],
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mytheme" className="bg-sea-main bg-cover bg-[top_right_-9.5rem] lg:bg-top">
      <Head>
        <meta name="apple-mobile-web-app-title" content="OPTCG Sim Themer" />
      </Head>
      <body className={`${inter.className} bg-transparent h-svh flex flex-col`}>
        <QueryProvider>
          <ServiceWorkerProvider>
            <Header />
            
            <main className="flex-grow overflow-hidden">{children}</main>
            
            <Analytics />
            <SpeedInsights />
          </ServiceWorkerProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
