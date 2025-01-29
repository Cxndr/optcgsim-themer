
import { ImageSet, isPlaymatOverlayStyle } from "@/utils/imageSet"
import { useState, useEffect } from "react";
import { PlaymatOverlayStyleValues } from "@/utils/imageSet";

type SelectOverlayPlaymatProps = {
  settings: ImageSet["playmats"],
  updatePreview: () => void;
}

export default function SelectOverlayPlaymat({settings, updatePreview}:SelectOverlayPlaymatProps) {

  const [overlay, setOverlay] = useState(settings.overlay);

  useEffect(() => {
    setOverlay(settings.overlay);
  }, [settings.overlay]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const selectedValue = e.currentTarget.value;
      if (!isPlaymatOverlayStyle(selectedValue)) throw new Error("Invalid overlay style selected");
      setOverlay(selectedValue);
      settings.overlay = selectedValue;
      updatePreview();
    } catch (err) {
      console.error("Invalid overlay style selected: ", err);
    }
  }

  return (
    <label className="label flex flex-col gap-1 lg:flex-row lg:gap-0 pt-0.5 lg:py-0">
      
      <span className="label-text text-zinc-50 lg:pr-2">Overlay: </span>

      <select 
        name="overlay-style"
        className="select select-ghost"
        value={overlay}
        onChange={handleChange}
      >
        {PlaymatOverlayStyleValues.map((style, index) => (
          <option key={index} value={style}>{style}
          </option>
        ))}
      </select>

    </label>
  )
}