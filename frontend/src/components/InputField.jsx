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
  let inputFieldStyle = `focus:outline-none rounded-md bg-transparent w-full focus:bg-white focus:p-2 transition-all `;
  let inputWrapperStyle = `${className} bg-slate-200 p-2 h-fit rounded-md ${
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
        <textarea className={inputFieldStyle} rows={4} {...props}></textarea>
      ) : (
        <input className={inputFieldStyle} {...props} />
      )}
    </div>
  );
};

export default InputField;
