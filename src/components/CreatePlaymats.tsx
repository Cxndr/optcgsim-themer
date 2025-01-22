"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayPlaymat from "./SelectOverlayPlaymat";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";
import SelectImage from "./SelectImage";

import { LeaderColor, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useState } from "react";
import { Jimp, JimpInstance } from "jimp";
import { processSinglePlaymat } from "@/utils/jimpManips";

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

  const [selectedLeaderColor, setSelectedLeaderColor] = useState("Black" as LeaderColor);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.playmats.images[selectedLeaderColor]);

  artImages.push(emptyImage);

  async function updatePlaymatPreview() {
    try {
      if (imageSet.playmats.images[selectedLeaderColor].src === "" || imageSet.playmats.images[selectedLeaderColor].src === null) {
        setPreviewImage("");
        return;
      }
      let image = await Jimp.read(imageSet.playmats.images[selectedLeaderColor].src);
      image = await processSinglePlaymat(image, imageSet.playmats);
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
    imageSet.playmats.images[selectedLeaderColor].src = newSrc;
    console.log(imageSet);
    updatePlaymatPreview();
  }

  function handleSetLeaderColor(value: string) {
    const leaderColor = value.replaceAll(" ", "") as LeaderColor;
    setSelectedLeaderColor(leaderColor);
    updatePlaymatPreview();
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="flex gap-4 justify-center border-b-2 border-slate-50 border-opacity-50 pb-4">
        <SelectOverlayPlaymat settings={imageSet.playmats} updatePreview={updatePlaymatPreview}/>
        <SelectEdgeStyle settings={imageSet} settingType="playmats" updatePreview={updatePlaymatPreview}/>
        <SelectShadowStyle settings={imageSet} settingType="playmats" updatePreview={updatePlaymatPreview}/>
      </div>

      <div className="flex justify-between items-center">
        <SelectLeaderColor setLeaderColor={handleSetLeaderColor}/>
        <SearchBar />
      </div>

      <SelectImage artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage}/>
      
    </div>
  )

}