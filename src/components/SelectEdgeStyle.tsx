
import { ImageSet, isEdgeStyle } from "@/utils/imageSet";
import { useState, useEffect } from "react";
import { EdgeStyleValues } from "@/utils/imageSet";

type SelectEdgeStyleProps = {
  settings: ImageSet,
  settingType: "playmats" | "cardBacks" | "donCards" | "cards",
  updatePreview: () => void;
}

export default function SelectEdgeStyle({settings, settingType, updatePreview}:SelectEdgeStyleProps) {

  const [edgeStyle, setEdgeStyle] = useState(settings[settingType].edgeStyle);

  useEffect(() => {
    setEdgeStyle(settings[settingType].edgeStyle);
  }, [settingType, settings]);


  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const selectedValue = e.currentTarget.value;
      if (!isEdgeStyle(selectedValue)) throw new Error("Invalid edge style selected");
      setEdgeStyle(selectedValue);
      settings[settingType].edgeStyle = selectedValue;
      updatePreview();
    } catch(err) { console.error("Invalid edge style selected: ", err); }
  }

  return (
    <label className="label flex flex-col gap-1 lg:flex-row lg:gap-0 pt-0.5 lg:pt-2">

      <span className="label-text text-zinc-50 lg:pr-2">Edge Style: </span>

      <select 
        name="edge-style" 
        className="select select-ghost"
        value={edgeStyle}
        onChange={handleChange}
      >
        {EdgeStyleValues.map((style, index) => (
          <option key={index} value={style}>{style}
          </option>
        ))}
      </select>

    </label>
  )
}