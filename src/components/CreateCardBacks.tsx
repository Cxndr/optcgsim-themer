"use client"


import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";
import SelectOverlayCards from "./SelectOverlayCards";
import SelectCardBackType from "./SelectCardBackType";
import { CardBackType, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useRef, useState } from "react";
import { Jimp, JimpInstance } from "jimp";


type createPlaymatsProps = {
  artImages: ThemeImage[],
  imageSet: ImageSet,
  setPreviewImage: (image: string) => void,
  setPreviewLoading: (loading: boolean) => void
}

const emptyImage: ThemeImage = { 
  src: "",
  name: null, 
};

export default function CreatePlaymats({artImages, imageSet, setPreviewImage, setPreviewLoading} : createPlaymatsProps) {

  const [selectedCardBackType, setSelectedCardBackType] = useState("DeckCards" as CardBackType);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.cardBacks.images[selectedCardBackType]);
  const [searchTerm, setSearchTerm] = useState("");
  const workerRef = useRef<Worker | null>(null);

  artImages.push(emptyImage);

  async function updateCardBackPreview() {
    if (!workerRef.current) return;
    if (imageSet.cardBacks.images[selectedCardBackType].src === "" || imageSet.cardBacks.images[selectedCardBackType].src === null) {
      setPreviewImage("");
      return;
    }
    setPreviewLoading(true);
    try {
      const image = await Jimp.read(imageSet.cardBacks.images[selectedCardBackType].src) as JimpInstance;
      const buffer = await image.getBuffer("image/png");
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      workerRef.current.postMessage({ image: arrayBuffer, manip: "processCardBack", type: selectedCardBackType, imageSet });
    }
    catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    updateCardBackPreview();
  }, [selectedCardBackType, selectedImage, imageSet.cardBacks]);

  useEffect(() => {
    setSelectedImage(imageSet.cardBacks.images[selectedCardBackType]);
  }, [selectedCardBackType, imageSet.cardBacks.images])

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
    imageSet.cardBacks.images[selectedCardBackType].src = newSrc;
  }

  function handleSetCardBackType(value: string) {
    const cardBackType = value.replaceAll(" ", "") as CardBackType;
    setSelectedCardBackType(cardBackType);
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
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="869 / 1214" gridCols={4} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>
      
    </div>
  )

}