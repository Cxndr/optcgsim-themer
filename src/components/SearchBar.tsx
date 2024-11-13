import { FaMagnifyingGlass } from "react-icons/fa6"


export default function SearchBar() {

  return (
    <label className="input flex items-center gap-2 text-zinc-900 shadow-sm shadow-black">
      <input type="text" className="grow" placeholder="Search"/>
      <FaMagnifyingGlass className="text-zinc-900 opacity-70 cursor-pointer"/>
    </label>
  )
}