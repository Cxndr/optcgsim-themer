"use client";

import { CardBackType, CardBackTypeValues, imageSet } from "@/utils/imageSet";
import { addSpacesToText } from "@/utils/textUtils";

type selectCardBackTypeProps = {
  setCardBackType: (value:CardBackType) => void;
}

export default function SelectCardBackType({setCardBackType}:selectCardBackTypeProps) {


  function handleChange(value:CardBackType) {
    setCardBackType(value)
  }

  return (
    <label className="label bg-zinc-50 bg-opacity-70 px-2 pl-4 py-1.5 lg:px-4 lg:py-3 rounded-3xl lg:rounded-full text-zinc-900 shadow-sm shadow-black">
          <span className="pr-2 text-xs lg:text-xl">Card Type: </span>
          <select 
            name="cardback-select" 
            className="select select-sm select-small-height text-lg"
            onChange={(e) => handleChange(e.target.value as CardBackType)}
          >
            {CardBackTypeValues.map((type, index) => (
              <option key={index} value={type}>
                {addSpacesToText(type)} {imageSet.cardBacks.images[type].src && ("✅")}
              </option>
            ))}
          </select>
        </label>
  )
}