/**
 * Tarife za prenos in distribucijo električne energije
 */
export const getTarifeData = (userGroup: number | null): TarifeData => {
    if (userGroup === 0) return JSON.parse(tarifeUserGroup0);
    if (userGroup === 1) return JSON.parse(tarifeUserGroup1);
    if (userGroup === 2) return JSON.parse(tarifeUserGroup2);
    if (userGroup === 3) return JSON.parse(tarifeUserGroup3);
    if (userGroup === 4) return JSON.parse(tarifeUserGroup4);
    if (userGroup === null) throw new Error("User group cannot be null");
    throw new Error(`Invalid user group: ${userGroup}`);
};

const tarifeUserGroup0 = `{
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

const tarifeUserGroup1 = `{
    "1": {
        "prenos": {
            "tarifna_postavka_P": 0.65940,
            "tarifna_postavka_W": 0.00671
        },
        "distribucija": {
            "tarifna_postavka_P": 5.33444,
            "tarifna_postavka_W": 0.01454
        }
    },
    "2": {
        "prenos": {
            "tarifna_postavka_P": 0.12667,
            "tarifna_postavka_W": 0.00650
        },
        "distribucija": {
            "tarifna_postavka_P": 1.08944,
            "tarifna_postavka_W": 0.01389
        }
    },
    "3": {
        "prenos": {
            "tarifna_postavka_P": 0.01858,
            "tarifna_postavka_W": 0.00612
        },
        "distribucija": {
            "tarifna_postavka_P": 0.14257,
            "tarifna_postavka_W": 0.01369
        }
    },
    "4": {
        "prenos": {
            "tarifna_postavka_P": 0.00082,
            "tarifna_postavka_W": 0.00597
        },
        "distribucija": {
            "tarifna_postavka_P": 0.00368,
            "tarifna_postavka_W": 0.01330
        }
    },
    "5": {
        "prenos": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.00603
        },
        "distribucija": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.01329
        }
    }
}`;

const tarifeUserGroup2 = `{
    "1": {
        "prenos": {
            "tarifna_postavka_P": 0.72026,
            "tarifna_postavka_W": 0.00683
        },
        "distribucija": {
            "tarifna_postavka_P": 4.18586,
            "tarifna_postavka_W": 0.01263
        }
    },
    "2": {
        "prenos": {
            "tarifna_postavka_P": 0.14701,
            "tarifna_postavka_W": 0.00663
        },
        "distribucija": {
            "tarifna_postavka_P": 0.88405,
            "tarifna_postavka_W": 0.01204
        }
    },
    "3": {
        "prenos": {
            "tarifna_postavka_P": 0.02365,
            "tarifna_postavka_W": 0.00626
        },
        "distribucija": {
            "tarifna_postavka_P": 0.11318,
            "tarifna_postavka_W": 0.1181
        }
    },
    "4": {
        "prenos": {
            "tarifna_postavka_P": 0.00107,
            "tarifna_postavka_W": 0.00610
        },
        "distribucija": {
            "tarifna_postavka_P": 0.00107,
            "tarifna_postavka_W": 0.01140
        }
    },
    "5": {
        "prenos": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.00603
        },
        "distribucija": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.01139
        }
    }
}`;

const tarifeUserGroup3 = `{
    "1": {
        "prenos": {
            "tarifna_postavka_P": 0.65546,
            "tarifna_postavka_W": 0.00679
        },
        "distribucija": {
            "tarifna_postavka_P": 1.95873,
            "tarifna_postavka_W": 0.00810
        }
    },
    "2": {
        "prenos": {
            "tarifna_postavka_P": 0.15520,
            "tarifna_postavka_W": 0.00668
        },
        "distribucija": {
            "tarifna_postavka_P": 0.44459,
            "tarifna_postavka_W": 0.00797
        }
    },
    "3": {
        "prenos": {
            "tarifna_postavka_P": 0.03382,
            "tarifna_postavka_W": 0.00634
        },
        "distribucija": {
            "tarifna_postavka_P": 0.07189,
            "tarifna_postavka_W": 0.00762
        }
    },
    "4": {
        "prenos": {
            "tarifna_postavka_P": 0.00140,
            "tarifna_postavka_W": 0.00616
        },
        "distribucija": {
            "tarifna_postavka_P": 0.00140,
            "tarifna_postavka_W": 0.00742
        }
    },
    "5": {
        "prenos": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.00611
        },
        "distribucija": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.00736
        }
    }
}`;

const tarifeUserGroup4 = `{
    "1": {
        "prenos": {
            "tarifna_postavka_P": 0.30590,
            "tarifna_postavka_W": 0.00794
        },
        "distribucija": {
            "tarifna_postavka_P": 0.56683,
            "tarifna_postavka_W": 0.00829
        }
    },
    "2": {
        "prenos": {
            "tarifna_postavka_P": 0.18578,
            "tarifna_postavka_W": 0.00778
        },
        "distribucija": {
            "tarifna_postavka_P": 0.25891,
            "tarifna_postavka_W": 0.00813
        }
    },
    "3": {
        "prenos": {
            "tarifna_postavka_P": 0.04158,
            "tarifna_postavka_W": 0.00741
        },
        "distribucija": {
            "tarifna_postavka_P": 0.05109,
            "tarifna_postavka_W": 0.00776
        }
    },
    "4": {
        "prenos": {
            "tarifna_postavka_P": 0.00186,
            "tarifna_postavka_W": 0.00718
        },
        "distribucija": {
            "tarifna_postavka_P": 0.00186,
            "tarifna_postavka_W": 0.00753
        }
    },
    "5": {
        "prenos": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.00713
        },
        "distribucija": {
            "tarifna_postavka_P": 0.0,
            "tarifna_postavka_W": 0.00748
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
