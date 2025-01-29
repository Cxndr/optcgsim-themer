
import { CardBackType, ImageSet, isCardOverlayStyle } from "@/utils/imageSet"
import { useState, useEffect } from "react";
import { CardOverlayStyleValues } from "@/utils/imageSet";

type SelectOverlayCardsProps = {
  settings: ImageSet["cardBacks"],
  updatePreview: () => void,
  selectedCardBackType: CardBackType,
}

export default function SelectOverlayCards({settings, updatePreview, selectedCardBackType }:SelectOverlayCardsProps) {

  const [overlay, setOverlay] = useState(settings.overlayDeck);

  useEffect(() => {
    if (selectedCardBackType === "DeckCards") {
      setOverlay(settings.overlayDeck);
    }
    else {
      setOverlay(settings.overlayDon);
    }

  }, [settings.overlayDeck, settings.overlayDon, selectedCardBackType]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const selectedValue = e.currentTarget.value;
      if (!isCardOverlayStyle(selectedValue)) throw new Error("Invalid overlay style selected");
      if (selectedCardBackType === "DeckCards") {
        setOverlay(selectedValue);
        settings.overlayDeck = selectedValue;
      }
      else {
        setOverlay(selectedValue);
        settings.overlayDon = selectedValue;
      }
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
        {CardOverlayStyleValues.map((style, index) => (
          <option key={index} value={style}>{style}
          </option>
        ))}
      </select>

    </label>
  )
}