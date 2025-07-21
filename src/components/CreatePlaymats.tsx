"use client";

import { useEffect, useState } from "react";
import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayPlaymat from "./SelectOverlayPlaymat";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import SelectImage from "./SelectImage";
import { LeaderColor, LeaderColorValues, ImageSet, ThemeImage } from "@/utils/imageSet";

type CreatePlaymatsProps = {
  artImages: ThemeImage[];
  imageSet: ImageSet;
  processImage: (image: string, manip: string, settings: ImageSet, type?: string) => void;
  onImageUpload?: (newImage: ThemeImage) => void;
};

export default function CreatePlaymats({
  artImages,
  imageSet,
  processImage,
  onImageUpload
}: CreatePlaymatsProps) {
  const [selectedLeaderColor, setSelectedLeaderColor] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<ThemeImage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const getDisplayImage = () => {
      if (selectedLeaderColor === "All") {
        const firstColorWithImage = LeaderColorValues.find(color => 
          imageSet.playmats.images[color].src !== ""
        );
        return firstColorWithImage ? imageSet.playmats.images[firstColorWithImage] : null;
      } else {
        return imageSet.playmats.images[selectedLeaderColor as LeaderColor];
      }
    };
    
    setSelectedImage(getDisplayImage());
  }, [selectedLeaderColor, imageSet.playmats.images]);

  useEffect(() => {
    let imageToProcess = "";
    
    if (selectedLeaderColor === "All") {
  
      const firstColorWithImage = LeaderColorValues.find(color => 
        imageSet.playmats.images[color].src !== ""
      );
      if (firstColorWithImage) {
        imageToProcess = imageSet.playmats.images[firstColorWithImage].src || "";
      }
    } else {
      imageToProcess = imageSet.playmats.images[selectedLeaderColor as LeaderColor].src || "";
    }
    
    if (imageToProcess) {
      processImage(imageToProcess, "processPlaymat", imageSet);
    } else {
      processImage("", "processPlaymat", imageSet);
    }
  }, [selectedLeaderColor, selectedImage, imageSet.playmats, imageSet, processImage]);

  function handleImageClick(image: ThemeImage | null) {
    const newSrc = image ? image.src : "";
    setSelectedImage(image);
    
    if (selectedLeaderColor === "All") {
      LeaderColorValues.forEach(color => {
        imageSet.playmats.images[color].src = newSrc;
      });
    } else {
      imageSet.playmats.images[selectedLeaderColor as LeaderColor].src = newSrc;
    }
  }

  function handleSetLeaderColor(value: string) {
    if (value === "All") {
      setSelectedLeaderColor("All");
    } else {
      const leaderColor = value.replaceAll(" ", "") as LeaderColor;
      setSelectedLeaderColor(leaderColor);
    }
  }


  const getPreviewImageSrc = () => {
    if (selectedLeaderColor === "All") {
      const firstColorWithImage = LeaderColorValues.find(color => 
        imageSet.playmats.images[color].src !== ""
      );
      return firstColorWithImage ? imageSet.playmats.images[firstColorWithImage].src || "" : "";
    } else {
      return imageSet.playmats.images[selectedLeaderColor as LeaderColor].src || "";
    }
  };

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-x-2 lg:gap-4 justify-evenly lg:border-b-2 border-slate-50 border-opacity-50 pb-1 lg:pb-6">
        <SelectOverlayPlaymat 
          settings={imageSet.playmats} 
          updatePreview={() => {
            const src = getPreviewImageSrc();
            if (src) {
              processImage(src, "processPlaymat", imageSet);
            }
          }}
        />
        <SelectEdgeStyle 
          settings={imageSet} 
          settingType="playmats"
          updatePreview={() => {
            const src = getPreviewImageSrc();
            if (src) {
              processImage(src, "processPlaymat", imageSet);
            }
          }}
        />
        <SelectShadowStyle 
          settings={imageSet} 
          settingType="playmats" 
          updatePreview={() => {
            const src = getPreviewImageSrc();
            if (src) {
              processImage(src, "processPlaymat", imageSet);
            }
          }}
        />
      </div>

      <div className="w-full flex flex-row lg:flex-wrap justify-center 2xl:justify-between items-center my-3 mt-0 lg:my-6 gap-3 lg:gap-4">
        <SelectLeaderColor setLeaderColor={handleSetLeaderColor} value={selectedLeaderColor}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <SelectImage aspectRatio="1414 / 1000" gridCols={3} artImages={artImages} handleImageClick={handleImageClick} selectedImage={selectedImage} searchTerm={searchTerm} onImageUpload={onImageUpload}/>

    </div>
  );
}
