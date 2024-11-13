"use client";

import { LeaderColor } from "@/types/imageSet";

type selectLeaderColorProps = {
  setLeaderColor: (value:LeaderColor) => void;
}

export default function SelectLeaderColor({setLeaderColor}:selectLeaderColorProps) {


  function handleChange(value:LeaderColor) {
    setLeaderColor(value)
  }

  return (
    <label className="label bg-zinc-50 bg-opacity-70 px-4 py-3 my-6 rounded-full text-zinc-900 shadow-sm   shadow-black">
          <span className="pr-2">Select Leader Color: </span>
          <select 
            name="leader-select" 
            className="select select-sm text-lg"
            onChange={(e) => handleChange(e.target.value as LeaderColor)}
          >
            <option>Black</option> {/* todo - get this from type LeaderColor - not possible, but maybe use a prebuilt array to define this and the LeaderColor type from a single source*/}
            <option>Black Yellow</option>
            <option>Blue</option>
            <option>Blue Black</option>
            <option>Blue Purple</option>
            <option>Blue Yellow</option>
            <option>Green</option>
            <option>Green Black</option>
            <option>Green Blue</option>
            <option>Green Purple</option>
            <option>Green Yellow</option>
            <option>Purple</option>
            <option>Purple Black</option>
            <option>Purple Yellow</option>
            <option>Red</option>
            <option>Red Black</option>
            <option>Red Blue</option>
            <option>Red Green</option>
            <option>Red Purple</option>
            <option>Red Yellow</option>
            <option>Yellow</option>
          </select>
        </label>
  )
}