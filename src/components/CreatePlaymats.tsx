"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayPlaymat from "./SelectOverlayPlaymat";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";

import { LeaderColor, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useEffect, useState } from "react";
import { Jimp } from "jimp";
import { processPlaymat } from "@/utils/jimpManips";

type createPlaymatsProps = {
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

export default function CreatePlaymats({artImages, imageSet, setPreviewImage, setPreviewLoading} : createPlaymatsProps) {

  const [selectedLeaderColor, setSelectedLeaderColor] = useState("Black" as LeaderColor);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.playmats.images[selectedLeaderColor]);
  const [searchTerm, setSearchTerm] = useState("");

  artImages.push(emptyImage);

  async function updatePlaymatPreview() {
    if (imageSet.playmats.images[selectedLeaderColor].src === "" || imageSet.playmats.images[selectedLeaderColor].src === null) {
      setPreviewImage("");
      return;
    }
    setPreviewLoading(true);
    try {
      let image = await Jimp.read(imageSet.playmats.images[selectedLeaderColor].src);
      image = await processPlaymat(image, imageSet.playmats);
      const base64 = await image.getBase64("image/png");
      setPreviewImage(base64);
    }
    catch(err) {
      console.error(err);
    }
    setPreviewLoading(false);
  }
  
  useEffect(() => {
    updatePlaymatPreview();
  }, [selectedLeaderColor, updatePlaymatPreview]);

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    imageSet.playmats.images[selectedLeaderColor].src = newSrc;
    updatePlaymatPreview();
  }

  function handleSetLeaderColor(value: string) {
    const leaderColor = value.replaceAll(" ", "") as LeaderColor;
    setSelectedLeaderColor(leaderColor);
    updatePlaymatPreview();
  }

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-4 justify-center border-b-2 border-slate-50 border-opacity-50 pb-4">
        <SelectOverlayPlaymat settings={imageSet.playmats} updatePreview={updatePlaymatPreview}/>
        <SelectEdgeStyle settings={imageSet} settingType="playmats" updatePreview={updatePlaymatPreview}/>
        <SelectShadowStyle settings={imageSet} settingType="playmats" updatePreview={updatePlaymatPreview}/>
      </div>

      <div className="w-full flex flex-col 2xl:flex-row flex-wrap justify-center 2xl:justify-between items-center my-6 gap-4">
        <SelectLeaderColor setLeaderColor={handleSetLeaderColor}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="1414 / 1000" gridCols={3} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm}/>
      
    </div>
  )

}