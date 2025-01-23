"use client"

import Image from "next/image";
import opLogo from "/public/img/logo-op.webp";
import Link from "next/link";

export default function Header() {

  const downloadDefault = ()  => {
    // const zipFile = "/files/DefaultTheme.zip";
    const link = document.createElement("a");
    link.href = "https://utfs.io/f/tE0Y6OM99lGIqN3NOdv7U9jGWgMKR0upPJL8TYQS4CAemchi";
    link.download = "OPTCGSimThemer-DefaultTheme.zip"; // specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (

    <header className="flex flex-row justify-between items-center min-h-24 py-4 px-2 bg-zinc-200 bg-opacity-70 text-2xl shadow-md shadow-black">
      
        <Image
          src={opLogo}
          alt="Logo - One Piece Trading Card Game"
          height={144}
          width={560}
          className="h-16 w-auto px-3"
        />
      
      <div className="flex flex-col justify-center w-xl">
        <h1><Link href="/" className="hover:text-primary">Sim Themer</Link></h1>
      </div>
      
      <div className="self-end">
        <ul className="menu menu-horizontal flex items-center gap-8 mr-8 text-2xl font-medium">

          <li>
            <button 
              className="btn btn-success text-success-content text-2xl font-medium shadow-sm shadow-black"
              onClick={downloadDefault}
            >
              Download Defaults
            </button>
          </li>
          
          <li>
            <Link href="/create">Create Your Own</Link>
          </li>
          
          <li>
            <Link href="/guide">Install Guide</Link>
          </li>

          <li>
            <Link href="/faq">FAQ</Link>
          </li>

        </ul>
      </div>

    </header>
  )
}