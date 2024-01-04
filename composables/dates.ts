import moment from "moment-timezone";

/**
 * Se uporablja, da pretvorimo serial date v Date object, ki pravilno kaze
 * cas v Sloveniji.
 *
 * @param serial Serial number of the date
 * @param timezone Timezone
 * @returns Return date in the specified timezone
 */
export const convertSerialDate = (serial: number, timezone: string) => {
    const origin_date = new Date(1899, 11, 30); // Excel's origin date: December 30, 1899
    const milliseconds_per_day = 24 * 60 * 60 * 1000;

    /**
     * Poda pravilni datum po slovenskem casu, ker gleda cas od zacetka stetja Excela
     ** Razlaga:
     * The serial number itself doesn't specify the time zone.
     * It's just a count of days and fractional days since a base date
     *
     * Zato je treba excelu odsteti 1 uro, ker se ne zaveda poletnega in zimskega casa
     * in tako dobimo podatke, ki so vsi zamaknjeni za 1 uro naprej.
     */
    //! Done with pure JS: problem, ker ce tam, ko JS laufa ni Slovenija, bo cas narobe
    const date = new Date(origin_date.getTime() + serial * milliseconds_per_day);
    const current_offset = date.getTimezoneOffset(); // Gets the time zone difference in minutes
    // If date is DST, subtract 1 hour
    if (current_offset === -120) date.setHours(date.getHours() - 1);
    // console.log(date); //! Dev

    return date;

    //! Done with moment.js:
    // Create moment date object
    const moment_date = moment(date).tz(timezone);

    // If date is DST, subtract 1 hour
    if (moment_date.isDST()) moment_date.subtract(1, "hour"); // Nastavi poletni cas

    return moment_date.toDate();
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
