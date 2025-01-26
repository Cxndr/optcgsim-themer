import type { Metadata } from "next";
import {Inter} from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
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
    <html lang="en" data-theme="mytheme" className="bg-sea-main bg-cover bg-[top_right_-9.5rem] lg:bg-top" >
      <body className={`${inter.className} bg-transparent h-svh flex flex-col`}>
        
        <Header />
        
        <main className="flex-grow overflow-hidden">{children}</main>
        
        {/* <Footer /> */}

      </body>
    </html>
  );
}
