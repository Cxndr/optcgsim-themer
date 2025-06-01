"use client"

import SelectMenuType from "./SelectMenuType";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";

import { MenuType, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useState } from "react";

type CreateMenusProps = {
  artImages: ThemeImage[];
  imageSet: ImageSet;
  processImage: (image: string, manip: string, settings: ImageSet, type?: string) => void;
  onImageUpload?: (newImage: ThemeImage) => void;
};

export default function CreateMenus({
  artImages,
  imageSet,
  processImage,
  onImageUpload
}: CreateMenusProps) {

  const [selectedMenuType, setSelectedMenuType] = useState("Home" as MenuType);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.menus.bgImages[selectedMenuType]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const src = selectedImage?.src || "";
    if (src) {
      processImage(src, "processMenu", imageSet, selectedMenuType);
    } else {
      processImage("", "processMenu", imageSet, selectedMenuType);
    }
  }, [selectedImage, selectedMenuType, imageSet, processImage]);

  useEffect(() => {
    setSelectedImage(imageSet.menus.bgImages[selectedMenuType]);
  }, [selectedMenuType, imageSet.menus.bgImages]);

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.menus.bgImages[selectedMenuType].src = newSrc;
  }

  function handleSetMenuType(value: string) {
    const menuType = value.replaceAll(" ", "") as MenuType;
    setSelectedMenuType(menuType);
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row lg:flex-wrap justify-center 2xl:justify-between items-center my-3 mt-1 lg:my-6 gap-3 lg:gap-4">  
        <SelectMenuType setMenuType={handleSetMenuType}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="1920 / 1080" gridCols={3} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm} onImageUpload={onImageUpload}/>

    </div>
  )

}