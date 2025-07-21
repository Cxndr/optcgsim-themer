"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ImageSet, defaultImageSet, ThemeImage } from "@/utils/imageSet";
import { isGoogleDriveUrl, getJimpCompatibleUrl } from "@/utils/imageHelpers";

import CreateThemeSteps from "@/components/CreateThemeSteps";
import PreviewPane from "@/components/PreviewPane";
import CreatePlaymats from "@/components/CreatePlaymats";
import CreateMenus from "@/components/CreateMenus";
import CreateCardBacks from "@/components/CreateCardBacks";
import CreateDonCards from "@/components/CreateDonCards";
import CreateCards from "@/components/CreateCards";

export default function CreateTheme() {
  const [artImages, setArtImages] = useState<ThemeImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [imageSet] = useState<ImageSet>(defaultImageSet);
  const workerRef = useRef<Worker | null>(null);
  const currentStepRef = useRef(currentStep);
  const processingRef = useRef<boolean>(false);
  
  const latestRequestRef = useRef<string>('');
  
  const imageCache = useRef<Map<string, ArrayBuffer>>(new Map());
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleImageUpload = useCallback((newImage: ThemeImage) => {
    setArtImages(prevImages => [newImage, ...prevImages]);
  }, []);
  const refreshImages = useCallback(async () => {
    try {
      setImagesLoading(true);
      setImagesError(null);
      
      try {
        const refreshResponse = await fetch('/api/images/manifest', { method: 'POST' });
        if (refreshResponse.ok) {
          console.log('Manifest cache refreshed');
        }
      } catch (error) {
        console.warn('Failed to refresh manifest cache:', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let response = await fetch('/api/images/manifest', { 
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok && response.status === 404) {
        console.log('Static manifest not found, falling back to Google Drive API...');
        response = await fetch('/api/images', { 
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }
      
      const images = await response.json();
      
      if (images.error) {
        throw new Error(images.error);
      }
      
      setArtImages(images);
      
    } catch (error) {
      console.error("Error refreshing images:", error);
      setImagesError(error instanceof Error ? error.message : "Failed to refresh images");
    } finally {
      setImagesLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchImages() {
      try {
        setImagesLoading(true);
        
        let response = await fetch('/api/images/manifest');
        
        if (!response.ok && response.status === 404) {
          console.log('Static manifest not found, falling back to Google Drive API...');
          response = await fetch('/api/images');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }
        
        const images = await response.json();
        
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
        if (e.data.requestId === latestRequestRef.current) {
          setPreviewImage(e.data.base64);
          setPreviewLoading(false);
          processingRef.current = false;
        }
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
    latestRequestRef.current = '';
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
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

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setPreviewLoading(true);
      processingRef.current = true;
      
      const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      latestRequestRef.current = requestId;

      try {
        let imageUrl = image;
        if (isGoogleDriveUrl(image)) {
          imageUrl = await getJimpCompatibleUrl(image);
        }

        let arrayBuffer = imageCache.current.get(imageUrl);
        
        if (!arrayBuffer) {
          const response = await fetch(imageUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          
          arrayBuffer = await response.arrayBuffer();
          
          imageCache.current.set(imageUrl, arrayBuffer);
          
          if (imageCache.current.size > 10) {
            const firstKey = imageCache.current.keys().next().value;
            if (firstKey) imageCache.current.delete(firstKey);
          }
        }
        
        if (processingRef.current && arrayBuffer && workerRef.current) {
          workerRef.current.postMessage({ 
            image: arrayBuffer, 
            manip, 
            imageSet: settings,
            type,
            step: currentStepRef.current,
            requestId
          });
        }
      } catch (err) {
        console.error('Error processing image:', err);
        setPreviewLoading(false);
        processingRef.current = false;
      }
    }, 300);
  }, []);


  if (imagesLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg text-zinc-100">Loading images...</p>
        <p className="text-sm text-zinc-400">This may take a moment</p>
      </div>
    );
  }


  if (imagesError) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center">
        <p className="text-lg text-red-400 mb-4">Error loading images</p>
        <p className="text-sm text-zinc-400 mb-4">{imagesError}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
          <button 
            onClick={refreshImages} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={imagesLoading}
          >
            {imagesLoading ? 'Refreshing...' : 'Force Refresh'}
          </button>
        </div>
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
              onImageUpload={handleImageUpload}
            />
            :
            currentStep === 3
            ?
            <CreateCardBacks 
              artImages={artImages}
              imageSet={imageSet} 
              processImage={processImage}
              onImageUpload={handleImageUpload}
            />
            :
            currentStep === 2
            ?
            <CreateMenus 
              artImages={artImages}
              imageSet={imageSet} 
              processImage={processImage}
              onImageUpload={handleImageUpload}
            />
            :
            <CreatePlaymats 
              artImages={artImages}
              imageSet={imageSet} 
              processImage={processImage}
              onImageUpload={handleImageUpload}
            />
          }
          
        </div>
      </div>
    </>
  );
} 