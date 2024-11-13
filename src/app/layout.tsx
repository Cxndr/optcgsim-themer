import type { Metadata } from "next";
import {Roboto, Inter} from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
// import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "OPTCG Sim Themer",
  description: "Generate custom themes for OPTCG Sim.",
};

export const inter = Inter({
  subsets: ["latin"],
})
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ['100', '300', '400', '500', '700', '900',]
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mytheme">
      <body className={`${inter.className} bg-sea-main bg-cover h-svh flex flex-col`}>
        
        <Header />
        
        <main className="h-full">{children}</main>
        
        {/* <Footer /> */}

      </body>
    </html>
  );
}
