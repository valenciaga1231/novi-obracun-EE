import * as XLSX from "xlsx";

/**
 * Parses the uploaded document and saves the Excel data
 * to state.
 *
 * TODO: Add .csv file support
 * @param file File to be parsed
 */
export const parseDocumentData = async (file: File) => {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Read the workbook from the ArrayBuffer
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];

    // Convert worksheet to array of arrays
    const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const header = excelData.shift();
    if (!header) throw new Error("No header found in Excel table.");

    // Get indices of required headers
    const timestampIndex = header.indexOf("Časovna značka");
    const wIndex = header.indexOf("Energija A+");
    const blokIndex = header.indexOf("Blok");
    const pIndex = header.indexOf("P+ Prejeta delovna moč");

    useExcelData().value = []; // Initialize or reset array

    // Loop through all rows of Excel data
    for (let id = 0; id < excelData.length - 1; id++) {
        const row = excelData[id];

        // For each row:
        const dateCell = row[timestampIndex];

        // Parse the date
        let date: Date;
        if (typeof dateCell === "number") {
            date = parseExcelDate(dateCell);
        } else if (typeof dateCell === "string") {
            date = new Date(dateCell);
        } else {
            throw new Error("Invalid date format in Excel data.");
        }

        const tariffDate = new Date(date.getTime() - 15 * 60 * 1000); // Tariff is 15 minutes before the date
        useExcelData().value[id] = {
            blok: row[blokIndex],
            W: row[wIndex],
            P: row[pIndex],
            is_VT: isTarifVT(tariffDate),
            date: date,
        };
    }

    // Get first and last date from excel data
    if (useExcelData().value.length > 0) {
        useSettings().value.date.start = useExcelData().value[0].date;

        // Subtract 15 minutes from the last date so it does not include the next tariff
        const endDate = useExcelData().value[useExcelData().value.length - 1].date;
        useSettings().value.date.end = new Date(endDate.getTime() - 15 * 60 * 1000);
    } else {
        throw new Error("No data parsed from Excel file.");
    }
};
