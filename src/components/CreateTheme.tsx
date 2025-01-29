"use client";

import CreateThemeSteps from "./CreateThemeSteps";
import CreatePlaymats from "./CreatePlaymats";
import CreateMenus from "./CreateMenus";
import CreateCardBacks from "./CreateCardBacks";
import CreateDonCards from "./CreateDonCards";
import CreateCards from "./CreateCards";
import PreviewPane from "./PreviewPane";
import { ImageSet, imageSet } from "@/utils/imageSet";
import { ThemeImage } from "@/utils/imageSet";
import { useState, useEffect, useRef } from "react";
import { Jimp } from "jimp";

type CreateThemeProps = {
  artImages: ThemeImage[];
};

export default function CreateTheme({ artImages }: CreateThemeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const currentStepRef = useRef(currentStep);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/worker.js", import.meta.url), { type: "module" });
    
    workerRef.current.onmessage = (e) => {
      if (e.data.step === currentStepRef.current) {
        setPreviewImage(e.data.base64);
        setPreviewLoading(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    setPreviewImage("");
    setPreviewLoading(false);
  }, [currentStep]);

  const processImage = async (image: string, manip: string, settings: ImageSet, type?: string) => {
    if (!workerRef.current || !image) {
      setPreviewImage("");
      return;
    }

    setPreviewLoading(true);
    try {
      const jimpImage = await Jimp.read(image);
      const buffer = await jimpImage.getBuffer("image/png");
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      
      workerRef.current.postMessage({ 
        image: arrayBuffer, 
        manip, 
        imageSet: settings,
        type,
        step: currentStepRef.current
      });
    } catch (err) {
      console.error(err);
      setPreviewLoading(false);
    }
  };

  return (
    <>
      <div className="w-full py-3 lg:py-4 flex flex-col lg:flex-row gap-3 lg:gap-4 justify-around px-4 lg:pl-0 lg:pr-12 items-center text-sm lg:text-base rounded-3xl text-zinc-100 bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
        <CreateThemeSteps imageSet={imageSet} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
      </div>

      <div className="w-full h-0 flex-grow gap-3 2xl:gap-8 flex flex-col lg:flex-row lg:justify-center items-center">

        <div className="w-full lg:w-1/2 h-1/3 lg:h-full p-2 lg:p-6 flex-col justify-center items-center rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black text-zinc-100 text-3xl">
          <PreviewPane previewImage={previewImage} previewLoading={previewLoading} />
        </div>

        <div className="w-full lg:w-1/2 h-2/3 lg:h-full p-2 px-4 lg:p-8 flex flex-col rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
          { currentStep === 5 
            ?
            <CreateCards 
              imageSet={imageSet} 
              processImage={processImage}
            />
            :
            currentStep === 4
            ?
            <CreateDonCards 
              artImages={artImages} 
              imageSet={imageSet} 
              processImage={processImage} 
            />
            :
            currentStep === 3 
            ?
            <CreateCardBacks 
              artImages={artImages} 
              imageSet={imageSet} 
              processImage={processImage}
            />
            :
            currentStep === 2 
            ?
            <CreateMenus 
              artImages={artImages} 
              imageSet={imageSet} 
              processImage={processImage} 
            />
            :
            <CreatePlaymats 
              artImages={artImages} 
              imageSet={imageSet} 
              processImage={processImage} 
            />
          }
          
        </div>
      </div>
    </>
  );
}
