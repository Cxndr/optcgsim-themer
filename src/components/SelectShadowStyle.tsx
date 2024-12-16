
import { ImageSet } from "@/utils/imageSet";
import { useState, useEffect } from "react";

type SelectShadowStyleProps = {
  settings: ImageSet,
  settingType: "playmats" | "cardBacks" | "donCards" | "cards",
  updatePreview: () => void;
}

export default function SelectShadowStyle({settings, settingType, updatePreview}:SelectShadowStyleProps) {

  const [shadow, setShadow] = useState(settings[settingType].shadow);

  useEffect(() => {
    setShadow(settings[settingType].shadow);
  }, [settingType, settings]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedValue = e.currentTarget.checked;
    setShadow(selectedValue);
    settings[settingType].shadow = selectedValue;
    updatePreview();
  }

  return (
    <label className="label">
      <span className="label-text text-zinc-50 pr-2 text-xl">Shadow: </span>
      <input 
        type="checkbox" 
        name="shadow-style" 
        className="toggle toggle-accent toggle-lg"
        checked={shadow}
        onChange={handleChange}
      />
    </label>
  )
}