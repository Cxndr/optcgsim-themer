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
    <label className="label bg-zinc-50 bg-opacity-70 px-2 pl-4 py-1.5 lg:px-4 lg:py-3 rounded-3xl lg:rounded-full text-zinc-900 shadow-sm shadow-black">
          <span className="pr-2 text-xs lg:text-xl">Leader Color: </span>
          <select 
            name="leader-select" 
            className="select select-sm select-small-height text-lg"
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