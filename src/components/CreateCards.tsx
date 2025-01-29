"use client"

import SelectEdgeStyle from "./SelectEdgeStyle";
import SelectShadowStyle from "./SelectShadowStyle";
import { ImageSet} from "@/utils/imageSet";
import { useEffect, useState } from "react";


type CreateCardsProps = {
  imageSet: ImageSet;
  processImage: (image: string, manip: string, settings: ImageSet, type?: string) => void;
};

export default function CreateCards({
  imageSet,
  processImage
}: CreateCardsProps) {

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  async function updateCardPreview() {
    if (selectedFiles && selectedFiles[0]) {
      try {
        const arrayBuffer = await selectedFiles[0].arrayBuffer();
        processImage(URL.createObjectURL(new Blob([arrayBuffer])), "processCard", imageSet);
      } catch(err) {
        console.error(err);
      }
    } else {
      processImage("", "processCard", imageSet);
    }
  }

  useEffect(() => {
    updateCardPreview();
  }, [imageSet.cards, selectedFiles]);

  function clearCardImages() {
    setSelectedFiles(null);
    imageSet.cards.images = {};
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) { 
      clearCardImages();
      setSelectedFiles(files);
      for (const file of Array.from(files)) {
        if (file.name.includes("Don")) continue; // Don cards are handled seperately
        const newSrc = URL.createObjectURL(file);
        const fileName = file.name.split(/\.(png|jpg|jpeg)$/i)[0];
        imageSet.cards.images[fileName] = { src: newSrc, name: fileName};
      }
    }
  }
  

  return (
    <div className="h-full flex flex-col text-xl text-zinc-50">

      <div className="w-full flex flex-row flex-wrap gap-x-2 lg:gap-4 justify-evenly lg:border-b-2 border-slate-50 border-opacity-50 pb-0 lg:pb-4">
        <SelectEdgeStyle 
          settings={imageSet} 
          settingType="cards" 
          updatePreview={() => processImage("", "processCard", imageSet)}
        />
        <SelectShadowStyle settings={imageSet} settingType="cards" updatePreview={() => processImage("", "processCard", imageSet)} />
      </div>

      <div className="flex justify-center items-center w-full h-full">

        <label className="form-control max-w-full h-full flex flex-col justify-evenly gap-2 lg:gap-8 items-center mt-0 lg:mt-12">

          <div className="label flex flex-col gap-1 lg:gap-4 w-full px-0 lg:px-2">
            <h4 className="label-text text-2xl font-bold text-zinc-100 text-center w-full leading-6 lg:leading-none">Upload Card Images</h4>
            <p className="label-text text-lg text-zinc-200 text-center w-full leading-6 lg:leading-none">We cannot host One Piece card images, please upload your own to customize.</p>
            <p className="label-text text-lg text-zinc-200 text-center w-full">These can usually be found in: </p>
            <p className="text-center text-sm text-zinc-700 bg-zinc-200 bg-opacity-70 rounded-2xl py-2 px-4 shadow-sm shadow-black w-full font-bold leading-5 lg:leading-none ">
              <span className="text-error">[YOUR OPTCGSIM INSTALL]</span> / Builds<span className="text-error">[OS]</span> / OPTCGSim_Data / StreamingAssets / Cards
            </p>
            <p className="label-text text-lg text-zinc-200 text-center w-full leading-6 lg:leading-none"><b>Choose Files</b> below, navigate to this folder, and then click Upload.</p>
          </div>

          <input 
            type="file" 
            /* @ts-expect-error - workaround for webkitdirectory support bug in react */
            webkitdirectory="" 
            mozdirectory=""
            directory=""
            multiple 
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-secondary w-full max-w-xs text-zinc-400 shadow-sm shadow-zinc-900"
          />

        </label>
      </div>
      
    </div>
  )

}