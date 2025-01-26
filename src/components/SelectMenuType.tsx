"use client";

import { MenuType, MenuTypeValues } from "@/utils/imageSet";
import { addSpacesToText } from "@/utils/textUtils";

type selectMenuTypeProps = {
  setMenuType: (value:MenuType) => void;
}

export default function SelectMenuType({setMenuType}:selectMenuTypeProps) {


  function handleChange(value:MenuType) {
    setMenuType(value)
  }

  return (
    <label className="label bg-zinc-50 bg-opacity-70 px-2 pl-4 py-1.5 lg:px-4 lg:py-3 rounded-3xl lg:rounded-full text-zinc-900 shadow-sm shadow-black">
          <span className="pr-2 text-xs lg:text-xl">Menu Type: </span>
          <select 
            name="menu-select" 
            className="select select-sm select-small-height text-lg"
            onChange={(e) => handleChange(e.target.value as MenuType)}
          >
            {MenuTypeValues.map((type, index) => (
              <option key={index} value={type}>{addSpacesToText(type)}
              </option>
            ))}
          </select>
        </label>
  )
}