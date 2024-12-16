
import { ImageSet, isEdgeStyle } from "@/utils/imageSet";

type SelectEdgeStyleProps = {
  settings: ImageSet,
  settingType: "playmats" | "cardBacks" | "donCards" | "cards",
  updatePlaymatPreview: () => void;
}

export default function SelectEdgeStyle({settings, settingType, updatePlaymatPreview}:SelectEdgeStyleProps) {

  function returnSelection(e: React.ChangeEvent<HTMLSelectElement>) {
    try {
      if (!isEdgeStyle(e.currentTarget.value)) throw new Error("Invalid edge style selected");
      settings[settingType].edgeStyle = e.currentTarget.value;
      updatePlaymatPreview();
    } catch(err) { console.error("Invalid edge style selected: ", err); }
  }

  return (
    <label className="label">

      <span className="label-text text-zinc-50 pr-2 text-xl">Edge Style: </span>

      <select 
        name="edge-style" 
        className="select select-ghost"
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