import * as XLSX from "xlsx";
import { useExcelData, useTotalEnergyMT, useTotalEnergyVT } from "./stanja";
import moment from "moment-timezone";

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

                // Loop cez vse vrstice Excel podatkov. Za vsako vrstico:
                if (!useExcelData().value) useExcelData().value = []; // Initialize the array if it's undefined
                excel_data.map((row, id) => {
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

/**
 * Se uporablja, da pretvorimo serial date v Date object, ki pravilno kaze
 * cas v Sloveniji.
 *
 * @param serial Serial number of the date
 * @param timezone Timezone
 * @returns Return date in the specified timezone
 */
const convertSerialDate = (serial: number, timezone: string) => {
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
    console.log(date);

    return date;

    //! Done with moment.js:
    // Create moment date object
    const moment_date = moment(date).tz(timezone);

    // If date is DST, subtract 1 hour
    if (moment_date.isDST()) moment_date.subtract(1, "hour"); // Nastavi poletni cas

    return moment_date.toDate();
};

export const parseEnergyBlocks = () => {
    const excel_data = useExcelData();
    if (!excel_data.value) throw new Error("Excel data not initialized.");

    for (let i = 0; i < excel_data.value.length; i++) {
        const b = excel_data.value[i].blok;

        // Create the blok if it doesn't exist
        if (!useBlokData().value[b]) {
            useBlokData().value[b] = {
                energija: 0,
                cena_omreznine_energije: 0,
                cena_omreznine_moci: 0,
                presezna_moc: 0,
                cena_presezne_moci: 0,
                intervali_moc_presezena: 0,
                skupna_tarifa_moc: 0,
                skupna_tarifa_energija: 0,
                skupna_tarifa_presezna_moc: 0,
            };
        }
        useBlokData().value[b].energija += excel_data.value[i].W; // Pristej energijo pravilnemu bloku

        // Omreznina za energijo (to se ne rabi izvajati v loopu, bi lahko dali ven)
        useBlokData().value[b].cena_omreznine_energije += excel_data.value[i].W * (getTarifeData()[b].distribucija.tarifna_postavka_W + getTarifeData()[b].prenos.tarifna_postavka_W);
    }

    // Izracun skupne energije
    useTotalEnergy().value = 0;
    for (const blok in useBlokData().value) useTotalEnergy().value += useBlokData().value[blok].energija;

    // Izracun cena_omreznine_moci
    izracunajOmrezninoMoci();
    izracunajPreseznoMoc();
    izracunajCenoPresezneMoci();

    // Dolocimo prispevke
    dolociPrispevke();

    // Dolocimo energijo v VT in MT
    dolociEnergijoVTinMT();
    dolociTarifeZaBlok();
};

export const izracunajOmrezninoMoci = () => {
    // Izracunamo omreznino za moc
    for (const blok in useBlokData().value) {
        const id = parseInt(blok) - 1; // Convert string to number and to index
        useBlokData().value[blok].cena_omreznine_moci = usePrikljucnaMoc().value[id] * (getTarifeData()[blok].distribucija.tarifna_postavka_P + getTarifeData()[blok].prenos.tarifna_postavka_P);
    }
};

export const dolociPrispevke = () => {
    usePrispevki().value.operater_trga.price = useTotalEnergy().value * usePrispevki().value.operater_trga.price_per_unit;
    usePrispevki().value.energetsko_ucinkovitost.price = useTotalEnergy().value * usePrispevki().value.energetsko_ucinkovitost.price_per_unit;
    usePrispevki().value.spte_ove.price = usePrikljucnaMocStara().value * usePrispevki().value.spte_ove.price_per_unit;
};

/**
 * Doloci energijo v visoki in nizki tarifi.
 */
export const dolociEnergijoVTinMT = () => {
    // Dolocimo kolicino energije v MT in VT
    useExcelData().value.map((row) => {
        const is_VT = row.is_VT;
        if (is_VT) useTotalEnergyVT().value.amount += row.W;
        else useTotalEnergyMT().value.amount += row.W;
    });

    // Dolocimo se ceno, glede na zaokrozeno vrednost, kot na poloznici.
    const VT_zaokrozeno = Math.round(useTotalEnergyVT().value.amount);
    const MT_zaokrozeno = Math.round(useTotalEnergyMT().value.amount);
    useTotalEnergyVT().value.price = VT_zaokrozeno * useSettings().value.vrednosti_tarif.VT;
    useTotalEnergyMT().value.price = MT_zaokrozeno * useSettings().value.vrednosti_tarif.MT;
};

/**
 * Funkcija, ki preveri, ali je trenutni timestamp v VT ali MT tarifi.
 * Uposteva:
 * - cas v dnevu (6:00 - 22:00 VT, 22:00 - 6:00 MT)
 * - vikende (00:00 - 24:00 MT)
 * - dela proste dneve (00:00 - 24:00 MT)
 *
 * @param datum Datum, ki je 15 min zamaknjen nazaj glede na pravi cas.
 * @returns
 */
const isTarifVT = (datum: Date) => {
    let is_VT = false;

    // Check if hour MT or VT
    const hour = datum.getHours();
    is_VT = hour >= 6 && hour < 22;

    // Check if weekend
    if (datum.getDay() === 6 || datum.getDay() === 0) is_VT = false;

    // Check if work free day, as on wokr free dat VT is not active
    const prazniki = holidays;
    prazniki.map((praznik): void => {
        const praznik_datum = new Date(convertDateFormat(praznik.date));
        if (praznik.work_free_day === "da" && isSameDay(praznik_datum, datum)) is_VT = false;
    });

    return is_VT;
};

/**
 * Funkcija, ki pretvori datum iz oblike 01.01.2021 v 2021-01-01
 * @param date_string Datum v obliki 01.01.2021
 * @returns Datum v obliki 2021-01-01
 */
const convertDateFormat = (date_string: string): string => {
    const [day, month, year] = date_string.split(".");
    return `${year}-${month}-${day}`;
};

/**
 * Funkcija, ki preveri, ali sta dva datuma isti dan.
 * @param date1 Prvi datum
 * @param date2 Drugi datum
 * @returns Vrne true, ce sta datuma enaka, false sicer.
 */
const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

/**
 * @returns Vrne vse omreznine za vse bloke
 */
export const sestejVsoOmreznino = () => {
    const vsi_bloki = useBlokData().value;
    let celotna_omreznina = 0;
    for (const blok in vsi_bloki) celotna_omreznina += vsi_bloki[blok].cena_omreznine_energije + vsi_bloki[blok].cena_omreznine_moci + vsi_bloki[blok].cena_presezne_moci;
    return celotna_omreznina;
};

/**
 * Izracuna presezno moc za vsak blok in jo shrani v useBlokData()
 */
export const izracunajPreseznoMoc = () => {
    const excel_data = useExcelData();
    if (!excel_data.value) throw new Error("Excel data not initialized.");

    // Reset presezna moc and intervali presezna moc
    for (const blok in useBlokData().value) {
        useBlokData().value[blok].presezna_moc = 0;
        useBlokData().value[blok].intervali_moc_presezena = 0;
    }

    // 1. Pogledamo moc, ki je presezena za vsak interval. Torej for loop in sestevamo v spremenljivko
    for (let i = 0; i < excel_data.value.length; i++) {
        const b = excel_data.value[i].blok;

        // Pogledamo ali moc presega obracunsko moc za blok v katerem je trenutni interval
        const presezna_moc = excel_data.value[i].P - usePrikljucnaMoc().value[b - 1];

        if (presezna_moc > 0) {
            // Presezna moc je pozitivna, torej jo pristejemo vrednosti v bloku po formuli
            useBlokData().value[b].presezna_moc += presezna_moc * presezna_moc;

            // Stejemo koliko intervalov je moc presegla obracunsko vrednost
            useBlokData().value[b].intervali_moc_presezena++;
        }
    }

    // Za vsak blok se koreni vsoto kvadratov presezne moci, da dobimo koncko vrednost presezne moci za blok
    for (const blok in useBlokData().value) {
        useBlokData().value[blok].presezna_moc = Math.sqrt(useBlokData().value[blok].presezna_moc);
    }
};

/**
 * Izracuna ceno presezne moci za vsak blok in jo shrani v useBlokData()
 */
export const izracunajCenoPresezneMoci = () => {
    const faktor_presezne_moci = 0.9; // TODO: Dodaj v nastavitve

    // Izracunamo ceno presezne moci
    for (const blok in useBlokData().value) {
        useBlokData().value[blok].cena_presezne_moci = useBlokData().value[blok].presezna_moc * (getTarifeData()[blok].distribucija.tarifna_postavka_P + getTarifeData()[blok].prenos.tarifna_postavka_P) * faktor_presezne_moci;
    }
};

/**
 * Doloci tarife za vsak blok
 */
export const dolociTarifeZaBlok = () => {
    for (const blok in useBlokData().value) {
        const id = parseInt(blok) - 1; // Convert string to number and to index
        // doloci skupno_tarifo za moc za vsak blok
        useBlokData().value[blok].skupna_tarifa_moc = getTarifeData()[blok].distribucija.tarifna_postavka_P + getTarifeData()[blok].prenos.tarifna_postavka_P;
        useBlokData().value[blok].skupna_tarifa_energija = getTarifeData()[blok].distribucija.tarifna_postavka_W + getTarifeData()[blok].prenos.tarifna_postavka_W;
        useBlokData().value[blok].skupna_tarifa_presezna_moc = useBlokData().value[blok].skupna_tarifa_moc * 0.9;
    }
};

/**
 * Vrne ceno vseh prispevkov.
 */
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

/**
 * Vrne ceno vseh stroskov na racunu, brez DDV.
 */
export const sumAllCosts = () => {
    return sestejVsoOmreznino() + sestejVsePrispevke() + useTotalEnergyVT().value.price + useTotalEnergyMT().value.price;
};
