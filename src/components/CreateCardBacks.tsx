"use client"

import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";
import SelectOverlayCards from "./SelectOverlayCards";
import SelectCardBackType from "./SelectCardBackType";
import { CardBackType, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useState } from "react";

type CreateCardBacksProps = {
  artImages: ThemeImage[];
  imageSet: ImageSet;
  processImage: (image: string, manip: string, settings: ImageSet, type?: string) => void;
};

export default function CreateCardBacks({
  artImages,
  imageSet,
  processImage
}: CreateCardBacksProps) {

  const [selectedCardBackType, setSelectedCardBackType] = useState("DeckCards" as CardBackType);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.cardBacks.images[selectedCardBackType]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const image = selectedImage?.src || "";
    processImage(image, "processCardBack", imageSet, selectedCardBackType);
  }, [selectedImage, selectedCardBackType, imageSet.cardBacks]);

  useEffect(() => {
    setSelectedImage(imageSet.cardBacks.images[selectedCardBackType]);
  }, [selectedCardBackType, imageSet.cardBacks.images])

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.cardBacks.images[selectedCardBackType].src = newSrc;
  }

  function handleSetCardBackType(value: string) {
    const cardBackType = value.replaceAll(" ", "") as CardBackType;
    setSelectedCardBackType(cardBackType);
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-x-2 lg:gap-4 justify-evenly lg:border-b-2 border-slate-50 border-opacity-50 pb-1 lg:pb-4">
        <SelectOverlayCards settings={imageSet.cardBacks} updatePreview={() => processImage(selectedImage?.src || "", "processCardBack", imageSet, selectedCardBackType)} selectedCardBackType={selectedCardBackType}/>
        <SelectEdgeStyle settings={imageSet} settingType="cardBacks" updatePreview={() => processImage(selectedImage?.src || "", "processCardBack", imageSet, selectedCardBackType)}/>
        <SelectShadowStyle settings={imageSet} settingType="cardBacks" updatePreview={() => processImage(selectedImage?.src || "", "processCardBack", imageSet, selectedCardBackType)}/>
      </div>

      <div className="w-full flex flex-row lg:flex-wrap justify-center 2xl:justify-between items-center my-3 mt-0 lg:my-6 gap-3 lg:gap-4">
        <SelectCardBackType setCardBackType={handleSetCardBackType}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="869 / 1214" gridCols={4} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>
      
    </div>
  )

}