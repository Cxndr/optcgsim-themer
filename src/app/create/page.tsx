import path from "path";
import fs from "fs";
import CreateTheme from "@/components/CreateTheme";
import { ThemeImage } from "@/utils/imageSet";

// export type ImageOption = {
//   name: string,
//   url: string,
// };

export default async function CreatePage() {

  async function getArtImages() {
    "use server";
    const images: ThemeImage[] = [];
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
            name: `${folder}-${index}`, //file.split(".")[0],
            src: `${imgRelPath}/${folder}/${file}`,
            image: null,
          });
        });
      }
    }
    return images as ThemeImage[];
  }

  const artImages = await getArtImages();
  console.log("artImages", artImages);

  return (
    <div className="w-full h-full p-10 gap-8 flex flex-col justify-center items-center">

      <CreateTheme artImages={artImages}/>

    </div>
  )
}