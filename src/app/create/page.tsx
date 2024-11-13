"use server";

import Image from "next/image"
import { Jimp } from "jimp"
import CreatePlaymats from "@/components/CreatePlaymats";
import path from "path";
import fs from "fs";

export type ThemeImage = typeof Jimp | null;
export type EdgeStyle = "square" | "rounded-small" | "rounded-med" | "rounded-large";
export type Overlay = typeof Jimp | null;

export type ImageOptions = {
  name: string,
  url: string,
}[];

export type SimTheme = {
  playmats: {
    overlay: Overlay,
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      Black: ThemeImage, BlackYellow: ThemeImage, Blue: ThemeImage, BlueBlack: ThemeImage, BluePurple: ThemeImage, BlueYellow: ThemeImage, Green: ThemeImage, GreenBlack: ThemeImage, GreenBlue: ThemeImage, GreenPurple: ThemeImage, GreenYellow: ThemeImage, Purple: ThemeImage, PurpleBlack: ThemeImage, PurpleYellow: ThemeImage, Red: ThemeImage, RedBlack: ThemeImage, RedBlue: ThemeImage, RedGreen: ThemeImage, RedPurple: ThemeImage, RedYellow: ThemeImage, Yellow: ThemeImage;
    };
  };
  menus: {
    bgImages: {
      background: ThemeImage,
      deckeditbackground: ThemeImage,
    };
  }
  cardBacks: {
    overlay: Overlay,
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      CardBackRegular: ThemeImage,
      CardBackDon: ThemeImage,
    };
  }
  donCards: {
    overlay: Overlay,
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      DonCard: ThemeImage,
    };
  }
  cards: {
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      [key: string]: ThemeImage,
    };
  }
};

export default async function CreatePage() {

  async function getArtImages() {
    "use server";
    const images: ImageOptions = [];
    const imgRelPath = "/img/art";
    const imgFolder = path.resolve(process.cwd(), "public", "img", "art"); // Absolute path to img/art inside public
    const folders = fs.readdirSync(imgFolder);
    for (const folder of folders) {
      const subFolderPath = path.join(imgFolder, folder);
      const stats = fs.statSync(subFolderPath);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(subFolderPath);
        files.forEach((file, index) => {
          images.push({
            name: `subFolderPath-${index}`, //file.split(".")[0],
            url: `${imgRelPath}/${folder}/${file}`,
          });
        });
      }
    }
    return images as ImageOptions;
  }

  const artImages = await getArtImages();


  return (
    <div className="w-full h-full p-10 gap-8 flex flex-col justify-center items-center">

      <div className="w-full py-4 flex justify-around pr-12 items-center rounded-3xl text-zinc-100 bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
        <ul className="steps w-full">
          <li className="step step-accent my-auto">Playmats</li>
          <li className="step my-auto">Menus</li>
          <li className="step my-auto">Card Backs</li>
          <li className="step my-auto">Don Cards</li>
          <li className="step my-auto">Cards</li>
        </ul>
        <button className="btn btn-success my-auto text-xl shadow-sm shadow-black">Download Set</button>
      </div>

      <div className="w-full h-0 flex-grow gap-8 flex justify-center items-center">

        <div className="w-1/2 h-full p-6 flex justify-center rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
          <Image 
            src="/img/test/Playmat.png" 
            alt="playmat" 
            width={707} height={500} 
            className="h-full w-auto"
          />
        </div>

        <div className="w-1/2 h-full p-8 flex flex-col rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
          <CreatePlaymats artImages={artImages}/>
        </div>

      </div>

    </div>
  )
}