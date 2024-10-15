import { twMerge } from "tailwind-merge";

const InputField = ({
  value,
  label,
  className,
  inputClassName,
  placeholder,
  onChange,
  required,
  type,
  name,
  id,
  disabled=false,
}) => {
  const props = { value, placeholder, onChange, required, type, name, id, disabled };
  let inputFieldClass = twMerge(`focus:outline-none rounded-md bg-transparent w-full focus:bg-white focus:p-2 transition-all`, inputClassName);
  if (disabled) inputFieldClass = twMerge("opacity-50 hover:cursor-not-allowed", inputFieldClass)
  const inputWrapperClass = twMerge(
    'bg-slate-200 p-2 h-fit rounded-md w-full',
    className
  );
  
  return (
    <div className={inputWrapperClass}>
      {label && (
        <label htmlFor={id || ""} className="block text-sm ">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea className={inputFieldClass} rows={4} {...props}></textarea>
      ) : (
        <input className={inputFieldClass} {...props} />
      )}
    </div>
  );
};

export default InputField;
