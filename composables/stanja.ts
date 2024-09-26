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
    user_group: { name: "User group", code: null },

    tip_starega_obracuna: null, // Default
    vrednosti_tarif_old: { VT: 0.118, MT: 0.082, ET: 0.105 },
    tip_novega_obracuna: null, // Default
    vrednosti_tarif: { VT: 0.16999, MT: 0.14799, ET: 0.15899 },

    date: {
        start: null,
        end: null,
    },

    vrednosti_tarif_omreznine: {
        label: "Not defined",
        power: 0,
        VT: 0,
        MT: 0,
        ET: null,
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

export const useConnectionsTypeList = () =>
    useState<any>("connection_type_list", () => [
        {
            label: "Napetostni nivo VN",
            code: "VN",
            items: [
                { label: "Omrežna priključitev: T >= 6000 ur", value: "Zbiralke VN", power: 0.93077, VT: 0.00154, MT: 0.0012 },
                { label: "Omrežna priključitev: 6000 > T >= 2500 ur", value: "Zbiralke VN", power: 0.99541, VT: 0.00141, MT: 0.00108 },
                { label: "Omrežna priključitev: T < 2500 ur", value: "Zbiralke VN", power: 1.0703, VT: 0.00149, MT: 0.00115 },
            ],
        },
        {
            label: "Napetostni nivo SN",
            code: "SN",
            items: [
                { label: "Zbiralčna priključitev: T >= 2500 ur", value: "Zbiralke SN", power: 3.00735, VT: 0.00072, MT: 0.00055 },
                { label: "Zbiralčna priključitev: T < 2500 ur", value: "Zbiralke SN", power: 2.97166, VT: 0.00095, MT: 0.00073 },
                { label: "Omrežna priključitev: T >= 2500 ur", value: "Zbiralke VN", power: 3.1308, VT: 0.00767, MT: 0.00591 },
                { label: "Omrežna priključitev: T < 2500 ur", value: "Zbiralke VN", power: 2.40595, VT: 0.01217, MT: 0.00937 },
            ],
        },
        {
            label: "Napetostni nivo NN",
            code: "NN",
            items: [
                { label: "Zbiralčna priključitev: T >= 2500 ur", value: "Zbiralke SN", power: 4.20754, VT: 0.00743, MT: 0.00575 },
                { label: "Zbiralčna priključitev: T < 2500 ur", value: "Zbiralke SN", power: 3.50514, VT: 0.01183, MT: 0.00909 },
                { label: "Omrežna priključitev: T >= 2500 ur", value: "Zbiralke VN", power: 5.54684, VT: 0.01639, MT: 0.01261 },
                { label: "Omrežna priključitev: T < 2500 ur", value: "Zbiralke VN", power: 4.61098, VT: 0.02223, MT: 0.01708 },
                { label: "Omrežna priključitev: polnjenje EV", value: "Zbiralke VN", power: 2.30549, VT: 0.01111, MT: 0.00856 },
                { label: "Omrežna priključitev: brez merjenja moči", value: "Zbiralke VN", power: 0.77417, VT: 0.04182, MT: 0.03215, ET: 0.03858 },
                { label: "Omrežna priključitev: gospodinjstvo", value: "Zbiralke VN", power: 0.77417, VT: 0.04182, MT: 0.03215, ET: 0.03858 },
            ],
        },
    ]);

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
