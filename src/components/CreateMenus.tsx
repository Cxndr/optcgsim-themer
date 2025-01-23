"use client"

import SelectMenuType from "./SelectMenuType";
import SearchBar from "./SearchBar";
import Image from "next/image";
import {Jimp} from "jimp";
import SelectImage from "./SelectImage";

import { MenuType, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useState } from "react";
import { processMenuOverlay } from "@/utils/jimpManips";
type createMenusProps = {
  artImages: ThemeImage[],
  imageSet: ImageSet,
  setPreviewImage: (image: string) => void,
}

const emptyImage: ThemeImage = { 
  src: "", 
  name: null, 
  image: null 
};

export default function CreateMenus({artImages, imageSet, setPreviewImage} : createMenusProps) {

  const [selectedMenuType, setSelectedMenuType] = useState("Home" as MenuType);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.menus.bgImages[selectedMenuType]);

  artImages.push(emptyImage);

  async function updateMenuPreview() {
    try {
      if (imageSet.menus.bgImages[selectedMenuType].src === "" || imageSet.menus.bgImages[selectedMenuType].src === null) {
        setPreviewImage("");
        return;
      }
      let image = await Jimp.read(imageSet.menus.bgImages[selectedMenuType].src);
      image = await processMenuOverlay(selectedMenuType, image, imageSet.menus);
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
    imageSet.menus.bgImages[selectedMenuType].src = newSrc;
    console.log(imageSet);
    updateMenuPreview();
  }

  function handleSetMenuType(value: string) {
    const menuType = value.replaceAll(" ", "") as MenuType;
    setSelectedMenuType(menuType);
    updateMenuPreview();
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="flex justify-between items-center">
        <SelectMenuType setMenuType={handleSetMenuType}/>
        <SearchBar />
      </div>

      <SelectImage artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage}/>
      
    </div>
  )

}