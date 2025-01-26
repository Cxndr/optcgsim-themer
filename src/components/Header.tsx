"use client"

import Image from "next/image";
import opLogo from "/public/img/logo-op.webp";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavMenu from "./NavMenu";

export default function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }



  return (

    <header className="bg-zinc-200 bg-opacity-70 text-2xl shadow-md shadow-black">

      <div className="flex flex-row justify-between items-center lg:min-h-24 lg:py-3 lg:px-2">

        <Image
          src={opLogo}
          alt="Logo - One Piece Trading Card Game"
          height={144}
          width={560}
          className="h-8 lg:h-12 2xl:h-16 w-auto px-3"
        />
        
        <div className="flex flex-col justify-center">
          <h1 className="text-[1.3rem] lg:text-[1.8rem] 2xl:text-[2.5rem] text-center lg:leading-[3rem]"><Link href="/" className="hover:text-primary">Sim Themer</Link></h1>
        </div>
        
        <nav className="hidden lg:block justify-self-end mt-4 mb-1">
          <ul className="menu menu-horizontal flex flex-row items-center gap-x-4 2xl:gap-x-8 gap-y-2 mr-8 lg:text-xl 2xl:text-2xl font-medium  justify-end">
            <NavMenu/>
          </ul>
        </nav>

        <button onClick={toggleMenu} className="lg:hidden p-2 mx-2">
          {isMenuOpen ? <X size={32}/> : <Menu size={32}/>}
        </button>

      </div>

      {isMenuOpen && (
        <nav className="lg:hidden">
          <ul className="menu menu-vertical text-xl items-center gap-4 my-2">
            <NavMenu/>
          </ul>
        </nav>
      )}


    </header>
  )
}