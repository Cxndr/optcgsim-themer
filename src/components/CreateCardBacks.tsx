"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayPlaymat from "./SelectOverlayPlaymat";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";
import SelectImage from "./SelectImage";
import SelectOverlayCards from "./SelectOverlayCards";
import SelectCardBackType from "./SelectCardBackType";
import { CardBackType, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useState } from "react";
import { Jimp, JimpInstance } from "jimp";
import { processCardBack } from "@/utils/jimpManips";


type createPlaymatsProps = {
  artImages: ThemeImage[],
  imageSet: ImageSet,
  setPreviewImage: (image: string) => void,
}

const emptyImage: ThemeImage = { 
  src: "",
  name: null, 
  image: null 
};

export default function CreatePlaymats({artImages, imageSet, setPreviewImage} : createPlaymatsProps) {

  const [selectedCardBackType, setSelectedCardBackType] = useState("DeckCards" as CardBackType);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.cardBacks.images[selectedCardBackType]);

  artImages.push(emptyImage);

  async function updateCardBackPreview() {
    try {
      if (imageSet.cardBacks.images[selectedCardBackType].src === "" || imageSet.cardBacks.images[selectedCardBackType].src === null) {
        setPreviewImage("");
        return;
      }
      let image = await Jimp.read(imageSet.cardBacks.images[selectedCardBackType].src);
      image = await processCardBack(selectedCardBackType, image, imageSet.cardBacks);
      const base64 = await image.getBase64("image/png");
      setPreviewImage(base64);
    }
    catch(err) {
      console.error(err);
    }
  }

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.cardBacks.images[selectedCardBackType].src = newSrc;
    updateCardBackPreview();
  }

  function handleSetCardBackType(value: string) {
    const cardBackType = value.replaceAll(" ", "") as CardBackType;
    setSelectedCardBackType(cardBackType);
    updateCardBackPreview();
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-4 justify-center border-b-2 border-slate-50 border-opacity-50 pb-4">
        <SelectOverlayCards settings={imageSet.cardBacks} updatePreview={updateCardBackPreview}/>
        <SelectEdgeStyle settings={imageSet} settingType="cardBacks" updatePreview={updateCardBackPreview}/>
        <SelectShadowStyle settings={imageSet} settingType="cardBacks" updatePreview={updateCardBackPreview}/>
      </div>

      <div className="w-full flex flex-col 2xl:flex-row flex-wrap justify-center 2xl:justify-between items-center my-6 gap-4">
        <SelectCardBackType setCardBackType={handleSetCardBackType}/>
        <SearchBar />
      </div>

      <SelectImage aspectRatio="869 / 1214" artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage}/>
      
    </div>
  )

}