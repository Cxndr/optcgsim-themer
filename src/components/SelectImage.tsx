"use client"

import { ThemeImage } from "@/utils/imageSet";
import Image from "next/image";
import CustomScrollbars from "./CustomScrollbars";

type SelectImageProps = {
  aspectRatio: string;
  gridCols: number;
  artImages: ThemeImage[];
  handleImageClick: (image: ThemeImage | null) => void;
  selectedImage: ThemeImage | null;
  searchTerm: string;
}

export default function SelectImage({aspectRatio, gridCols, artImages, handleImageClick, selectedImage, searchTerm}:SelectImageProps) {

  let filteredImages = artImages;
  if (searchTerm) {
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    filteredImages = artImages.filter(image => 
      searchTerms.every(term => 
        image.name?.toLowerCase().includes(term)
      )
    );
  }

  console.log(artImages);

  return (
    <div className="flex-grow overflow-auto">
      <CustomScrollbars>
        <div className={`grid grid-cols-${gridCols} gap-4 mr-4`}> {/* dynamic grid cols works because whitelist in tailwind.config.ts */}
          <a
            onClick={() => handleImageClick(null)}
            className="relative w-full overflow-hidden rounded-xl shadow-sm shadow-black"
            style={{ aspectRatio: aspectRatio }}
          >
            <div className="w-full h-full flex items-center justify-center text-zinc-50 bg-zinc-100/10 hover:scale-110 transform transition-transform ease-in-out duration-700">
              None
            </div>
            {
              !selectedImage &&
              <div className="absolute top-0 left-0 w-full h-full bg-zinc-300 bg-opacity-10 border-accent border-4 rounded-xl"></div>
            }
          </a>
          {
            filteredImages.map((image, index) => (

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
                    width={400} height={400}
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
      </CustomScrollbars>
    </div>
  )
}