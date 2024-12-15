
import { ImageSet } from "@/utils/imageSet"

type SelectOverlayProps = {
  settings: ImageSet["playmats"], // todo: make this modular to work with other than playmats.
  updatePlaymatPreview: () => void;
}

export default function SelectOverlay({settings, updatePlaymatPreview}:SelectOverlayProps) {

  function returnSelection(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.currentTarget.value === "none" || e.currentTarget.value === "area-markers" || e.currentTarget.value === "area-markers-text") {
      settings.overlay = e.currentTarget.value;
      updatePlaymatPreview();
    }
    else {
      console.error("Invalid overlay style selected");
    }
  }

  return (
    <label className="label">
      
      <span className="label-text text-zinc-50 pr-2 text-xl">Overlay: </span>

      <select 
        name="overlay-style"
        className="select select-ghost"
        onChange={returnSelection}
      >
        <option value="none">None</option>
        <option value="area-markers">Area Markers</option>
        <option value="area-markers-text">Area Markers + Text</option>
      </select>

    </label>
  )
}