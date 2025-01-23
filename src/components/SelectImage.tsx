"use client"

import { ThemeImage } from "@/utils/imageSet";
import Image from "next/image";

type SelectImageProps = {
  aspectRatio: string;
  artImages: ThemeImage[];
  handleImageClick: (image: ThemeImage | null) => void;
  selectedImage: ThemeImage | null;
}

export default function SelectImage({aspectRatio, artImages, handleImageClick, selectedImage}:SelectImageProps) {

  const [imageWidth, imageHeight] = aspectRatio.split(" / ").map(Number);
  const imageRatio = imageWidth / imageHeight;
  let gridCols = 3;
  if (imageRatio < 1) {
    gridCols = 4;
  }


  return (
    <div className="flex-grow overflow-auto">
        <div className={`grid grid-cols-${gridCols} gap-4`}>
          <a
            onClick={() => handleImageClick(null)}
            className="relative w-full overflow-hidden rounded-xl shadow-sm shadow-black"
            style={{ aspectRatio: aspectRatio }}
          >
            <div className="w-full h-full flex items-center justify-center text-zinc-50">
              None
            </div>
          </a>
          {
            artImages.map((image, index) => (
              <a 
                onClick={() => handleImageClick(image)}
                key={index}
                className="relative w-full overflow-hidden rounded-xl shadow-sm shadow-black"
                style={{ aspectRatio: aspectRatio }}
              >
                {image.src &&
                  <Image 
                    src={image.src || ''}
                    alt={image.name || "no image set"}
                    className="w-full h-full object-cover hover:scale-110 transform transition-transform ease-in-out duration-700"
                    width={200} height={200}
                  />
                }
                {
                  selectedImage &&
                  image.src === selectedImage.src && <div className="absolute top-0 left-0 w-full h-full bg-zinc-300 bg-opacity-10 border-accent border-4 rounded-xl"></div>
                }
                
              </a>

            ))
          }
        </div>
      </div>
  )
}