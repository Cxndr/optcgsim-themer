
import { ImageSet, isPlaymatOverlayStyle } from "@/utils/imageSet"

type SelectOverlayPlaymatProps = {
  settings: ImageSet["playmats"],
  updatePlaymatPreview: () => void;
}

export default function SelectOverlay({settings, updatePlaymatPreview}:SelectOverlayPlaymatProps) {

  function returnSelection(e: React.ChangeEvent<HTMLSelectElement>) {
    try {
      if (!isPlaymatOverlayStyle(e.currentTarget.value)) throw new Error("Invalid overlay style selected");
      settings.overlay = e.currentTarget.value;
      updatePlaymatPreview();
    } catch(err) { console.error("Invalid overlay style selected: ", err); }
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