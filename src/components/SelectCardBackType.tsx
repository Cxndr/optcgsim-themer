"use client";

import { CardBackType, CardBackTypeValues } from "@/utils/imageSet";
import { addSpacesToText } from "@/utils/textUtils";

type selectCardBackTypeProps = {
  setCardBackType: (value:CardBackType) => void;
}

export default function SelectCardBackType({setCardBackType}:selectCardBackTypeProps) {


  function handleChange(value:CardBackType) {
    setCardBackType(value)
  }

  return (
    <label className="label bg-zinc-50 bg-opacity-70 px-4 py-3 my-6 rounded-full text-zinc-900 shadow-sm   shadow-black">
          <span className="pr-2">Select Card Type: </span>
          <select 
            name="cardback-select" 
            className="select select-sm text-lg"
            onChange={(e) => handleChange(e.target.value as CardBackType)}
          >
            {CardBackTypeValues.map((type, index) => (
              <option key={index} value={type}>{addSpacesToText(type)}
              </option>
            ))}
          </select>
        </label>
  )
}