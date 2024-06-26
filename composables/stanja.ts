import type { BlokData, ExcelRow, MonthsData, PrikljucnaMoc, Prispevki, Settings } from "~/types";

// Array of rows read from excel
export const useExcelData = () => useState<ExcelRow[]>("excel_data", () => [] as ExcelRow[]);

// Main state for storing inputed months data
export const useMonthsArray = () => useState<MonthsData>("months_array", () => ({} as MonthsData));

// Store total energy for all inputed months
export const useTotalEnergy = () => useState<number>("total_energy", () => 0);
export const useTotalEnergyVT = () => useState<number>("total_energy_VT", () => 0);
export const useTotalEnergyMT = () => useState<number>("total_energy_MT", () => 0);

// Settings
export const useSettings = () => useState<Settings>("settings", () => default_settings);
export const usePrikljucnaMoc = () => useState<PrikljucnaMoc>("prikljucna_moc", () => [4.2, 5.4, 5.4, 5.4, 5.4]);
export const usePrikljucnaMocPrices = () => useState<Array<Number>>("prikljucna_moc_prices", () => [0, 0, 0, 0, 0]); // Is set when mounting /racunalo
export const usePrikljucnaMocStara = () => useState<number>("prikljucna_moc_stara", () => 7);
export const useIsLightTheme = () => useState<boolean>("is_light_theme", () => false);

// Stores prispevki data (names, prices...)
export const usePrispevki = () => useState<Prispevki>("prispevki", () => prispevki);

export const useIsPrimerjavaModal = () => useState<boolean>("is_primerjava_modal", () => false);
export const useIsTable = () => useState<boolean>("is_table", () => false);
export const useHeaderTab = () => useState<number>("header_value", () => 0); // Used to define current tab in header

// Initalize blok data
export const initDefaultBlokData = () => {
    let data = {} as BlokData;
    // for loop from onw to 5
    for (let b = 1; b <= 5; b++) {
        data[b] = {
            energija: 0,
            cena_omreznine_energije: 0,
            cena_omreznine_moci: 0,
            presezna_moc: 0,
            cena_presezne_moci: 0,
            intervali_moc_presezena: 0,
            skupna_tarifa_moc: 0,
            skupna_tarifa_energija: 0,
            skupna_tarifa_presezna_moc: 0,
            is_active: true,
        };
    }

    return data;
};

// Define default settings
const default_settings: Settings = {
    tip_starega_obracuna: null, // Default
    vrednosti_tarif: { VT: 0.118, MT: 0.082, ET: 0.105 },
    date: {
        start: null,
        end: null,
    },
};

// Define default prispevki state
const prispevki: Prispevki = {
    operater_trga: {
        name: "Prispevek za delovanje operaterja trga",
        price_per_unit: 0.00013, // €/MWh
        is_active: true,
        price: 0,
    },
    energetsko_ucinkovitost: {
        name: "Prispevek za energetsko učinkovitost",
        price_per_unit: 0.0008, // €/MWh
        is_active: true,
        price: 0,
    },
    spte_ove: {
        name: "Prispevek za SPTE in OVE",
        price_per_unit: 0.73896, // €/kW
        is_active: true,
        price: 0,
    },
    trosarina: {
        name: "Trošarina",
        price_per_unit: 0.00153, // €/kW
        is_active: true,
        price: 0,
    },
};

/**
 * Functions resets all data. If you want to reset your data
 * before handling new Excel input, add your data to this function.
 */
export const useResetData = () => {
    useExcelData().value = [];
    useMonthsArray().value = {} as MonthsData;
    useTotalEnergy().value = 0;
    useTotalEnergyVT().value = 0;
    useTotalEnergyMT().value = 0;
};
