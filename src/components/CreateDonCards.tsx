"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayDon from "./SelectOverlayDon";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";
import SelectImage from "./SelectImage";
import { ImageSet, ThemeImage} from "@/utils/imageSet";
import { useState } from "react";
import { Jimp, JimpInstance } from "jimp";
import { processDonCard } from "@/utils/jimpManips";


type createDonCardsProps = {
  artImages: ThemeImage[],
  imageSet: ImageSet,
  setPreviewImage: (image: string) => void,
}

const emptyImage: ThemeImage = { 
  src: "",
  name: null, 
  image: null 
};

export default function CreateDonCards({artImages, imageSet, setPreviewImage} : createDonCardsProps) {

  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.donCards.images.DonCard);

  artImages.push(emptyImage);

  async function updateCardBackPreview() {
    try {
      if (imageSet.donCards.images.DonCard.src === "" || imageSet.donCards.images.DonCard.src === null) {
        setPreviewImage("");
        return;
      }
      let image = await Jimp.read(imageSet.donCards.images.DonCard.src);
      image = await processDonCard(image, imageSet.donCards);
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
    imageSet.donCards.images.DonCard.src = newSrc;
    updateCardBackPreview();
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="flex gap-4 justify-center border-b-2 border-slate-50 border-opacity-50 pb-4">
        <SelectOverlayDon settings={imageSet.donCards} updatePreview={updateCardBackPreview}/>
        <SelectEdgeStyle settings={imageSet} settingType="cardBacks" updatePreview={updateCardBackPreview}/>
        <SelectShadowStyle settings={imageSet} settingType="cardBacks" updatePreview={updateCardBackPreview}/>
      </div>

      <div className="flex justify-between items-center">
        <SearchBar />
      </div>

      <SelectImage artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage}/>
      
    </div>
  )

}