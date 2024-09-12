import { useEffect, useRef, useState } from "react";
import useClickOutside from "../hooks/useClickOutside";

export const MultipleChoiceDropDown = ({
  label,
  onChange,
  options,
  className,
  defaultValues,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const [filteredOptions, setFilteredOptions] = useState(options);
  const optionsListRef = useRef();

  useClickOutside(optionsListRef, () => {
    setShowOptions(false);
  });

  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    setFilteredOptions(options);
    if (defaultValues)
      setSelectedOptions(
        options.filter((option) => defaultValues.includes(option.value))
      );
  }, [options]);

  const handleOptionClick = (option) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter(
          (selectedOption) => selectedOption.value !== option.value
        );
      } else {
        return [...prevSelected, option];
      }
    });
  };

  let wrapperStyle = `${className} bg-slate-200 p-2 relative rounded-md ${
    className?.includes("w-[") ? "" : "w-full"
  }`;
  
  return (
    <div className={wrapperStyle}>
      <div>{label}</div>
      <div ref={optionsListRef}>
        <input
          type="text"
          onChange={(e) => {
            setFilteredOptions(
              options.filter((option) =>
                option.label.toLowerCase().includes(e.target.value)
              )
            );
            if (e.target.value !== "") setShowOptions(true);
          }}
          onClick={() => setShowOptions(true)}
          className="focus:outline-none px-2 py-1 w-full rounded-md"
          placeholder="Search"
        />
        <div className="flex mt-2 gap-2 flex-wrap">
          {selectedOptions.map((option, index) => (
            <div className="px-2 py-1 bg-white" key={index}>
              {option.label}{" "}
              <span
                className="hover:cursor-pointer text-sm"
                onClick={() => {
                  setSelectedOptions(
                    selectedOptions.filter(
                      (selectedOptions) =>
                        selectedOptions.value !== option.value
                    )
                  );
                }}
              >
                &#10005;
              </span>
            </div>
          ))}
        </div>
        <div
          className={`absolute ${
            !showOptions && "hidden"
          } bg-slate-200 w-full max-h-[200p] bottom-full left-0 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_3px]`}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="hover:cursor-pointer transition-all hover:bg-slate-400 p-2 flex items-center gap-2"
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="checkbox"
                name={`option-${index}`}
                id={`option-${index}`}
                value={option.value}
                checked={selectedOptions.includes(option)}
                onClick={() => handleOptionClick(option)}
                onChange={() => {}}
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
