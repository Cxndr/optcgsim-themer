"use client";

import { useEffect, useState } from "react";
import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayPlaymat from "./SelectOverlayPlaymat";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";
import { LeaderColor, ImageSet, ThemeImage } from "@/utils/imageSet";

type CreatePlaymatsProps = {
  artImages: ThemeImage[];
  imageSet: ImageSet;
  processImage: (image: string, manip: string, settings: ImageSet, type?: string) => void;
};

export default function CreatePlaymats({
  artImages,
  imageSet,
  processImage
}: CreatePlaymatsProps) {
  const [selectedLeaderColor, setSelectedLeaderColor] = useState("Black" as LeaderColor);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.playmats.images[selectedLeaderColor]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedImage(imageSet.playmats.images[selectedLeaderColor]);
  }, [selectedLeaderColor, imageSet.playmats.images]);

  useEffect(() => {
    const image = imageSet.playmats.images[selectedLeaderColor].src;
    if (image) {
      processImage(image, "processPlaymat", imageSet);
    } else {
      processImage("", "processPlaymat", imageSet);
    }
  }, [selectedLeaderColor, selectedImage, imageSet.playmats]);

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.playmats.images[selectedLeaderColor].src = newSrc;
  }

  function handleSetLeaderColor(value: string) {
    const leaderColor = value.replaceAll(" ", "") as LeaderColor;
    setSelectedLeaderColor(leaderColor);
  }

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-x-2 lg:gap-4 justify-evenly lg:border-b-2 border-slate-50 border-opacity-50 pb-1 lg:pb-6">
        <SelectOverlayPlaymat 
          settings={imageSet.playmats} 
          updatePreview={() => {
            const src = imageSet.playmats.images[selectedLeaderColor].src;
            if (src) {
              processImage(src, "processPlaymat", imageSet);
            }
          }}
        />
        <SelectEdgeStyle 
          settings={imageSet} 
          settingType="playmats"
          updatePreview={() => {
            const src = imageSet.playmats.images[selectedLeaderColor].src;
            if (src) {
              processImage(src, "processPlaymat", imageSet);
            }
          }}
        />
        <SelectShadowStyle 
          settings={imageSet} 
          settingType="playmats" 
          updatePreview={() => {
            const src = imageSet.playmats.images[selectedLeaderColor].src;
            if (src) {
              processImage(src, "processPlaymat", imageSet);
            }
          }}
        />
      </div>

      <div className="w-full flex flex-row lg:flex-wrap justify-center 2xl:justify-between items-center my-3 mt-0 lg:my-6 gap-3 lg:gap-4">
        <SelectLeaderColor setLeaderColor={handleSetLeaderColor}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="1414 / 1000" gridCols={3} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>

    </div>
  );
}
