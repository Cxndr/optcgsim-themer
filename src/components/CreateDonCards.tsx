"use client"

import SelectOverlayDon from "./SelectOverlayDon";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";
import { ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useRef, useState } from "react";
import { Jimp, JimpInstance } from "jimp";


type createDonCardsProps = {
  artImages: ThemeImage[],
  imageSet: ImageSet,
  setPreviewImage: (image: string) => void,
  setPreviewLoading: (loading: boolean) => void
}

export default function CreateDonCards({artImages, imageSet, setPreviewImage, setPreviewLoading} : createDonCardsProps) {

  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.donCards.images.DonCard);
  const [searchTerm, setSearchTerm] = useState("");
  const workerRef = useRef<Worker | null>(null);

  async function updateDonCardPreview() {
    if (!workerRef.current) return;
    if (imageSet.donCards.images.DonCard.src === "" || imageSet.donCards.images.DonCard.src === null) {
      setPreviewImage("");
      return;
    }
    setPreviewLoading(true)
    try {
      const image = await Jimp.read(imageSet.donCards.images.DonCard.src) as JimpInstance;
      const buffer = await image.getBuffer("image/png");
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      workerRef.current.postMessage({ image: arrayBuffer, manip: "processDonCard", imageSet });
    }
    catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    updateDonCardPreview();
  }, [selectedImage, imageSet.donCards]);

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
    imageSet.donCards.images.DonCard.src = newSrc;

  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-x-2 lg:gap-4 justify-center border-b-2 border-slate-50 border-opacity-50 pb-1 lg:pb-4">
        <SelectOverlayDon settings={imageSet.donCards} updatePreview={updateDonCardPreview}/>
        <SelectEdgeStyle settings={imageSet} settingType="cardBacks" updatePreview={updateDonCardPreview}/>
        <SelectShadowStyle settings={imageSet} settingType="cardBacks" updatePreview={updateDonCardPreview}/>
      </div>

      <div className="w-full flex flex-row lg:flex-wrap justify-center 2xl:justify-between items-center my-3 lg:my-6 gap-3 lg:gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="869 / 1214" gridCols={4} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>
      
    </div>
  )

}