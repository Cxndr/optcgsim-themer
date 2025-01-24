"use client"

import SelectMenuType from "./SelectMenuType";
import SearchBar from "./SearchBar";
import Image from "next/image";
import {Jimp} from "jimp";
import SelectImage from "./SelectImage";

import { MenuType, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useState } from "react";
import { processMenuOverlay } from "@/utils/jimpManips";
type createMenusProps = {
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

export default function CreateMenus({artImages, imageSet, setPreviewImage, setPreviewLoading} : createMenusProps) {

  const [selectedMenuType, setSelectedMenuType] = useState("Home" as MenuType);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.menus.bgImages[selectedMenuType]);
  const [searchTerm, setSearchTerm] = useState("");

  artImages.push(emptyImage);

  async function updateMenuPreview() {
    if (imageSet.menus.bgImages[selectedMenuType].src === "" || imageSet.menus.bgImages[selectedMenuType].src === null) {
      setPreviewImage("");
      return;
    }
    setPreviewLoading(true);
    try {
      let image = await Jimp.read(imageSet.menus.bgImages[selectedMenuType].src);
      image = await processMenuOverlay(selectedMenuType, image, imageSet.menus);
      const base64 = await image.getBase64("image/png");
      setPreviewImage(base64);
    }
    catch(err) {
      console.error(err);
    }
    setPreviewLoading(false);
  }

  useEffect(() => {
    updateMenuPreview();
  }, [selectedMenuType]);

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.menus.bgImages[selectedMenuType].src = newSrc;
    updateMenuPreview();
  }

  function handleSetMenuType(value: string) {
    const menuType = value.replaceAll(" ", "") as MenuType;
    setSelectedMenuType(menuType);
    updateMenuPreview();
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-col 2xl:flex-row flex-wrap justify-center 2xl:justify-between items-center gap-4 mb-6">  
        <SelectMenuType setMenuType={handleSetMenuType}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="1920 / 1080" gridCols={3} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>
      
    </div>
  )

}