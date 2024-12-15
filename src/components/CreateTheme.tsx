"use client";

import CreateThemeSteps from "./CreateThemeSteps";
import CreatePlaymats from "./CreatePlaymats";
import { imageSet, LeaderColor } from "@/utils/imageSet";
import {Jimp} from "jimp"; // Correct import for Jimp

import Image from "next/image";
import { ImageOption } from "@/app/create/page";
import { useState } from "react";
import { processSinglePlaymat } from "@/utils/jimpManips";

type CreateThemeProps = {
  artImages: ImageOption[];
};

export default function CreateTheme({ artImages }: CreateThemeProps) {

  const [previewImage, setPreviewImage] = useState("");

  async function updatePreview(leaderColor: LeaderColor) {
    try {
      let image = await Jimp.read(imageSet.playmats.images[leaderColor].src);
      image = await processSinglePlaymat(image, imageSet.playmats);
      const base64 = await image.getBase64("image/png");
      setPreviewImage(base64);
    }
    catch(err) {
      console.error(err);
    }

  }

  return (
    <>
      <div className="w-full py-4 flex justify-around pr-12 items-center rounded-3xl text-zinc-100 bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
        <CreateThemeSteps />
      </div>

      <div className="w-full h-0 flex-grow gap-8 flex justify-center items-center">
        <div className="w-1/2 h-full p-6 flex justify-center items-center rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black text-zinc-100 text-3xl">
          {previewImage ? (
            <Image
              src={previewImage}
              alt="preview"
              width={707}
              height={500}
              className="w-auto"
            />
          ) : (
            "No Image Selected"
          )}
        </div>

        <div className="w-1/2 h-full p-8 flex flex-col rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
          <CreatePlaymats artImages={artImages} imageSet={imageSet} updatePreview={updatePreview} />
        </div>
      </div>
    </>
  );
}
