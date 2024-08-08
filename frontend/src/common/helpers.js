export const filterUndefinedAndNull = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  );
};

export const FormatDateTime = (dateTimeString, format) => {
  const date = new Date(dateTimeString);
  const pad = (num) => num.toString().padStart(2, "0");

  const replacements = {
    dd: pad(date.getDate()),
    mm: pad(date.getMonth() + 1),
    yyyy: date.getFullYear(),
    hh: pad(date.getHours()),
    MM: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  const formattedDate = format.replace(/dd|mm|yyyy|hh|MM|ss/g, (match) => replacements[match]);

  return formattedDate;
};
