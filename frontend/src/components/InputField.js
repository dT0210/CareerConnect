const InputField = (props) => {
  return (
    <div className="bg-slate-200 p-2 w-full">
      {props.label && (
        <label htmlFor={props.id || ""} className="block text-sm">
          {props.label}
        </label>
      )}
      {props.type === "textarea" ? (
        <textarea
          className="focus:outline-none bg-transparent w-full focus:bg-black focus:bg-opacity-10 focus:p-2 transition-all"
          {...props}
        ></textarea>
      ) : (
        <input
          className="focus:outline-none bg-transparent w-full focus:bg-black focus:bg-opacity-10 focus:p-2 transition-all"
          {...props}
        />
      )}
    </div>
  );
};

export default InputField;
