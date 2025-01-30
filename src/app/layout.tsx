import type { Metadata } from "next";
import {Inter} from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Head from "next/head";
// import Footer from "@/components/Footer";


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
        
        <Header />
        
        <main className="flex-grow overflow-hidden">{children}</main>
        
        {/* <Footer /> */}

      </body>
    </html>
  );
}
