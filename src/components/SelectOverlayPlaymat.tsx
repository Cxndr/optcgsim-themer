
import { ImageSet, isPlaymatOverlayStyle } from "@/utils/imageSet"
import { useState, useEffect } from "react";
import { PlaymatOverlayStyleValues } from "@/utils/imageSet";

type SelectOverlayPlaymatProps = {
  settings: ImageSet["playmats"],
  updatePreview: () => void;
}

export default function SelectOverlay({settings, updatePreview}:SelectOverlayPlaymatProps) {

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
    <label className="label">
      
      <span className="label-text text-zinc-50 pr-2 text-xl">Overlay: </span>

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