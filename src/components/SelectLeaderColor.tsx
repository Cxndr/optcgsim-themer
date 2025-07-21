"use client";

import { imageSet, LeaderColor, LeaderColorValues } from "@/utils/imageSet";

type selectLeaderColorProps = {
  setLeaderColor: (value: string) => void; // Changed from LeaderColor to string to allow "All"
  value: string; // Add value prop to make select controlled
}

export default function SelectLeaderColor({setLeaderColor, value}:selectLeaderColorProps) {

  function handleChange(value: string) {
    setLeaderColor(value)
  }

  // Check if all leader colors have the same playmat set
  const firstColorSrc = imageSet.playmats.images[LeaderColorValues[0]].src;
  const allColorsSet = firstColorSrc !== "" && LeaderColorValues.every(color => 
    imageSet.playmats.images[color].src === firstColorSrc
  );

  return (
    <label className="label bg-zinc-50 bg-opacity-70 px-2 pl-4 py-1.5 lg:px-4 lg:py-3 rounded-3xl lg:rounded-full text-zinc-900 shadow-sm shadow-black">
          <span className="pr-2 text-xs lg:text-xl">Leader Color: </span>
          <select 
            name="leader-select" 
            className="select select-sm select-small-height text-lg"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value="All">
              [All] {allColorsSet ? "✅" : ""}
            </option>
            {LeaderColorValues.map((color, index) => (
              <option key={index} value={color}>
                {color} {imageSet.playmats.images[color].src && ("✅")}
              </option>
            ))}
          </select>
        </label>
  )
}