"use client";

import CreateThemeSteps from "./CreateThemeSteps";
import CreatePlaymats from "./CreatePlaymats";
import CreateMenus from "./CreateMenus";
import CreateCardBacks from "./CreateCardBacks";
import CreateDonCards from "./CreateDonCards";
import CreateCards from "./CreateCards";
import PreviewPane from "./PreviewPane";
import { imageSet, makeImageSetZip } from "@/utils/imageSet";

import { ImageOption } from "@/app/create/page";
import { useState } from "react";

type CreateThemeProps = {
  artImages: ImageOption[];
};

export default function CreateTheme({ artImages }: CreateThemeProps) {

  const [currentStep, setCurrentStep] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  async function downloadSet() {
    const zipFile = await makeImageSetZip(imageSet);
    const blob = new Blob([zipFile], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "imageSet.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="w-full py-4 flex justify-around pr-12 items-center rounded-3xl text-zinc-100 bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
        <CreateThemeSteps downloadSet={downloadSet} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
      </div>

      <div className="w-full h-0 flex-grow gap-8 flex justify-center items-center">

        <div className="w-1/2 h-full p-6 flex-col justify-center items-center rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black text-zinc-100 text-3xl">
          <PreviewPane previewImage={previewImage} previewLoading={previewLoading} />
        </div>

        <div className="w-1/2 h-full p-8 flex flex-col rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
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
