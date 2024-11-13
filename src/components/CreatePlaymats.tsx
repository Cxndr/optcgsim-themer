"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlay from "./SelectOverlay";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";

import type { ImageOptions } from "@/app/create/page";
import { LeaderColor, ImageSet } from "@/types/imageSet";
import { useState } from "react";

type createPlaymatsProps = {
  artImages: ImageOptions
  imageSet: ImageSet
}

export default function CreatePlaymats({artImages, imageSet} : createPlaymatsProps) {

  const [selectedLeaderColor, setSelectedLeaderColor] = useState(null as LeaderColor);


  function handleImageClick(event: React.MouseEvent<HTMLAnchorElement>){
    console.log("BEFORE IMAGESET: ", imageSet);
    const image = event.target as HTMLImageElement;
    if (selectedLeaderColor) {
      if (!imageSet.playmats.images[selectedLeaderColor]) {
        imageSet.playmats.images[selectedLeaderColor] = { selection: "", image: null };
      }
      imageSet.playmats.images[selectedLeaderColor].selection = image.src;
    }
    console.log("image src: ", image.src)
    console.log(imageSet);
  }

  function handleSetLeaderColor(value: LeaderColor) {
    setSelectedLeaderColor(value);
  }

  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="flex gap-4 justify-center">
        <SelectOverlay />
        <SelectEdgeStyle />
        <SelectShadowStyle />
      </div>

      <div className="mt-4 flex justify-between items-center border-t-2 border-slate-50 border-opacity-50">
        <SelectLeaderColor setLeaderColor={handleSetLeaderColor}/>
        <SearchBar />
      </div>

      <div className="flex-grow grid grid-cols-4 gap-4 overflow-y-scroll">
        {
          artImages.map((image, index) => (
            <a 
              onClick={(event) => handleImageClick(event)}
              key={index}
            >
              
              <Image 
              src={image.url}
              alt={image.name} // todo: DO BETTER!
              className="h-30 aspect-video object-cover rounded-xl shadow-sm shadow-black"
              width={200} height={200}
              />
            </a>

          ))
        }
      </div>

    </div>
  )

}