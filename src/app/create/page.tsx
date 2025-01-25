import CreateTheme from "@/components/CreateTheme";
import { ThemeImage } from "@/utils/imageSet";

import { v2 as cloudinary } from "cloudinary";

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  asset_folder: string;
  context?: {
    custom?: Record<string, string>; // Optional metadata
  };
  tags?: string[];
}

interface CloudinarySearchResponse {
  resources: CloudinaryResource[];
}


export default async function CreatePage() {

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  async function getArtImages() {
    const folderPath = "optcgsim-themer";
    const images: ThemeImage[] = [];

    try {
      const response: CloudinarySearchResponse = await cloudinary.search
      .expression(`folder:${folderPath}/*`) // Search API handles dynamic folders better
      .max_results(500)
      .sort_by('public_id', 'asc')
      .execute();
  
      response.resources.forEach((file, index) => {
        images.push({
          name: `${file.asset_folder.split("/").pop()}-${index}`,
          src: file.secure_url,
        });
      });

      images.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
  
      return images;
    } catch (error) {
      console.error("Error fetching images from Cloudinary:", error);
      return [];
    }
  }

  const artImages = await getArtImages();

  return (
    <div className="w-full h-full p-10 gap-8 flex flex-col justify-center items-center">

      <CreateTheme artImages={artImages}/>

    </div>
  )
}