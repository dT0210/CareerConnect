import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaFilter } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import useClickOutside from "../hooks/useClickOutside";

export const Select = ({
  label,
  defaultValue,
  options,
  onChange,
  className,
  search = false,
}) => {
  let selectWrapperStyle = `${className} relative rounded-md bg-slate-200 focus:outline-none h-fit ${
    className?.includes("w-[") ? "" : "w-full"
  }`;

  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === defaultValue)
  );
  const [openOptions, setOpenOptions] = useState(false);
  const selectRef = useRef();
  useClickOutside(selectRef, () => {
    setOpenOptions(false);
  });

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    onChange(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === defaultValue));
  }, [defaultValue]);

  return (
    <div className={selectWrapperStyle} ref={selectRef}>
      <div
        className="full flex justify-between p-2 hover:cursor-pointer items-center"
        onClick={() => setOpenOptions(!openOptions)}
      >
        <div className="flex items-center justify-center gap-2">
          <FaFilter className="opacity-70"/>
          {selectedOption?.label || label}
        </div>

        <FaAngleDown />
      </div>
      <div
        className={`absolute top-[110%] z-20 w-full overflow-auto shadow-md bg-slate-200 rounded-md ${
          !openOptions && "hidden "
        }`}
      >
        {search && (
          <div className="p-1 w-full">
            <input
              type="text"
              placeholder="Search"
              className="bg-white w-full px-2 py-1 rounded-md focus:outline-none"
              onChange={(e) => {
                setFilteredOptions(
                  options.filter((option) =>
                    option.label.toLowerCase().includes(e.target.value)
                  )
                );
              }}
            />
          </div>
        )}
        <div className="max-h-[165px] overflow-auto">
          {filteredOptions?.map((option, index) => (
            <div
              key={index}
              className="hover:cursor-pointer hover:bg-slate-300 transition-all px-2 py-1 flex justify-between items-center"
              onClick={() => {
                if (selectedOption && selectedOption.value === option.value) {
                  setSelectedOption(null);
                } else setSelectedOption(option);
              }}
            >
              {option.label}
              {selectedOption === option && <MdDone />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
