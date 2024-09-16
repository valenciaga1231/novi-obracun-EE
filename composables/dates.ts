/**
 * Converts an Excel serial date to a JavaScript Date object
 * @param excelDate Excel serial date number
 * @returns JavaScript Date object
 */
export const parseExcelDate = (excelDate: number) => {
    /**
     * Poda pravilni datum po slovenskem casu, ker gleda cas od zacetka stetja Excela
     * Explanation:
     * The serial number itself doesn't specify the time zone.
     * It's just a count of days and fractional days since a base date
     *
     * Zato je treba excelu odsteti 1 uro, ker se ne zaveda poletnega in zimskega casa
     * in tako dobimo podatke, ki so vsi zamaknjeni za 1 uro naprej.
     */

    // Excel's epoch starts on December 30, 1899
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(epoch.getTime() + excelDate * 86400000); // 1 is added due to different timezone in Slovenia

    const current_offset = date.getTimezoneOffset(); // Gets the time zone difference in minutes compared to UTC
    if (current_offset === -120) {
        date.setHours(date.getHours() - 2);
    } else if (current_offset === -60) {
        date.setHours(date.getHours() - 1);
    }

    return date;
};

/**
 * Funkcija, ki pretvori datum iz oblike 01.01.2021 v 2021-01-01
 * @param date_string Datum v obliki 01.01.2021
 * @returns Datum v obliki 2021-01-01
 */
export const convertDateFormat = (date_string: string): string => {
    const [day, month, year] = date_string.split(".");
    return `${year}-${month}-${day}`;
};

/**
 * Funkcija, ki preveri, ali sta dva datuma isti dan.
 * @param date1 Prvi datum
 * @param date2 Drugi datum
 * @returns Vrne true, ce sta datuma enaka, false sicer.
 */
export const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

const month_map = new Map<number, string>([
    [1, "Jan"],
    [2, "Feb"],
    [3, "Mar"],
    [4, "Apr"],
    [5, "Maj"],
    [6, "Jun"],
    [7, "Jul"],
    [8, "Avg"],
    [9, "Sep"],
    [10, "Okt"],
    [11, "Nov"],
    [12, "Dec"],
]);

export const getMonthAbbreviation = (number: number): string => {
    return month_map.get(number) || "";
};
