// Pac 5 prikljucnih moci za vsak blok (1-5)
export type PrikljucnaMoc = [number, number, number, number, number]; //? Bi se lahko dalo v BlokData?

// Ena vrstica, ki jo dobimo iz Excela
export type ExcelRow = {
    W: number;
    P: number;
    blok: number;
    is_VT: boolean;
    date: Date;
};

// Podatki za vse bloke
export type BlokData = {
    [key: number]: {
        energija: number;
        cena_omreznine_energije: number;
        cena_omreznine_moci: number;
        presezna_moc: number;
        cena_presezne_moci: number;
        intervali_moc_presezena: number;
        skupna_tarifa_moc: number;
        skupna_tarifa_energija: number;
        skupna_tarifa_presezna_moc: number;
        is_active: boolean;
    };
};

type PrispevkiKeys = "operater_trga" | "energetsko_ucinkovitost" | "spte_ove";
export type Prispevki = {
    [key in PrispevkiKeys]: {
        name: string;
        price_per_unit: number;
        is_active: boolean;
        price: number;
    };
};

export type Settings = {
    tip_starega_obracuna: "VT+MT" | "ET" | null; // VT+MT | ET
    vrednosti_tarif: {
        VT: number;
        MT: number;
        ET: number;
    };
    date: {
        start: Date | null;
        end: Date | null;
    };
};
