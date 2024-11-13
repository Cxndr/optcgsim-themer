"use client";

export default function SelectLeaderColor() {

  return (
    <label className="label bg-zinc-50 bg-opacity-70 px-4 py-3 my-6 rounded-full text-zinc-900 shadow-sm   shadow-black">
          <span className="pr-2">Select Leader Color: </span>
          <select name="leader-select" className="select select-sm text-lg">
            <option>Black</option>
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