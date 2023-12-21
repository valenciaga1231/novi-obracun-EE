import * as XLSX from "xlsx";
import { useExcelData, useTotalEnergyMT, useTotalEnergyVT } from "./stanja";

// TODO: Move this to a separate file
const json = `{
    "1": {
        "prenos": {
            "tarifna_postavka_P": 0.24923,
            "tarifna_postavka_W": 0.00663
        },
        "distribucija": {
            "tarifna_postavka_P": 3.36401,
            "tarifna_postavka_W": 0.01295
        }
    },
    "2": {
        "prenos": {
            "tarifna_postavka_P": 0.04877,
            "tarifna_postavka_W": 0.00620
        },
        "distribucija": {
            "tarifna_postavka_P": 0.83363,
            "tarifna_postavka_W": 0.01224
        }
    },
    "3": {
        "prenos": {
            "tarifna_postavka_P": 0.01103,
            "tarifna_postavka_W": 0.00589
        },
        "distribucija": {
            "tarifna_postavka_P": 0.18034,
            "tarifna_postavka_W": 0.01248
        }
    },
    "4": {
        "prenos": {
            "tarifna_postavka_P": 0.00038,
            "tarifna_postavka_W": 0.00592
        },
        "distribucija": {
            "tarifna_postavka_P": 0.01278,
            "tarifna_postavka_W": 0.01246
        }
    },
    "5": {
        "prenos": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.00589
        },
        "distribucija": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.01258
        }
    }
}`;

/**
 * Parses the uploaded document and saves the data to the states.
 * @param file File to be parsed
 */
export const useUploadDocument = async (file: File) => {
    const reader = new FileReader(); // Init file reader

    // Create a promise to wait for the onload event to complete
    const onloadPromise = new Promise<void>((resolve, reject) => {
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

                // Save all data to states
                const timestamp_index = header.indexOf("Časovna značka");
                const W_index = header.indexOf("Energija A+");
                const blok_index = header.indexOf("Blok");
                const P_index = header.indexOf("P+ Prejeta delovna moč");

                // TODO: Change date to Date
                // Loop cez vse vrstice Excel podatkov. Za vsako vrstico:
                if (!useExcelData().value) useExcelData().value = []; // Initialize the array if it's undefined
                excel_data.map((row, id) => {
                    useExcelData().value[id] = {
                        timestamp: convertExcelDate(row[timestamp_index]),
                        blok: row[blok_index],
                        W: row[W_index],
                        P: row[P_index],
                    };
                });

                // Resolve the promise to indicate that the onload event has completed
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
    await onloadPromise;
};

export const parseEnergyBlocks = () => {
    const excel_data = useExcelData();
    if (!excel_data.value) throw new Error("Excel data not initialized.");
    const tarife_data = JSON.parse(json); // Get tarif data

    for (let i = 0; i < excel_data.value.length; i++) {
        const b = excel_data.value[i].blok;

        // Create the blok if it doesn't exist
        if (!useBlokData().value[b]) {
            useBlokData().value[b] = {
                energija: 0,
                cena_omreznine_energije: 0,
                cena_omreznine_moci: 0,
            };
        }
        useBlokData().value[b].energija += excel_data.value[i].W; // Pristej energijo pravilnemu bloku

        // Omreznina za energijo (to se ne rabi izvajati v loopu, bi lahko dali ven)
        useBlokData().value[b].cena_omreznine_energije += excel_data.value[i].W * (tarife_data[b].distribucija.tarifna_postavka_W + tarife_data[b].prenos.tarifna_postavka_W);
    }

    // Izracun cena_omreznine_moci
    izracunajOmrezninoMoci();

    // Izracun skupne energije
    for (const blok in useBlokData().value) useTotalEnergy().value += useBlokData().value[blok].energija;

    console.log("Blok data:"); //! Dev
    console.log(useBlokData().value); //! Dev
};

export const izracunajOmrezninoMoci = () => {
    const tarife_data = JSON.parse(json); // Get tarif data

    // Izracunamo omreznino za moc
    for (const blok in useBlokData().value) {
        const id = parseInt(blok) - 1; // Convert string to number and to index
        useBlokData().value[blok].cena_omreznine_moci = usePrikljucnaMoc().value[id] * (tarife_data[blok].distribucija.tarifna_postavka_P + tarife_data[blok].prenos.tarifna_postavka_P);
    }
};

export const dolociPrispevke = () => {
    usePrispevki().value.operater_trga.price = useTotalEnergy().value * usePrispevki().value.operater_trga.price_per_unit;
    usePrispevki().value.energetsko_ucinkovitost.price = useTotalEnergy().value * usePrispevki().value.energetsko_ucinkovitost.price_per_unit;
    usePrispevki().value.spte_ove.price = usePrikljucnaMocStara().value * usePrispevki().value.spte_ove.price_per_unit;
};

/**
 * Doloci energijo v visoki in nizki tarifi.
 * TODO: Dodaj dela proste dni!!!
 */
export const dolociEnergijoVTinMT = () => {
    // Dolocimo kolicino energije
    useExcelData().value.map((row) => {
        const is_VT = isTarifVT(row.timestamp);
        if (is_VT) useTotalEnergyVT().value.amount += row.W;
        else useTotalEnergyMT().value.amount += row.W;
    });

    // Dolocimo se ceno
    useTotalEnergyVT().value.price = useTotalEnergyVT().value.amount * 0.118;
    useTotalEnergyMT().value.price = useTotalEnergyMT().value.amount * 0.082;
};

/**
 * Will convert excel serial date to JS Date.
 * @param serial
 * @returns JS Date
 */
const convertExcelDate = (serial: number): Date => {
    const excelEpoch = new Date(1899, 11, 31);
    const excelEpochAsUnixTimestamp = excelEpoch.getTime();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const excelDateAsUnixTimestamp = (serial - 1) * millisecondsPerDay;

    let jsDate = new Date(excelEpochAsUnixTimestamp + excelDateAsUnixTimestamp);
    jsDate.setHours(jsDate.getHours() + 1); // Zaradi razlike z UTC
    jsDate.setMinutes(jsDate.getMinutes() - 15); // Pac zaradi taksnega upostevanja intervalov
    return jsDate;
};
/**
 * TODO: Dodati je treba se presezno moc.
 * @returns Vrne vse omreznine za vse bloke
 */
export const sestejVsoOmreznino = () => {
    let celotna_omreznina = 0;
    for (const blok in useBlokData().value) celotna_omreznina += useBlokData().value[blok].cena_omreznine_energije + useBlokData().value[blok].cena_omreznine_moci;
    return celotna_omreznina;
};

export const sestejVsePrispevke = () => {
    let celotni_prispevki = 0;
    for (const prispevek in usePrispevki().value) {
        //@ts-ignore
        if (usePrispevki().value[prispevek].is_active) {
            //@ts-ignore
            celotni_prispevki += usePrispevki().value[prispevek].price || 0;
        }
    }
    return celotni_prispevki;
};

export const sumAllCosts = () => {
    return sestejVsoOmreznino() + sestejVsePrispevke() + useTotalEnergyVT().value.price + useTotalEnergyMT().value.price;
};

const isTarifVT = (datum: Date) => {
    let is_VT = false;
    let hour = datum.getUTCHours();

    // Check if hour MT or VT
    is_VT = hour >= 6 && hour < 22;

    // Check if weekend
    if (datum.getDay() === 6 || datum.getDay() === 0) is_VT = false;

    return is_VT;
};
