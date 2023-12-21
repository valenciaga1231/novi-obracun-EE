// Pac 5 prikljucnih moci za vsak blok (1-5)
export type PrikljucnaMoc = [number, number, number, number, number];

// Ena vrstica, ki jo dobimo iz Excela
export type ExcelRow = {
    timestamp: Date;
    W: number;
    P: number;
    blok: number;
};

// Podatki za vse bloke
export type BlokData = {
    [key: number]: {
        energija: number;
        cena_omreznine_energije: number;
        cena_omreznine_moci: number;
    };
};

type PrispevkiKeys = "operater_trga" | "energetsko_ucinkovitost" | "spte_ove";
export type Prispevki = {
    [key in PrispevkiKeys]: {
        name: string;
        price_per_unit: number;
        is_active: boolean;
        price: number | undefined;
    };
};

export type Energija = {
    amount: number;
    price: number;
};
