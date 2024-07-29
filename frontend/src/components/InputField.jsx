const InputField = ({
  value,
  label,
  className,
  placeholder,
  onChange,
  required,
  type,
  name,
  id,
}) => {
  const props = { value, placeholder, onChange, required, type, name, id };
  let inputFieldStyle = `focus:outline-none bg-transparent w-full focus:bg-black focus:bg-opacity-10 focus:p-2 transition-all `;
  let inputWrapperStyle = `${className} bg-slate-200 p-2 ${
    className?.includes("w-[") ? "" : "w-full"
  }`;
  return (
    <div className={inputWrapperStyle}>
      {label && (
        <label htmlFor={id || ""} className="block text-sm">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea className={inputFieldStyle} {...props}></textarea>
      ) : (
        <input className={inputFieldStyle} {...props} />
      )}
    </div>
  );
};

export default InputField;
