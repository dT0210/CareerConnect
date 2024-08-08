import { useEffect, useState } from "react";
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
    500
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
    <div>
      <input
        type="text"
        value={searchQuery}
        placeholder={placeholder || "Search..."}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-slate-300 focus:outline-none rounded-md px-2 py-1"
      />
    </div>
  );
};
