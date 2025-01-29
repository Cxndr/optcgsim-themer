import { generateTheme, ImageSet } from "@/utils/imageSet"
import { useState, useEffect } from "react";

type DownloadProgressProps = {
  imageSet: ImageSet,
}

export default function DownloadProgress({imageSet}:DownloadProgressProps) {
  const [zipFile, setZipFile] = useState(new Uint8Array);
  const [feedback, setFeedback] = useState(generateTheme.progressFeedback());
  const [details, setDetails] = useState(generateTheme.progressDetails());

  async function clickStart() {
    const themeData = await generateTheme.makeTheme(imageSet);
    setZipFile(new Uint8Array(themeData));
  }

  function clickDownload() {
    generateTheme.downloadTheme(zipFile);
    console.log(imageSet);
  }

  // Poll for changes in progress values
  useEffect(() => {
    const unsubscribe = generateTheme.onProgress(() => {
      setFeedback(generateTheme.progressFeedback());
      setDetails(generateTheme.progressDetails());
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <dialog id="download_modal" className="modal">

      <div className="modal-box bg-zinc-50/85 text-zinc-900 flex flex-col items-center shadow-2xl shadow-black rounded-3xl">

        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h2 className="font-bold text-2xl text-center">
          Download Theme
        </h2>

        <p className="py-4 text-center text-sm">
          Check the <a href="./faq" target="_blank">install guide</a> for instructions on how to install your theme.
        </p>

        <h4 className="text-base font-bold text-zinc-600">{feedback}</h4>

        <p className="text-zinc-600">{details}</p>
        
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={clickStart}
            className="btn btn-secondary font-bold shadow-xs shadow-black"
            disabled={generateTheme.generating}
          >
            Generate Theme
          </button>

          <button
            onClick={clickDownload}
            className="btn btn-success font-bold shadow-xs shadow-black"
            disabled={!generateTheme.downloadReady}
          >
            Download Theme
          </button>
        </div>
        

      </div>

    </dialog>
  )
}