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
    <label className="label bg-zinc-50 bg-opacity-70 px-4 py-3 my-6 rounded-full text-zinc-900 shadow-sm   shadow-black">
          <span className="pr-2">Select Menu: </span>
          <select 
            name="menu-select" 
            className="select select-sm text-lg"
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