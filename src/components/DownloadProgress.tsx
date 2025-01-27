type DownloadProgressProps = {
  generateTheme: {
    progressFeedback: string,
    start: () => void,
    cancel: () => void,
    download: () => void,
  }
}

export default function DownloadProgress({downloadSet}:DownloadProgressProps) {

  return (
  <dialog id="download_modal" className="modal">
    <div className="modal-box bg-zinc-800/90 flex flex-col items-center">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <h3 className="font-bold text-lg text-center">Download Theme</h3>

      <p className="py-4">Click start to begin generating theme files.
      </p>

      <p>
        {generateTheme.progressFeedback}
      </p>

      <button
        onClick={generateTheme.start}
        className="btn btn-success font-bold text-xl w-20"
      >
        Start
      </button>

      <button
        onClick={generateTheme.start}
        className="btn btn-success font-bold text-xl w-20"
      >
        Cancel
      </button>

      <button
        onClick={generateTheme.download}
        className="btn btn-success font-bold text-xl w-36"
      >
        Download Theme
      </button>

    </div>
  </dialog>
  )
}