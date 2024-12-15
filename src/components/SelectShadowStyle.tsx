
import { ImageSet } from "@/utils/imageSet"

type SelectShadowStyleProps = {
  settings: ImageSet["playmats"], // todo: make this modular to work with other than playmats.
  updatePlaymatPreview: () => void;
}

export default function SelectShadowStyle({settings, updatePlaymatPreview}:SelectShadowStyleProps) {

  function returnSelection(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      settings.shadow = true;
      updatePlaymatPreview();
    }
    else {
      settings.shadow = false;
      updatePlaymatPreview();
    }
  }

  return (
    <label className="label">
      <span className="label-text text-zinc-50 pr-2 text-xl">Shadow: </span>
      <input 
        type="checkbox" 
        name="shadow-style" 
        className="toggle toggle-accent toggle-lg"
        onChange={returnSelection}
      />
    </label>
  )
}