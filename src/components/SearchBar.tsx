import { FaMagnifyingGlass } from "react-icons/fa6"

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
}

export default function SearchBar({searchTerm, setSearchTerm}:SearchBarProps) {
  
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
  <label className="input min-w-4 h-10 lg:h-12 flex flex-grow 2xl:flex-grow-0 items-center gap-2 text-zinc-900 shadow-sm shadow-black">
      <input 
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        className="grow min-w-4" placeholder="Search"
      />
      <FaMagnifyingGlass className="text-zinc-900 opacity-70 cursor-pointer"/>
    </label>
  )
}