"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlay from "./SelectOverlay";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { ImageOptions } from "@/app/create/page";

type createPlaymatsProps = {
  artImages: ImageOptions
}


export default function CreatePlaymats({artImages} : createPlaymatsProps) {

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="flex gap-4 justify-center">
        <SelectOverlay />
        <SelectEdgeStyle />
        <SelectShadowStyle />
      </div>

      <div className="mt-4 flex justify-between items-center border-t-2 border-slate-50 border-opacity-50">
        <SelectLeaderColor />
        <SearchBar />
      </div>

      <div className="flex-grow grid grid-cols-4 gap-4 overflow-y-scroll">
        {
          artImages.map((image, index) => (
            <Image 
              src={image.url}
              key={index}
              alt={image.name} // todo: DO BETTER!
              className="h-30 aspect-video object-cover rounded-xl shadow-sm shadow-black"
              width={200} height={200}
            />
          ))
        }
      </div>

    </div>
  )

}