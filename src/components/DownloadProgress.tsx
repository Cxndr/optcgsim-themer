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
      <div className="modal-box bg-zinc-800/90 flex flex-col items-center">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 className="font-bold text-lg text-center">
          Download Theme
        </h3>

        <p className="py-4">
          Click start to begin generating theme files.
        </p>

        <h4 className="text-xl font-bold">{feedback}</h4>
        <p>{details}</p>

        <button
          onClick={clickStart}
          className="btn btn-success font-bold text-xl w-20"
        >
          Start
        </button>

        <button
          className="btn btn-success font-bold text-xl w-20"
        >
          Cancel
        </button>

        <button
          onClick={clickDownload}
          className="btn btn-success font-bold text-xl w-36"
        >
          Download Theme
        </button>

      </div>
    </dialog>
  )
}