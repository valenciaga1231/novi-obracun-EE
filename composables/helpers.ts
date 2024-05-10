import { type ExcelRow } from "~/types";

/**
 * TODO: Should be called for each month separately
 */
export const parseEnergyBlocks = () => {
    const months_data = useMonthsArray();

    const excel_data = useExcelData();
    if (!excel_data.value) throw new Error("Excel data not initialized.");

    for (let i = 0; i < excel_data.value.length; i++) {
        // get month from JS Date object
        const date = new Date(excel_data.value[i].date);
        date.setMinutes(date.getMinutes() - 15);
        const month = date.getMonth() + 1; // As months start from 0

        // Check if current month already exists in useMonthsArray
        if (!useMonthsArray().value[month]) {
            useMonthsArray().value[month] = {
                month: month,
                active_blocks: [0, 0, 0, 0, 0],
                blok_data: initDefaultBlokData(),
                prispevki: usePrispevki().value,
                total_energy: 0,
                vt_energy: 0,
                mt_energy: 0,
                data_rows: [],
                total_sum: 0,
                total_sum_DDV: 0,
                total_sum_old: 0,
                total_sum_old_DDV: 0,
            };
        }

        const b = excel_data.value[i].blok;
        months_data.value[month].blok_data[b].energija += excel_data.value[i].W; // Pristej energijo pravilnemu bloku

        // TODO: Omreznina za energijo (to se ne rabi izvajati v loopu, bi lahko dali ven)
        months_data.value[month].blok_data[b].cena_omreznine_energije += excel_data.value[i].W * (getTarifeData()[b].distribucija.tarifna_postavka_W + getTarifeData()[b].prenos.tarifna_postavka_W);

        // Add row to data_rows
        months_data.value[month].data_rows.push(excel_data.value[i]);
    }

    // Assign properties for all months
    for (const month in useMonthsArray().value) {
        // Pogledamo kateri bloki so aktivni
        const aktivni_bloki = new Set(); // Naredi Set, ali [1, 2, 3, 4] ali [2, 3, 4, 5]
        months_data.value[month].data_rows.map((row: ExcelRow) => aktivni_bloki.add(row.blok));

        for (const blok in useBlokData().value) {
            months_data.value[month].blok_data[blok].is_active = aktivni_bloki.has(parseInt(blok));
            months_data.value[month].active_blocks[parseInt(blok) - 1] = aktivni_bloki.has(parseInt(blok)) ? 1 : 0;
        }

        dolociTarifeZaBlok(parseInt(month));

        // Izracun skupne energije v mesecu
        months_data.value[month].total_energy = 0;
        months_data.value[month].total_energy = months_data.value[month].data_rows.reduce((total, row) => total + row.W, 0);

        // Izracunaj energijo za vsak blok
        for (const blok in useBlokData().value) {
            months_data.value[month].blok_data[blok].energija = months_data.value[month].data_rows.reduce((skupna_energija, row) => {
                if (row.blok === parseInt(blok)) return skupna_energija + row.W;
                else return skupna_energija;
            }, 0);
        }

        // Izracun VT in MT energije // TODO: daj v funkcijo
        months_data.value[month].vt_energy = 0;
        months_data.value[month].mt_energy = 0;
        for (const row of months_data.value[month].data_rows) {
            if (row.is_VT) months_data.value[month].vt_energy += row.W;
            else months_data.value[month].mt_energy += row.W;
        }

        // Izracun cena_omreznine_moci
        const month_int = parseInt(month);
        izracunajOmrezninoMoci(month_int);
        izracunajPreseznoMoc(month_int);

        // Get month expenses
        const month_expenses = sumMonthCosts(month_int);
        months_data.value[month].total_sum = month_expenses;
        months_data.value[month].total_sum_DDV = month_expenses * 1.22;

        const month_expenses_old = sumMonthCostsOld(month_int);
        months_data.value[month].total_sum_old = month_expenses_old;
        months_data.value[month].total_sum_old_DDV = month_expenses_old * 1.22;
    }
    // console.log("useMonthsArray", useMonthsArray().value); //! Dev

    // Dolocimo energijo v VT in MT
    dolociEnergijoVTinMT();
};

/**
 * Funkcija, ki se klice ob spremembi prikljucne moci, kjer je potrebno posodobiti
 * nove omreznine za moci, izracun preseznih moci in celotne mesecne stroske.
 */
export const updatedPrikljucnaMoc = () => {
    const startTime = performance.now();

    for (const month in useMonthsArray().value) {
        const month_int = parseInt(month);

        // Calculate network fee and excess power
        izracunajOmrezninoMoci(month_int);
        izracunajPreseznoMoc(month_int); //! Glede na meritve pobere ta funkcija 99% casa. Na voljo je se nekaj optimizacij

        // Update total month expenses
        const month_expenses = sumMonthCosts(month_int);
        useMonthsArray().value[month].total_sum = month_expenses;
        useMonthsArray().value[month].total_sum_DDV = month_expenses * 1.22;
    }
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time updatedPrikljucnaMoc: ${executionTime} milliseconds`); //! Dev
};

/**
 * Funkcija izracuna ceno omreznine moci in jo zapise v objekt meseca
 * za katerega use racuna.
 *
 * @param month Mesec za katerega se racuna omreznino
 */
export const izracunajOmrezninoMoci = (month?: number) => {
    const months = useMonthsArray();
    if (!months.value) throw new Error("Months data not initialized.");
    // Update month blok data
    //@ts-ignore
    for (const blok in months.value[month].blok_data) {
        const id = parseInt(blok) - 1; // Convert string to number and to index
        //@ts-ignore
        months.value[month].blok_data[blok].cena_omreznine_moci = usePrikljucnaMoc().value[id] * (getTarifeData()[blok].distribucija.tarifna_postavka_P + getTarifeData()[blok].prenos.tarifna_postavka_P);
    }
};

/**
 * Doloci energijo v visoki in nizki tarifi.
 */
export const dolociEnergijoVTinMT = () => {
    // Reset energije
    useTotalEnergyVT().value = 0;
    useTotalEnergyMT().value = 0;

    // Dolocimo kolicino energije v MT in VT
    useExcelData().value.map((row) => {
        const is_VT = row.is_VT;
        if (is_VT) useTotalEnergyVT().value += row.W;
        else useTotalEnergyMT().value += row.W;
    });
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
export const isTarifVT = (datum: Date) => {
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
 * @returns Vrne ceno celotne omreznine za mesec (ceno omreznine energije + moci)
 */
export const sestejVsoOmreznino = (month: number) => {
    const months = useMonthsArray().value;
    if (!months) throw new Error("Months data not initialized.");

    let celotna_omreznina = 0;
    for (const blok in months[month].blok_data) {
        if (!months[month].blok_data[blok].is_active) continue;
        celotna_omreznina += months[month].blok_data[blok].cena_omreznine_energije + months[month].blok_data[blok].cena_omreznine_moci + months[month].blok_data[blok].cena_presezne_moci;
    }
    return celotna_omreznina;
};

/**
 * Izracuna presezno moc za vsak blok v definiranem mesecu in jo shrani
 * v mesec objekt.
 */
export const izracunajPreseznoMoc = (month: number) => {
    const excel_data = useExcelData();
    if (!excel_data.value) throw new Error("Excel data not initialized.");

    const months = useMonthsArray();

    // Reset presezna moc and intervali presezna moc
    for (const blok in months.value[month].blok_data) {
        months.value[month].blok_data[blok].presezna_moc = 0;
        months.value[month].blok_data[blok].intervali_moc_presezena = 0;
    }
    const prikljucna_moc = usePrikljucnaMoc().value;

    // 1. Pogledamo moc, ki je presezena za vsak interval. Torej for loop in sestevamo v spremenljivko
    for (let i = 0; i < months.value[month].data_rows.length; i++) {
        const b = months.value[month].data_rows[i].blok;

        // Pogledamo ali moc presega obracunsko moc za blok v katerem je trenutni interval
        const presezna_moc = months.value[month].data_rows[i].P - prikljucna_moc[b - 1];

        if (presezna_moc > 0) {
            // Presezna moc je pozitivna, torej jo pristejemo vrednosti v bloku po formuli
            months.value[month].blok_data[b].presezna_moc += presezna_moc * presezna_moc;

            // Stejemo koliko intervalov je moc presegla obracunsko vrednost
            months.value[month].blok_data[b].intervali_moc_presezena++;
        }
    }

    // Za vsak blok se koreni vsoto kvadratov presezne moci, da dobimo koncko vrednost presezne moci za blok
    for (const blok in useBlokData().value) {
        months.value[month].blok_data[blok].presezna_moc = Math.sqrt(months.value[month].blok_data[blok].presezna_moc);
    }

    // Izracunamo se ceno presezne moci
    const faktor_presezne_moci = 0.9; // TODO: Dodaj v nastavitve

    // Izracunamo ceno presezne moci
    for (const [month_key, month_value] of Object.entries(months.value[month].blok_data)) {
        month_value.cena_presezne_moci = month_value.presezna_moc * (getTarifeData()[month_key].distribucija.tarifna_postavka_P + getTarifeData()[month_key].prenos.tarifna_postavka_P) * faktor_presezne_moci;
    }
};

/**
 * Doloci tarife za vsak blok v mesecu. Torej sesteje omreznino za prenos in distribucijo
 * ter jih nato shrani v objekt meseca.
 */
export const dolociTarifeZaBlok = (month: number) => {
    const months = useMonthsArray();

    for (const blok in months.value[month].blok_data) {
        // doloci skupno_tarifo za moc za vsak blok
        months.value[month].blok_data[blok].skupna_tarifa_moc = getTarifeData()[blok].distribucija.tarifna_postavka_P + getTarifeData()[blok].prenos.tarifna_postavka_P;
        months.value[month].blok_data[blok].skupna_tarifa_energija = getTarifeData()[blok].distribucija.tarifna_postavka_W + getTarifeData()[blok].prenos.tarifna_postavka_W;
        months.value[month].blok_data[blok].skupna_tarifa_presezna_moc = useBlokData().value[blok].skupna_tarifa_moc * 0.9;
    }
};

/**
 * Vrne ceno vseh prispevkov za mesec.
 */
export const sestejVsePrispevke = (month: number) => {
    const months = useMonthsArray().value;

    const te = Math.round(months[month].total_energy); // Total month energy

    months[month].prispevki.operater_trga.price = te * months[month].prispevki.operater_trga.price_per_unit;
    months[month].prispevki.energetsko_ucinkovitost.price = te * months[month].prispevki.energetsko_ucinkovitost.price_per_unit;
    months[month].prispevki.spte_ove.price = usePrikljucnaMocStara().value * months[month].prispevki.spte_ove.price_per_unit;
    months[month].prispevki.trosarina.price = te * months[month].prispevki.trosarina.price_per_unit;

    let celotni_prispevki = 0;
    for (const prispevek in months[month].prispevki) {
        // @ts-ignore
        if (months[month].prispevki[prispevek].is_active) celotni_prispevki += months[month].prispevki[prispevek].price || 0;
    }
    return celotni_prispevki;
};

/**
 * Vrne ceno vseh stroskov na NOVEM racunu za definiran mesec, brez DDV.
 */
export const sumMonthCosts = (month: number): number => {
    const months = useMonthsArray().value;

    const omreznina = sestejVsoOmreznino(month);

    const prispevki = sestejVsePrispevke(month);

    let energija = 0;
    if (useSettings().value.tip_starega_obracuna === "VT+MT") {
        energija = months[month].vt_energy * useSettings().value.vrednosti_tarif.VT + months[month].mt_energy * useSettings().value.vrednosti_tarif.MT;
    } else if (useSettings().value.tip_starega_obracuna === "ET") {
        energija = months[month].total_energy * useSettings().value.vrednosti_tarif.ET;
    } else {
        throw new Error("Neveljaven tip starega obracuna: " + useSettings().value.tip_starega_obracuna);
    }

    return omreznina + prispevki + energija;
};

/**
 * Vrne ceno vseh stroskov na STAREM racunu za definiran mesec, brez DDV.
 */
export const sumMonthCostsOld = (month: number) => {
    const months = useMonthsArray().value;

    const omreznina_moc = usePrikljucnaMocStara().value * 0.77417; // Calculate network fee for old billing
    const prispevki = sestejVsePrispevke(month);

    let energija = 0;
    let omreznina_energija = 0;

    if (useSettings().value.tip_starega_obracuna === "VT+MT") {
        energija = months[month].vt_energy * useSettings().value.vrednosti_tarif.VT + months[month].mt_energy * useSettings().value.vrednosti_tarif.MT;
        omreznina_energija = months[month].vt_energy * 0.04182 + months[month].mt_energy * 0.03215;
    } else if (useSettings().value.tip_starega_obracuna === "ET") {
        energija = months[month].total_energy * useSettings().value.vrednosti_tarif.ET;
        omreznina_energija = months[month].total_energy * 0.03215; //TODO: Pogledati je treba ceno omreznine energije za ET
    } else {
        throw new Error("Neveljaven tip starega obracuna: " + useSettings().value.tip_starega_obracuna);
    }
    return omreznina_moc + omreznina_energija + prispevki + energija;
};
