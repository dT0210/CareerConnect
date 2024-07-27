import { useRef, useState } from "react";
import useClickOutside from "../hooks/useClickOutside";

export const MultipleChoiceInputField = ({
  label,
  onChange,
  options,
  className,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState("");
  const optionsListRef = useRef();

  useClickOutside(optionsListRef, () => {
    setShowOptions(false);
  });

  return (
    <div className="bg-slate-200 p-2 w-fit relative">
      <div>{label}</div>
      <input
        type="text"
        onChange={(e) => {
          setSearch(e.target.value);
          setShowOptions(e.target.value !== "");
        }}
        onClick={() => setShowOptions(true)}
      />
      <div
        className={`absolute ${!showOptions && "hidden"}`}
        ref={optionsListRef}
      >
        list
      </div>
    </div>
  );
};
