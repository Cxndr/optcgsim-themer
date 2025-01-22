
import { ImageSet, isCardOverlayStyle } from "@/utils/imageSet"
import { useState, useEffect } from "react";
import { CardOverlayStyleValues } from "@/utils/imageSet";

type SelectOverlayCardsProps = {
  settings: ImageSet["cardBacks"],
  updatePreview: () => void;
}

export default function SelectOverlayCards({settings, updatePreview}:SelectOverlayCardsProps) {

  const [overlay, setOverlay] = useState(settings.overlay);

  useEffect(() => {
    setOverlay(settings.overlay);
  }, [settings.overlay]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const selectedValue = e.currentTarget.value;
      if (!isCardOverlayStyle(selectedValue)) throw new Error("Invalid overlay style selected");
      setOverlay(selectedValue);
      settings.overlay = selectedValue;
      updatePreview();
    } catch (err) {
      console.error("Invalid overlay style selected: ", err);
    }
  }

  return (
    <label className="label">
      
      <span className="label-text text-zinc-50 pr-2 text-xl">Overlay: </span>

      <select 
        name="overlay-style"
        className="select select-ghost"
        value={overlay}
        onChange={handleChange}
      >
        {CardOverlayStyleValues.map((style, index) => (
          <option key={index} value={style}>{style}
          </option>
        ))}
      </select>

    </label>
  )
}