
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
    <label className="label flex flex-col gap-1 lg:flex-row lg:gap-0 pt-0.5 lg:pt-2">
      
      <span className="label-text text-zinc-50 lg:pr-2">Overlay: </span>

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