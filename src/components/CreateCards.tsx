"use client"

import SelectLeaderColor from "./SelectLeaderColor";
import SelectOverlayPlaymat from "./SelectOverlayPlaymat";
import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import SearchBar from "./SearchBar";
import Image from "next/image";
import SelectImage from "./SelectImage";
import SelectOverlayCards from "./SelectOverlayCards";
import SelectCardBackType from "./SelectCardBackType";
import { CardBackType, ImageSet, ThemeImage} from "@/utils/imageSet";
import { useState } from "react";
import { Jimp, JimpInstance } from "jimp";
import { processCards } from "@/utils/jimpManips";


type createCardsProps = {
  imageSet: ImageSet,
  setPreviewImage: (image: string) => void,
}

const emptyImage: ThemeImage = { 
  src: "", 
  name: null, 
  image: null 
};



export default function CreateCards({imageSet, setPreviewImage} : createCardsProps) {

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  async function updateCardPreview() {
    try {
      if (imageSet.cardBacks.images[selectedCardBackType].src === "" || imageSet.cardBacks.images[selectedCardBackType].src === null) {
        setPreviewImage("");
        return;
      }
      let image = await Jimp.read(imageSet.cards.images[1].src);
      image = await processCards(image, imageSet.cards);
      const base64 = await image.getBase64("image/png");
      setPreviewImage(base64);
    }
    catch(err) {
      console.error(err);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) { 
      setSelectedFiles(files);

      for (const file of Array.from(files)) {
        const newSrc = URL.createObjectURL(file);
        imageSet.cards.images[file.name] = { src: newSrc, name: file.name, image: null };
      }
    }

    updateCardPreview();
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="flex gap-4 justify-center border-b-2 border-slate-50 border-opacity-50 pb-4">
        <SelectEdgeStyle settings={imageSet} settingType="cards" updatePreview={updateCardPreview} />
        <SelectShadowStyle settings={imageSet} settingType="cards" updatePreview={updateCardPreview} />
      </div>

      <div className="flex justify-center items-center w-full h-full">

        <label className="form-control max-w-full h-full flex flex-col gap-8 items-center mt-12">

          <div className="label flex flex-col gap-4 w-full">
            <h4 className="label-text text-2xl font-bold text-zinc-100 text-center w-full">Upload Card Images</h4>
            <p className="label-text text-lg text-zinc-200 text-center w-full">We cannot host One Piece card images, please upload your own to customize.</p>
            <p className="label-text text-lg text-zinc-200 text-center w-full">These can usually be found in: </p>
            <p className="text-center w-auto text-sm text-zinc-700 bg-zinc-200 bg-opacity-70 rounded-2xl py-2 px-4 shadow-sm shadow-black w-full">
              <span className="text-error">[YOUR OPTCGSIM INSTALL]</span>/Builds<span className="text-error">[OS]</span>/OPTCGSim_Data/StreamingAssets/Cards/
            </p>
            <p className="label-text text-lg text-zinc-200 text-center w-full">Choose files below, navigate to this folder, and then click Upload.</p>
          </div>

          <input 
            type="file" 
            /* @ts-expect-error */
            webkitdirectory="" 
            mozdirectory
            directory
            multiple 
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-secondary w-full max-w-xs text-zinc-400"
          />

        </label>
      </div>
      
    </div>
  )

}