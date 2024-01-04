import * as XLSX from "xlsx";

/**
 * Parses the uploaded document and saves the Excel data
 * to state
 *
 * TODO: Add .csv file support
 * @param file File to be parsed
 */
export const parseDocumentData = async (file: File) => {
    const reader = new FileReader(); // Init file reader

    // Create a promise to wait for the onload event to complete
    const on_load_promise = new Promise<void>((resolve, reject) => {
        // On file load event
        reader.onload = (event: Event) => {
            try {
                const data = (event.target as FileReader).result; // Get file
                const workbook = XLSX.read(data as string, { type: "binary" });
                const sheets_name_list = workbook.SheetNames; // Get sheet names
                const worksheet = workbook.Sheets[sheets_name_list[0]]; // Set first sheet as active

                // Parse data to object
                const excel_data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert worksheet to array of arrays
                const header = excel_data.shift();
                if (!header) throw new Error("No header found in Excel table.");

                // Get all required headers index
                const timestamp_index = header.indexOf("Časovna značka");
                const W_index = header.indexOf("Energija A+");
                const blok_index = header.indexOf("Blok");
                const P_index = header.indexOf("P+ Prejeta delovna moč");

                useExcelData().value = []; // Initialize or reset array

                // Loop cez vse vrstice Excel podatkov.
                excel_data.map((row, id) => {
                    // Za vsako vrstico:
                    const date = convertSerialDate(row[timestamp_index], "Europe/Ljubljana");
                    const tarife_date = convertSerialDate(row[timestamp_index], "Europe/Ljubljana");
                    /**
                     * Odsteti moramo 15min, ker na MojElektro pac v timestamp 12:00:00 AM oz. 00:00:00,
                     * se v prejsnjem dnevu, ker smo do takrat porabili toliko energije.
                     */
                    tarife_date.setMinutes(tarife_date.getMinutes() - 15);

                    useExcelData().value[id] = {
                        blok: row[blok_index],
                        W: row[W_index],
                        P: row[P_index],
                        is_VT: isTarifVT(tarife_date),
                        date: date,
                    };
                });

                // Get first and last date from excel data
                useSettings().value.date.start = useExcelData().value[0].date;
                useSettings().value.date.end = useExcelData().value[useExcelData().value.length - 2].date;

                // Resolve the promise as file should have been succesfully readed
                resolve();
            } catch (error) {
                // Reject the promise if there's an error
                reject(error);
            }
        };
    });

    // To actually read the file
    reader.readAsBinaryString(file);

    // Wait for the onload event to complete beforecontinuing
    await on_load_promise;
};
