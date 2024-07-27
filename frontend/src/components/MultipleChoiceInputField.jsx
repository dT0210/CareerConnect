import { useEffect, useRef, useState } from "react";
import useClickOutside from "../hooks/useClickOutside";

export const MultipleChoiceInputField = ({
  label,
  onChange,
  options,
  className,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const optionsListRef = useRef();

  useClickOutside(optionsListRef, () => {
    setShowOptions(false);
  });

  useEffect(()=>{
    setFilteredOptions(options);
  }, [options]);

  useEffect(()=>{
    onChange(selectedOptions);
  }, [selectedOptions])

  const handleOptionClick = (option) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((selectedOption) => selectedOption.value !== option.value);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  return (
    <div className="bg-slate-200 p-2 relative w-full">
      <div>{label}</div>
      <div ref={optionsListRef}>
        <input
          type="text"
          onChange={(e) => {
            setFilteredOptions(options.filter(option=>option.label.toLowerCase().includes(e.target.value)))
            if (e.target.value !== "") setShowOptions(true);
          }}
          onClick={() => setShowOptions(true)}
          className="focus:outline-none px-2 py-1 w-full"
          placeholder="Search"
        />
        <div
          className={`absolute ${!showOptions && "hidden"} bg-slate-200 w-full max-h-[200p] bottom-full left-0`}
        >
          {filteredOptions.map((option, index) => (
            <div
              className="hover:cursor-pointer transition-all hover:bg-slate-400 p-2 flex items-center gap-2"
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="checkbox"
                name={`option-${index}`}
                id={`option-${index}`}
                key={index}
                value={option.value}
                checked={selectedOptions.includes(option)}
                onClick={() => handleOptionClick(option)}
              />
              <label
                htmlFor={`option-${index}`}
                className="hover:cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};