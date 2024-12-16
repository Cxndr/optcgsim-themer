
import { ImageSet } from "@/utils/imageSet"

type SelectShadowStyleProps = {
  settings: ImageSet,
  settingType: "playmats" | "cardBacks" | "donCards" | "cards",
  updatePlaymatPreview: () => void;
}

export default function SelectShadowStyle({settings, settingType, updatePlaymatPreview}:SelectShadowStyleProps) {

  function returnSelection(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      settings[settingType].shadow = true;
      updatePlaymatPreview();
    }
    else {
      settings[settingType].shadow = false;
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