"use client";

export default function SelectOverlay() {

  return (
    <label className="label">
      <span className="label-text text-zinc-50 pr-2 text-xl">Overlay: </span>
      <select name="overlay-style" className="select select-ghost">
        <option value="none">None</option>
        <option value="area-markers">Area Markers</option>
        <option value="area-markers-text">Area Markers + Text</option>
      </select>
    </label>
  )
}