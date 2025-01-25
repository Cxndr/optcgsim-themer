"use client"

import SelectMenuType from "./SelectMenuType";
import SearchBar from "./SearchBar";
import {Jimp, JimpInstance} from "jimp";
import SelectImage from "./SelectImage";

import { MenuType, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useRef, useState } from "react";
type createMenusProps = {
  artImages: ThemeImage[],
  imageSet: ImageSet,
  setPreviewImage: (image: string) => void,
  setPreviewLoading: (loading: boolean) => void
}

const emptyImage: ThemeImage = { 
  src: "", 
  name: null, 
};

export default function CreateMenus({artImages, imageSet, setPreviewImage, setPreviewLoading} : createMenusProps) {

  const [selectedMenuType, setSelectedMenuType] = useState("Home" as MenuType);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.menus.bgImages[selectedMenuType]);
  const [searchTerm, setSearchTerm] = useState("");
  const workerRef = useRef<Worker | null>(null);

  artImages.push(emptyImage);

  async function updateMenuPreview() {
    if (!workerRef.current) return;
    if (imageSet.menus.bgImages[selectedMenuType].src === "" || imageSet.menus.bgImages[selectedMenuType].src === null) {
      setPreviewImage("");
      return;
    }
    setPreviewLoading(true);
    try {
      const image = await Jimp.read(imageSet.menus.bgImages[selectedMenuType].src) as JimpInstance;
      const buffer = await image.getBuffer("image/png");
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      workerRef.current.postMessage({ image: arrayBuffer, manip: "processMenuOverlay", type:selectedMenuType, imageSet });
    }
    catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    updateMenuPreview();
  }, [selectedMenuType, selectedImage, imageSet.menus]);

  useEffect(() => {
    setSelectedImage(imageSet.menus.bgImages[selectedMenuType]);
  }, [selectedMenuType, imageSet.menus.bgImages])

  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/worker.js", import.meta.url), { type: "module" });
    workerRef.current.onmessage = (e) => {
      setPreviewImage(e.data.base64);
      setPreviewLoading(false);
    }
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

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

      <div className="w-full flex flex-col 2xl:flex-row flex-wrap justify-center 2xl:justify-between items-center gap-4 mb-6">  
        <SelectMenuType setMenuType={handleSetMenuType}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="1920 / 1080" gridCols={3} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>
      
    </div>
  )

}