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
import { processCardBacks } from "@/utils/jimpManips";


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
      image = await processCardBacks(selectedCardBackType, image, imageSet.cardBacks);
      const base64 = await image.getBase64("image/png");
      setPreviewImage(base64);
    }
    catch(err) {
      console.error(err);
    }
  }

  function handleImageClick(image: ThemeImage | null) {
    console.log(image);
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.cardBacks.images[selectedCardBackType].src = newSrc;
    console.log(imageSet);
    updateCardBackPreview();
  }

  function handleSetCardBackType(value: string) {
    const cardBackType = value.replaceAll(" ", "") as CardBackType;
    setSelectedCardBackType(cardBackType);
    updateCardBackPreview();
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="flex gap-4 justify-center border-b-2 border-slate-50 border-opacity-50 pb-4">
        <SelectOverlayCards settings={imageSet.cardBacks} updatePreview={updateCardBackPreview}/>
        <SelectEdgeStyle settings={imageSet} settingType="cardBacks" updatePreview={updateCardBackPreview}/>
        <SelectShadowStyle settings={imageSet} settingType="cardBacks" updatePreview={updateCardBackPreview}/>
      </div>

      <div className="flex justify-between items-center">
        <SelectCardBackType setCardBackType={handleSetCardBackType}/>
        <SearchBar />
      </div>

      <SelectImage artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage}/>
      
    </div>
  )

}