/**
 * TODO: Should be called for each month separately
 */
export const parseEnergyBlocks = () => {
    const monthsData = useMonthsArray();
    const excelData = useExcelData();
    if (!excelData.value) throw new Error("Excel data not initialized.");

    const tarifeData = getTarifeData(useSettings().value.user_group.code);
    const prispevki = usePrispevki().value;

    // First pass: Aggregate data per month and block
    for (const row of excelData.value) {
        // Adjust date and extract month (1-based index)
        const date = new Date(row.date);
        date.setMinutes(date.getMinutes() - 15);
        const month = date.getMonth() + 1;

        // Initialize month data if it doesn't exist
        if (!monthsData.value[month]) {
            monthsData.value[month] = {
                month,
                active_blocks: [0, 0, 0, 0, 0], // Blocks 1 to 5
                blok_data: initDefaultBlokData(),
                prispevki,
                total_energy: 0,
                vt_energy: 0,
                mt_energy: 0,
                data_rows: [],
                total_sum: 0,
                total_sum_DDV: 0,
                total_sum_old: 0,
                total_sum_old_DDV: 0,
                date: {
                    start: null,
                    end: null,
                },
            };
        }

        const monthData = monthsData.value[month];
        const block = row.blok;

        // Update total energy
        monthData.total_energy += row.W;

        // Update VT and MT energy
        if (row.is_VT) {
            monthData.vt_energy += row.W;
        } else {
            monthData.mt_energy += row.W;
        }

        // Update block data
        const blockData = monthData.blok_data[block];
        blockData.energija += row.W;
        blockData.is_active = true; // Mark block as active if data row with this block exists

        // Mark block as active
        monthData.active_blocks[block - 1] = 1;

        // Update network fee for energy
        const tarifnaPostavkaW = tarifeData[block].distribucija.tarifna_postavka_W + tarifeData[block].prenos.tarifna_postavka_W;
        blockData.cena_omreznine_energije += row.W * tarifnaPostavkaW;

        // Add row to data_rows
        monthData.data_rows.push(row);
    }

    // Second pass: Compute per-month summaries
    Object.values(monthsData.value).forEach((monthData) => {
        const monthInt = monthData.month;

        // Determine tariffs for blocks
        dolociTarifeZaBlok(monthInt);

        // Calculate network fee and excess power
        izracunajOmrezninoMoci(monthInt);
        izracunajPreseznoMoc(monthInt);

        // Calculate monthly expenses
        const monthExpenses = sumMonthCosts(monthInt);
        monthData.total_sum = monthExpenses;
        monthData.total_sum_DDV = monthExpenses * 1.22;

        const monthExpensesOld = sumMonthCostsOld(monthInt);
        monthData.total_sum_old = monthExpensesOld;
        monthData.total_sum_old_DDV = monthExpensesOld * 1.22;
    });

    // Final adjustments
    dolociEnergijoVTinMT();
    setMonthDates();
};

/**
 * Sets the start and end date for each month based on the first and last row in the month's data.
 */
export const setMonthDates = () => {
    const months_data = useMonthsArray();
    const excel_data = useExcelData();
    if (!excel_data.value) throw new Error("Excel data not initialized.");

    for (const month in months_data.value) {
        const monthData = months_data.value[month];
        const dataRows = monthData.data_rows;

        if (dataRows.length > 0) {
            const startDate = new Date(dataRows[0].date);
            const endDate = new Date(dataRows[dataRows.length - 1].date);
            endDate.setMinutes(endDate.getMinutes() - 15);

            monthData.date.start = startDate;
            monthData.date.end = endDate;
        }
    }
};

/**
 * Funkcija, ki se klice ob spremembi prikljucne moci, kjer je potrebno posodobiti
 * nove omreznine za moci, izracun preseznih moci in celotne mesecne stroske.
 */
export const updatedPrikljucnaMoc = () => {
    const startTime = performance.now();

    // Update prices for PrikljucnaMocForm.vue
    const tarife = getTarifeData(useSettings().value.user_group.code);
    const blok_price_data = usePrikljucnaMocPrices().value;
    for (let i = 0; i < blok_price_data.length; i++) {
        const skupna_tarifna_moc = tarife[i + 1].prenos.tarifna_postavka_P + tarife[i + 1].distribucija.tarifna_postavka_P;
        blok_price_data[i] = skupna_tarifna_moc * usePrikljucnaMoc().value[i];
    }

    // Update all months BlokData
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
    const tarife = getTarifeData(useSettings().value.user_group.code);

    // Update month blok data
    //@ts-ignore
    for (const blok in months.value[month].blok_data) {
        const id = parseInt(blok) - 1; // Convert string to number and to index
        //@ts-ignore
        months.value[month].blok_data[blok].cena_omreznine_moci = usePrikljucnaMoc().value[id] * (tarife[blok].distribucija.tarifna_postavka_P + tarife[blok].prenos.tarifna_postavka_P);
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
    for (const blok in months.value[month].blok_data) {
        months.value[month].blok_data[blok].presezna_moc = Math.sqrt(months.value[month].blok_data[blok].presezna_moc);
    }

    // Izracunamo se ceno presezne moci
    const faktor_presezne_moci = 0.9; // TODO: Dodaj v nastavitve

    // Izracunamo ceno presezne moci
    const tarife = getTarifeData(useSettings().value.user_group.code);
    for (const [blok_key, blok_value] of Object.entries(months.value[month].blok_data)) {
        // blok_value.cena_presezne_moci = blok_value.presezna_moc * (tarife[blok_key].distribucija.tarifna_postavka_P + tarife[blok_key].prenos.tarifna_postavka_P) * faktor_presezne_moci;
        blok_value.cena_presezne_moci = blok_value.presezna_moc * (tarife[blok_key].distribucija.tarifna_postavka_P + tarife[blok_key].prenos.tarifna_postavka_P) * faktor_presezne_moci;
    }
};

/**
 * Doloci tarife za vsak blok v mesecu. Torej sesteje omreznino za prenos in distribucijo
 * ter jih nato shrani v objekt meseca.
 */
export const dolociTarifeZaBlok = (month: number) => {
    const months = useMonthsArray();
    const tarife = getTarifeData(useSettings().value.user_group.code);

    for (const blok in months.value[month].blok_data) {
        // doloci skupno_tarifo za moc za vsak blok
        months.value[month].blok_data[blok].skupna_tarifa_moc = tarife[blok].distribucija.tarifna_postavka_P + tarife[blok].prenos.tarifna_postavka_P;
        months.value[month].blok_data[blok].skupna_tarifa_energija = tarife[blok].distribucija.tarifna_postavka_W + tarife[blok].prenos.tarifna_postavka_W;
        months.value[month].blok_data[blok].skupna_tarifa_presezna_moc = months.value[month].blok_data[blok].skupna_tarifa_moc * 0.9;
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
        throw new Error("Neveljaven tip starega obracuna: " + useSettings().value.tip_novega_obracuna);
    }

    return omreznina + prispevki + energija;
};

/**
 * Vrne ceno vseh stroskov na STAREM racunu za definiran mesec, brez DDV.
 */
export const sumMonthCostsOld = (month: number) => {
    const months = useMonthsArray().value;
    const tarifValues = useSettings().value.vrednosti_tarif_omreznine;

    const omreznina_moc = usePrikljucnaMocStara().value * tarifValues.power; // Calculate network fee for old billing
    const prispevki = sestejVsePrispevke(month);

    let energija = 0;
    let omreznina_energija = 0;

    if (useSettings().value.tip_starega_obracuna === "VT+MT") {
        energija = months[month].vt_energy * useSettings().value.vrednosti_tarif_old.VT + months[month].mt_energy * useSettings().value.vrednosti_tarif_old.MT;
        omreznina_energija = months[month].vt_energy * tarifValues.VT + months[month].mt_energy * tarifValues.MT;
    } else if (useSettings().value.tip_starega_obracuna === "ET") {
        energija = months[month].total_energy * useSettings().value.vrednosti_tarif_old.ET;
        if (tarifValues.ET) omreznina_energija = months[month].total_energy * tarifValues.ET; //TODO: Pogledati je treba ceno omreznine energije za ET
    } else {
        throw new Error("Neveljaven tip starega obracuna: " + useSettings().value.tip_starega_obracuna);
    }
    return omreznina_moc + omreznina_energija + prispevki + energija;
};
