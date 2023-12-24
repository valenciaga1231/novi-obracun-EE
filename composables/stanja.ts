import type { BlokData, ExcelRow, PrikljucnaMoc, Prispevki, Energija, Settings } from "~/types";

export const usePrikljucnaMoc = () => useState<PrikljucnaMoc>("prikljucna_moc", () => [4.2, 5.2, 5.2, 5.2, 5.2]);
export const usePrikljucnaMocStara = () => useState<number>("prikljucna_moc_stara", () => 7);
export const useExcelData = () => useState<ExcelRow[]>("excel_data", () => [] as ExcelRow[]);
export const useBlokData = () => useState<BlokData>("blok_data", () => ({} as BlokData));
export const useTotalEnergy = () => useState<number>("total_energy", () => 0);
export const useTotalEnergyVT = () => useState<Energija>("total_energy_VT", () => ({ amount: 0, price: 0 }));
export const useTotalEnergyMT = () => useState<Energija>("total_energy_MT", () => ({ amount: 0, price: 0 }));
export const useIsTable = () => useState<boolean>("is_table", () => false);

const default_settings: Settings = { tip_starega_obracuna: null, vrednosti_tarif: { VT: 0.118, MT: 0.082, ET: 0.105 } };
export const useSettings = () => useState<Settings>("settings", () => default_settings);

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
};
export const usePrispevki = () => useState<Prispevki>("prispevki", () => prispevki);

/**
 * Functions resets all data. If you want to reset your data
 * before handling new Excel input, add your data to this function.
 */
export const useResetData = () => {
    usePrikljucnaMocStara().value = 7;
    useExcelData().value = [];
    useBlokData().value = {} as BlokData;
    useTotalEnergy().value = 0;
    useTotalEnergyVT().value = { amount: 0, price: 0 };
    useTotalEnergyMT().value = { amount: 0, price: 0 };
    useIsTable().value = false;
    usePrispevki().value = prispevki;
};
