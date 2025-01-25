"use client";

import { useEffect, useRef, useState } from "react";
import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayPlaymat from "./SelectOverlayPlaymat";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";
import { LeaderColor, ImageSet, ThemeImage } from "@/utils/imageSet";
import { Jimp, JimpInstance } from "jimp";

type CreatePlaymatsProps = {
  artImages: ThemeImage[];
  imageSet: ImageSet;
  setPreviewImage: (image: string) => void;
  setPreviewLoading: (loading: boolean) => void;
};

const emptyImage: ThemeImage = { 
  src: "",
  name: null, 
};

export default function CreatePlaymats({
  artImages,
  imageSet,
  setPreviewImage,
  setPreviewLoading
}: CreatePlaymatsProps) {

  const [selectedLeaderColor, setSelectedLeaderColor] = useState("Black" as LeaderColor);
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(imageSet.playmats.images[selectedLeaderColor]);
  const [searchTerm, setSearchTerm] = useState("");
  const workerRef = useRef<Worker | null>(null);

  artImages.push(emptyImage);

  async function updatePlaymatPreview() {
    if (!workerRef.current) return;
    if (imageSet.playmats.images[selectedLeaderColor].src === "" || imageSet.playmats.images[selectedLeaderColor].src === null) {
      setPreviewImage("");
      return;
    }
    setPreviewLoading(true);
    try {
      const image = await Jimp.read(imageSet.playmats.images[selectedLeaderColor].src) as JimpInstance;
      const buffer = await image.getBuffer("image/png");
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      workerRef.current.postMessage({ image: arrayBuffer, manip: "processPlaymat", imageSet });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    updatePlaymatPreview();
  }, [selectedLeaderColor, selectedImage, imageSet.playmats]);

  useEffect(() => {
    setSelectedImage(imageSet.playmats.images[selectedLeaderColor]);
  }, [selectedLeaderColor, imageSet.playmats.images]);

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
    imageSet.playmats.images[selectedLeaderColor].src = newSrc;
  }

  function handleSetLeaderColor(value: string) {
    const leaderColor = value.replaceAll(" ", "") as LeaderColor;
    setSelectedLeaderColor(leaderColor);
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
  );
}
