import Image from "next/image"
import CreatePlaymats from "@/components/CreatePlaymats";
import CreateThemeSteps from "@/components/CreateThemeSteps";
import path from "path";
import fs from "fs";
import { ImageSet } from "@/types/imageSet";


export type ImageOptions = {
  name: string,
  url: string,
}[];

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
  const imageSet = {} as ImageSet;  
  let previewImage = null;


  return (
    <div className="w-full h-full p-10 gap-8 flex flex-col justify-center items-center">

      <div className="w-full py-4 flex justify-around pr-12 items-center rounded-3xl text-zinc-100 bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
        <CreateThemeSteps />
      </div>

      <div className="w-full h-0 flex-grow gap-8 flex justify-center items-center">

        <div className="w-1/2 h-full p-6 flex justify-center items-center rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black text-zinc-100 text-3xl">
          { previewImage ? 
            <Image src={previewImage} alt="preview" width={707} height={500} className="h-full w-auto" /> 
            : 
            "No Image Selected"
          }
        </div>

        <div className="w-1/2 h-full p-8 flex flex-col rounded-3xl bg-zinc-800 bg-opacity-70 shadow-2xl shadow-black">
          <CreatePlaymats artImages={artImages} imageSet={imageSet}/>
        </div>

      </div>

    </div>
  )
}