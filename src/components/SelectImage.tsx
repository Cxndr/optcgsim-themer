"use client"

import { ThemeImage } from "@/utils/imageSet";
import Image from "next/image";
import CustomScrollbars from "./CustomScrollbars";
import { useRef, useState } from "react";

type SelectImageProps = { 
  aspectRatio: string;
  gridCols: number;
  artImages: ThemeImage[];
  handleImageClick: (image: ThemeImage | null) => void;
  selectedImage: ThemeImage | null;
  searchTerm: string;
  onImageUpload?: (newImage: ThemeImage) => void;
}

export default function SelectImage({aspectRatio, gridCols, artImages, handleImageClick, selectedImage, searchTerm, onImageUpload}:SelectImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image file is too large. Please select an image smaller than 10MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 data URL
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Create ThemeImage object
      const uploadedImage: ThemeImage = {
        src: base64,
        name: `Uploaded: ${file.name.replace(/\.[^/.]+$/, '')}` // Remove extension
      };

      // Add to images list if callback provided
      if (onImageUpload) {
        onImageUpload(uploadedImage);
      }

      // Auto-select the uploaded image
      handleImageClick(uploadedImage);

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Separate uploaded images from regular images
  const uploadedImages = artImages.filter(image => image.name?.startsWith('Uploaded:'));
  const regularImages = artImages.filter(image => !image.name?.startsWith('Uploaded:'));

  // Apply search filter to both uploaded and regular images
  let filteredUploadedImages = uploadedImages;
  let filteredRegularImages = regularImages;
  
  if (searchTerm) {
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    filteredUploadedImages = uploadedImages.filter(image => 
      searchTerms.every(term => 
        image.name?.toLowerCase().includes(term)
      )
    );
    filteredRegularImages = regularImages.filter(image => 
      searchTerms.every(term => 
        image.name?.toLowerCase().includes(term)
      )
    );
  }

  return (
    <div className="flex-grow overflow-auto">
      <CustomScrollbars>
        <div className={`grid grid-cols-${gridCols} gap-2 lg:gap-4 lg:mr-4`}> {/* dynamic grid cols works because whitelist in tailwind.config.ts */}
          
          {/* None Option - Always First */}
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

          {/* Upload Image Option - Always Second */}
          <div
            onClick={handleUploadClick}
            className="relative w-full cursor-pointer group rounded-xl border-2 border-dashed border-zinc-400/50 group-hover:border-zinc-300 shadow-sm shadow-black overflow-hidden"
            style={{ aspectRatio: aspectRatio }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-50 bg-gradient-to-br from-blue-600/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-500/30 transform transition-all ease-in-out duration-300 group-hover:scale-105 rounded-xl">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-300 mb-2"></div>
                  <span className="text-sm">Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 mb-2 text-zinc-300 group-hover:text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm text-center px-2">Upload Image</span>
                </>
              )}
            </div>
          </div>

          {/* User Uploaded Images - Third */}
          {
            filteredUploadedImages.map((image, index) => (
              <a 
                onClick={() => handleImageClick(image)}
                key={`uploaded-${index}`}
                className="relative w-full overflow-hidden rounded-xl shadow-sm shadow-black select-none"
                style={{ aspectRatio: aspectRatio }}
              >
                {image.src &&
                  <Image 
                    src={image.src || ''}
                    alt={image.name || "no image set"}
                    className="w-full h-full object-cover hover:scale-110 transform transition-transform ease-in-out duration-700"
                    width={400} height={400}
                    draggable={false}
                    onError={() => {
                      console.warn('⚠️ Uploaded image failed to load:', image.name);
                    }}
                    onLoad={() => {
                      console.log('✅ Uploaded image loaded successfully:', image.name);
                    }}
                  />
                }
                {
                  selectedImage &&
                  image.src === selectedImage.src && <div className="absolute top-0 left-0 w-full h-full bg-zinc-300 bg-opacity-10 border-accent border-4 rounded-xl"></div>
                }
              </a>
            ))
          }

          {/* Regular Images from Google Drive - Fourth */}
          {
            filteredRegularImages.map((image, index) => (
              <a 
                onClick={() => handleImageClick(image)}
                key={`regular-${index}`}
                className="relative w-full overflow-hidden rounded-xl shadow-sm shadow-black group select-none"
                style={{ aspectRatio: aspectRatio }}
              >
                {image.src ? (
                  <div className="w-full h-full relative">
                    <Image 
                      src={image.src}
                      alt={image.name || "no image set"}
                      className="w-full h-full object-cover hover:scale-110 transform transition-transform ease-in-out duration-700"
                      width={400} height={400}
                      draggable={false}
                      onError={(e) => {
                        // Show fallback placeholder instead of console error
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.image-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'image-fallback w-full h-full flex items-center justify-center bg-zinc-700/50 text-zinc-400 text-xs text-center p-2';
                          fallback.innerHTML = `<div><div class="text-lg mb-1">🖼️</div><div>Thumbnail<br/>unavailable</div></div>`;
                          parent.appendChild(fallback);
                        }
                      }}
                      onLoad={() => {
                        // Only log successful loads in development
                        if (process.env.NODE_ENV === 'development') {
                          console.log('✅ Image loaded:', image.name);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-700/50 text-zinc-400 text-xs text-center p-2">
                    <div>
                      <div className="text-lg mb-1">🖼️</div>
                      <div>No image<br/>available</div>
                    </div>
                  </div>
                )}
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