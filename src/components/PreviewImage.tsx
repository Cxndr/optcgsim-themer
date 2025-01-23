import Image from "next/image";

export default function PreviewPane({ previewImage }: { previewImage: string }) {
  return (
    <div className="w-full h-full text-center flex flex-col">
      <h2 className="text-center text-zinc-300 text-3xl font-bold mb-2 flex-shrink-0">
        Preview
      </h2>

      <div className="flex-grow flex flex-col justify-center items-center overflow-hidden max-h-full">
        {previewImage ? (
          <Image
            src={previewImage}
            alt="preview"
            width={707}
            height={500}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-zinc-100 text-3xl opacity-50 italic">No Image Selected</div>
        )}
      </div>
    </div>
  );
}