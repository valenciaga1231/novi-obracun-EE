/**
 * Tarife za prenos in distribucijo električne energije
 */
export const getTarifeData = (): TarifeData => JSON.parse(json);

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

type TarifeData = {
    [key: string]: {
        prenos: {
            tarifna_postavka_P: number;
            tarifna_postavka_W: number;
        };
        distribucija: {
            tarifna_postavka_P: number;
            tarifna_postavka_W: number;
        };
    };
};
