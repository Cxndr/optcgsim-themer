import Image from "next/image";
import { DotLoader } from "react-spinners";

type PreviewPaneProps = {
  previewImage: string,
  previewLoading: boolean
}

export default function PreviewPane({ previewImage, previewLoading }: PreviewPaneProps) {
  return (
    <div className="w-full h-full text-center flex flex-col">
      <h2 className="text-center text-zinc-300 text-lg lg:text-3xl font-bold lg:mb-2 flex-shrink-0">
        Preview
      </h2>

      <div className="flex-grow flex flex-col justify-center items-center overflow-hidden max-h-full">
        { previewLoading ? (
          <div className="flex flex-col justify-center items-center">
            <DotLoader color="#FFFFFF50"/>
            <p className="text-center text-zinc-100/50 text-lg lg:text-xl mt-8 italic">Loading</p>
          </div>
        ) : (
          previewImage ? (
            <Image
              src={previewImage}
              alt="preview"
              width={707}
              height={500}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-zinc-100 text-2xl lg:text-3xl opacity-50 italic">No Customizations Set</div>
          )
        )}
      </div>
    </div>
  );
}