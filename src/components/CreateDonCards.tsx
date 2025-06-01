"use client"

import SelectOverlayDon from "./SelectOverlayDon";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";
import { ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useState } from "react";


type CreateDonCardsProps = {
  artImages: ThemeImage[];
  imageSet: ImageSet;
  processImage: (image: string, manip: string, settings: ImageSet, type?: string) => void;
};

export default function CreateDonCards({
  artImages,
  imageSet,
  processImage
}: CreateDonCardsProps) {

  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.donCards.images.DonCard);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const src = selectedImage?.src || "";
    if (src) {
      processImage(src, "processDonCard", imageSet);
    } else {
      processImage("", "processDonCard", imageSet);
    }
  }, [selectedImage, imageSet, processImage]);

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.donCards.images.DonCard.src = newSrc;
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-x-2 lg:gap-4 justify-evenly lg:border-b-2 border-slate-50 border-opacity-50 pb-1 lg:pb-4">
        <SelectOverlayDon 
          settings={imageSet.donCards} 
          updatePreview={() => processImage(selectedImage?.src || "", "processDonCard", imageSet)}
        />
        <SelectEdgeStyle 
          settings={imageSet} 
          settingType="donCards" 
          updatePreview={() => processImage(selectedImage?.src || "", "processDonCard", imageSet)}
        />
        <SelectShadowStyle 
          settings={imageSet} 
          settingType="donCards" 
          updatePreview={() => processImage(selectedImage?.src || "", "processDonCard", imageSet)}
        />
      </div>

      <div className="w-full flex flex-row lg:flex-wrap justify-center 2xl:justify-between items-center my-3 mt-0 lg:my-6 gap-3 lg:gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="869 / 1214" gridCols={4} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>
      
    </div>
  )

}