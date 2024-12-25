"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlay from "./SelectOverlayPlaymat";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";

import { LeaderColor, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useState } from "react";

type createPlaymatsProps = {
  artImages: ThemeImage[],
  imageSet: ImageSet,
  updatePreview: (leaderColor: LeaderColor) => void,
}

export default function CreatePlaymats({artImages, imageSet, updatePreview} : createPlaymatsProps) {

  const [selectedLeaderColor, setSelectedLeaderColor] = useState("Black" as LeaderColor);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.playmats.images[selectedLeaderColor]);

  function updatePlaymatPreview() {
    updatePreview(selectedLeaderColor);
  }


  function handleImageClick(image:ThemeImage){
    const newSrc = image.src;
    setSelectedImage(image);
    imageSet.playmats.images[selectedLeaderColor].src = newSrc;
    console.log(imageSet);
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
        <SelectOverlay settings={imageSet.playmats} updatePreview={updatePlaymatPreview}/>
        <SelectEdgeStyle settings={imageSet} settingType="playmats" updatePreview={updatePlaymatPreview}/>
        <SelectShadowStyle settings={imageSet} settingType="playmats" updatePreview={updatePlaymatPreview}/>
      </div>

      <div className="mt-4 flex justify-between items-center border-t-2 border-slate-50 border-opacity-50">
        <SelectLeaderColor setLeaderColor={handleSetLeaderColor}/>
        <SearchBar />
      </div>

      <div className="flex-grow overflow-auto">
        <div className="grid grid-cols-3 gap-4">
          {
            artImages.map((image, index) => (
              <a 
                onClick={() => handleImageClick(image)}
                key={index}
                className="relative w-full overflow-hidden rounded-xl shadow-sm shadow-black"
                style={{ aspectRatio: '1414 / 1000' }}
              >
                <Image 
                  src={image.src} 
                  alt={image.name ? image.name : "no image set"} // todo: DO BETTER!
                  className="w-full h-full object-cover hover:scale-110 transform transition-transform ease-in-out duration-700"
                  width={200} height={200}
                />
                {
                  selectedImage &&
                  image.src === selectedImage.src && <div className="absolute top-0 left-0 w-full h-full bg-zinc-300 bg-opacity-10 border-accent border-4 rounded-xl"></div>
                }
            </a>

            ))
          }
        </div>
      </div>
      

    </div>
  )

}