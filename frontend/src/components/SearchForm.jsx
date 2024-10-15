import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import useDebounce from "../hooks/useDebounce";

export const SearchForm = ({ setSearch, onSubmit, placeholder, className }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  useDebounce(
    () => {
      if (!isInitialRender) {
        setSearch(searchQuery);
      }
    },
    [searchQuery],
    1000
  );

  const onSearchSubmit = async () => {
    setSearch(searchQuery);
    if (onSubmit) {
      onSubmit();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearch("");
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="relative border border-slate-300 rounded-md">
      <IoSearchOutline className="absolute m-auto top-0 bottom-0 left-3 opacity-50" />
      <input
        type="text"
        value={searchQuery}
        placeholder={placeholder || "Search..."}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="  focus:outline-none  px-8 py-2 bg-transparent"
      />
      {searchQuery && <IoMdClose className="absolute m-auto top-0 bottom-0 right-3 opacity-50 hover:cursor-pointer" onClick={clearSearch}/>}
    </div>
  );
};
