export const Button = ({
  variant,
  disabled = false,
  onClick,
  className,
  children,
}) => {
  let btnStyle = "font-bold py-2 px-4 rounded transition-all ";
  if (disabled) {
    btnStyle = btnStyle.concat("text-white bg-gray-500 ");
  } else {
    switch (variant) {
      case "red":
        btnStyle = btnStyle.concat("bg-red-500 hover:bg-red-700 text-white ");
        break;
      case "green":
        btnStyle = btnStyle.concat("bg-green-500 hover:bg-green-700 text-white ");
        break;
      case "black":
        btnStyle = btnStyle.concat("bg-black hover:opacity-70 text-white ");
        break;
      default:
        btnStyle = btnStyle.concat("text-black bg-white hover:text-white hover:bg-black");
        break;
    }
  }
  btnStyle = btnStyle.concat(className || "");
  const props = { disabled, onClick, children };

  return <button className={btnStyle} {...props}></button>;
};
