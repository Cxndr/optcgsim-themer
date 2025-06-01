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
import { useState, useEffect, useRef, useCallback } from "react";
import { Jimp } from "jimp";
import { getJimpCompatibleUrl, isGoogleDriveUrl } from "@/utils/imageHelpers";

export default function CreateTheme() {
  const [artImages, setArtImages] = useState<ThemeImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const currentStepRef = useRef(currentStep);
  const processingRef = useRef<boolean>(false);

  // Fetch images on component mount
  useEffect(() => {
    async function fetchImages() {
      try {
        setImagesLoading(true);
        
        // Try to fetch from the fast manifest endpoint first
        let response = await fetch('/api/images/manifest');
        
        // If manifest doesn't exist, fall back to the slower Google Drive API
        if (!response.ok && response.status === 404) {
          console.log('Static manifest not found, falling back to Google Drive API...');
          response = await fetch('/api/images');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }
        
        const images = await response.json();
        
        // Check if this is an error response
        if (images.error) {
          throw new Error(images.error);
        }
        
        setArtImages(images);
        
      } catch (error) {
        console.error("Error fetching images:", error);
        setImagesError(error instanceof Error ? error.message : "Failed to load images");
      } finally {
        setImagesLoading(false);
      }
    }

    fetchImages();
  }, []);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/worker.js", import.meta.url), { type: "module" });
    
    workerRef.current.onmessage = (e) => {
      if (e.data.step === currentStepRef.current && processingRef.current) {
        setPreviewImage(e.data.base64);
        setPreviewLoading(false);
        processingRef.current = false;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    setPreviewImage("");
    setPreviewLoading(false);
    processingRef.current = false;
  }, [currentStep]);

  const processImage = useCallback(async (image: string | null, manip: string, settings: ImageSet, type?: string) => {
    if (!workerRef.current) {
      setPreviewImage("");
      setPreviewLoading(false);
      return;
    }

    if (!image) {
      setPreviewImage("");
      setPreviewLoading(false);
      processingRef.current = false;
      return;
    }

    setPreviewLoading(true);
    processingRef.current = true;

    try {
      // Convert Google Drive URLs to Jimp-compatible format if needed
      let imageUrl = image;
      if (isGoogleDriveUrl(image)) {
        imageUrl = await getJimpCompatibleUrl(image);
      }

      const jimpImage = await Jimp.read(imageUrl);
      const buffer = await jimpImage.getBuffer("image/png");
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      
      if (processingRef.current) {
        workerRef.current.postMessage({ 
          image: arrayBuffer, 
          manip, 
          imageSet: settings,
          type,
          step: currentStepRef.current
        });
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setPreviewLoading(false);
      processingRef.current = false;
    }
  }, []); // Empty dependency array since the function doesn't depend on any state

  // Show loading state while fetching images
  if (imagesLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg text-zinc-100">Loading images...</p>
        <p className="text-sm text-zinc-400">This may take a moment</p>
      </div>
    );
  }

  // Show error state if image loading failed
  if (imagesError) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center">
        <div className="text-red-400 mb-4">
          <p className="text-lg">Error loading images</p>
          <p className="text-sm">{imagesError}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

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
