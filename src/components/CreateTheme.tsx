"use client";

import CreateThemeSteps from "./CreateThemeSteps";
import CreatePlaymats from "./CreatePlaymats";
import CreateMenus from "./CreateMenus";
import CreateCardBacks from "./CreateCardBacks";
import CreateDonCards from "./CreateDonCards";
import CreateCards from "./CreateCards";
import PreviewPane from "./PreviewPane";
import { imageSet, makeImageSetZip } from "@/utils/imageSet";
import { ThemeImage } from "@/utils/imageSet";
import { useState } from "react";

type CreateThemeProps = {
  artImages: ThemeImage[];
};

export default function CreateTheme({ artImages }: CreateThemeProps) {

  const [currentStep, setCurrentStep] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  return (
    <>
      <div className="w-full py-3 lg:py-4 flex flex-col lg:flex-row gap-3 lg:gap-4 justify-around px-4 lg:pl-0 lg:pr-12 items-center text-sm lg:text-base rounded-3xl text-zinc-100 bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
        <CreateThemeSteps generateTheme={generateTheme} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
      </div>

      <div className="w-full h-0 flex-grow gap-3 2xl:gap-8 flex flex-col lg:flex-row lg:justify-center items-center">

        <div className="w-full lg:w-1/2 h-1/3 lg:h-full p-2 lg:p-6 flex-col justify-center items-center rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black text-zinc-100 text-3xl">
          <PreviewPane previewImage={previewImage} previewLoading={previewLoading} />
        </div>

        <div className="w-full lg:w-1/2 h-2/3 lg:h-full p-2 px-4 lg:p-8 flex flex-col rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
          { currentStep === 5 
            ?
            <CreateCards imageSet={imageSet} setPreviewImage={setPreviewImage} setPreviewLoading={setPreviewLoading}/>
            :
            currentStep === 4
            ?
            <CreateDonCards artImages={artImages} imageSet={imageSet} setPreviewImage={setPreviewImage} setPreviewLoading={setPreviewLoading} />
            :
            currentStep === 3 
            ?
            <CreateCardBacks artImages={artImages} imageSet={imageSet} setPreviewImage={setPreviewImage} setPreviewLoading={setPreviewLoading}/>
            :
            currentStep === 2 
            ?
            <CreateMenus artImages={artImages} imageSet={imageSet} setPreviewImage={setPreviewImage} setPreviewLoading={setPreviewLoading} />
            :
            <CreatePlaymats artImages={artImages} imageSet={imageSet} setPreviewImage={setPreviewImage} setPreviewLoading={setPreviewLoading} />
          }
          
        </div>
      </div>
    </>
  );
}
