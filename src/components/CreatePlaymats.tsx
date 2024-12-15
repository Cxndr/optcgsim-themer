"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlay from "./SelectOverlay";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";

import type { ImageOption } from "@/app/create/page";
import { LeaderColor, ImageSet } from "@/utils/imageSet";
import { useState } from "react";

type createPlaymatsProps = {
  artImages: ImageOption[],
  imageSet: ImageSet,
  updatePreview: (leaderColor: LeaderColor) => void,
}

export default function CreatePlaymats({artImages, imageSet, updatePreview} : createPlaymatsProps) {

  const [selectedLeaderColor, setSelectedLeaderColor] = useState("Black" as LeaderColor);

  function updatePlaymatPreview() {
    updatePreview(selectedLeaderColor);
  }


  function handleImageClick(image:ImageOption){
    const newSrc = image.url;
    imageSet.playmats.images[selectedLeaderColor].src = newSrc;
    updatePreview(selectedLeaderColor);
  }

  function handleSetLeaderColor(value: string) {
    const leaderColor = value.replaceAll(" ", "") as LeaderColor;
    setSelectedLeaderColor(leaderColor);
    updatePreview(leaderColor);
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="flex gap-4 justify-center">
        <SelectOverlay settings={imageSet.playmats} updatePlaymatPreview={updatePlaymatPreview}/>
        <SelectEdgeStyle settings={imageSet.playmats} updatePlaymatPreview={updatePlaymatPreview}/>
        <SelectShadowStyle settings={imageSet.playmats} updatePlaymatPreview={updatePlaymatPreview}/>
      </div>

      <div className="mt-4 flex justify-between items-center border-t-2 border-slate-50 border-opacity-50">
        <SelectLeaderColor setLeaderColor={handleSetLeaderColor}/>
        <SearchBar />
      </div>

      <div className="flex-grow grid grid-cols-4 gap-4 overflow-y-scroll">
        {
          artImages.map((image, index) => (
            <a 
              onClick={() => handleImageClick(image)}
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