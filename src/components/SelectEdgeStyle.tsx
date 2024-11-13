

export default function SelectEdgeStyle() {

  return (
    <label className="label">
      <span className="label-text text-zinc-50 pr-2 text-xl">Edge Style: </span>
      <select name="edge-style" className="select select-ghost">
        <option value="rounded-large">Rounded Large</option>
        <option value="rounded-med">Rounded Medium</option>
        <option value="rounded-small">Rounded Small</option>
        <option value="square">Square</option>
      </select>
    </label>
  )
}