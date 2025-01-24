"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayDon from "./SelectOverlayDon";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";
import SelectImage from "./SelectImage";
import { ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useState } from "react";
import { Jimp, JimpInstance } from "jimp";
import { processDonCard } from "@/utils/jimpManips";


type createDonCardsProps = {
  artImages: ThemeImage[],
  imageSet: ImageSet,
  setPreviewImage: (image: string) => void,
  setPreviewLoading: (loading: boolean) => void
}

const emptyImage: ThemeImage = { 
  src: "",
  name: null, 
  image: null 
};

export default function CreateDonCards({artImages, imageSet, setPreviewImage, setPreviewLoading} : createDonCardsProps) {

  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.donCards.images.DonCard);
  const [searchTerm, setSearchTerm] = useState("");

  artImages.push(emptyImage);

  async function updateDonCardPreview() {
    if (imageSet.donCards.images.DonCard.src === "" || imageSet.donCards.images.DonCard.src === null) {
      setPreviewImage("");
      return;
    }
    setPreviewLoading(true)
    try {
      let image = await Jimp.read(imageSet.donCards.images.DonCard.src);
      image = await processDonCard(image, imageSet.donCards);
      const base64 = await image.getBase64("image/png");
      setPreviewImage(base64);
    }
    catch(err) {
      console.error(err);
    }
    setPreviewLoading(false);
  }

  useEffect(() => {
    updateDonCardPreview();
  }, []);

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.donCards.images.DonCard.src = newSrc;
    updateDonCardPreview();
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-4 justify-center border-b-2 border-slate-50 border-opacity-50 pb-4">
        <SelectOverlayDon settings={imageSet.donCards} updatePreview={updateDonCardPreview}/>
        <SelectEdgeStyle settings={imageSet} settingType="cardBacks" updatePreview={updateDonCardPreview}/>
        <SelectShadowStyle settings={imageSet} settingType="cardBacks" updatePreview={updateDonCardPreview}/>
      </div>

      <div className="w-full flex flex-col 2xl:flex-row flex-wrap justify-center 2xl:justify-end items-center my-6 gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="869 / 1214" gridCols={4} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>
      
    </div>
  )

}