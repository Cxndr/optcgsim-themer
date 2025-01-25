"use client";

import { LeaderColor, LeaderColorValues } from "@/utils/imageSet";

type selectLeaderColorProps = {
  setLeaderColor: (value:LeaderColor) => void;
}

export default function SelectLeaderColor({setLeaderColor}:selectLeaderColorProps) {


  function handleChange(value:LeaderColor) {
    setLeaderColor(value)
  }

  return (
    <label className="label bg-zinc-50 bg-opacity-70 px-4 py-3 rounded-full text-zinc-900 shadow-sm   shadow-black">
          <span className="pr-2">Select Leader Color: </span>
          <select 
            name="leader-select" 
            className="select select-sm text-lg"
            onChange={(e) => handleChange(e.target.value as LeaderColor)}
          >
            {LeaderColorValues.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
  )
}