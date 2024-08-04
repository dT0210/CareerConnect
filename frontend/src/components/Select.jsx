import { useState } from "react";

export const Select = ({
  label,
  value,
  placeholder,
  options,
  onChange,
  name,
  id,
  required,
  className,
  search = false,
}) => {
  let inputFieldStyle = `focus:outline-none bg-transparent w-full focus:bg-black focus:bg-opacity-10 focus:p-2 transition-all `;
  let selectWrapperStyle = `${className} bg-slate-200 p-2 focus:outline-none h-fit ${
    className?.includes("w-[") ? "" : "w-full"
  }`;
  const props = { value, placeholder, onChange, required, name, id };
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  return (
    <select className={selectWrapperStyle} {...props}>
      {/* <input type="text" value={searchQuery}/> */}
      <option value="">{label}</option>
      {options.map((option, index) => (
        <option value={option.value} key={index}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
