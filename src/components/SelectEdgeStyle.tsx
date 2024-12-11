
import { ImageSet } from "@/utils/imageSet";

type SelectEdgeStyleProps = {
  settings: ImageSet["playmats"], // todo: make this modular to work with other than playmats.
  updatePlaymatPreview: () => void;
}

export default function SelectEdgeStyle({settings, updatePlaymatPreview}:SelectEdgeStyleProps) {

  function returnSelection(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.currentTarget.value === "rounded-large" || e.currentTarget.value === "rounded-med" || e.currentTarget.value === "rounded-small" || e.currentTarget.value === "square") {
      settings.edgeStyle = e.currentTarget.value;
      updatePlaymatPreview();
    }
    else {
      console.error("Invalid edge style selected");
    }
  }

  return (
    <label className="label">
      <span className="label-text text-zinc-50 pr-2 text-xl">Edge Style: </span>
      <select name="edge-style" className="select select-ghost"
        onChange={returnSelection}
      >
        <option value="rounded-large">Rounded Large</option>
        <option value="rounded-med">Rounded Medium</option>
        <option value="rounded-small">Rounded Small</option>
        <option value="square">Square</option>
      </select>
    </label>
  )
}