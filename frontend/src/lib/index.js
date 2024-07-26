export const FormatDateTime = (dateTimeString, format) => {
    const date = new Date(dateTimeString);
    const pad = (num) => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Months are zero-indexed in JavaScript
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    switch (format) {
        case 'dd-mm-yyyy hh:mm:ss':
            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        case 'mm-dd-yyyy hh:mm:ss':
            return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
        case 'yyyy-mm-dd hh:mm:ss':
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            case 'dd/mm/yyyy hh:mm:ss':
                return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
            case 'mm/dd/yyyy hh:mm:ss':
                return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
            case 'yyyy/mm/dd hh:mm:ss':
                return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        default:
            throw new Error('Invalid format');
    }
};