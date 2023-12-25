<template>
    <div class="novi-racun-component">
        <div style="display: flex; justify-content: space-evenly">
            <h3 style="text-align: center; margin-top: 20px; font-size: 24px; font-weight: bold">Novi račun</h3>
            <div>
                <p v-if="settings.date.start && settings.date.end" style="text-align: center"><b>Datum: </b>{{ settings.date.start.toLocaleDateString("en-GB").replace(/\//g, ".") }} do {{ settings.date.end.toLocaleDateString("en-GB").replace(/\//g, ".") }}</p>
                <p style="text-align: center">
                    <b>Cena: </b> <span class="price">{{ sumAllCosts().toFixed(2) }} </span>
                    € (brez DDV)
                </p>
            </div>
        </div>
        <table class="energy-table">
            <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Količina</th>
                    <th>EM</th>
                    <th>Cena [EUR/EM]</th>
                    <th>Znesek EUR brez DDV</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="settings.tip_starega_obracuna === 'VT+MT'">
                    <tr class="bold-row">
                        <td>Skupaj el. energija</td>
                        <td>{{ (mala_tarifa + velika_tarifa).toFixed(0) }}</td>
                        <td colspan="2"></td>
                        <td>{{ (mala_tarifa * settings.vrednosti_tarif.MT + velika_tarifa * settings.vrednosti_tarif.VT).toFixed(5) }}</td>
                    </tr>
                    <tr class="energija-VT">
                        <td>Električna energija VT</td>
                        <td>{{ velika_tarifa.toFixed(4) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif.VT.toFixed(5) }}</td>
                        <td>{{ (velika_tarifa * settings.vrednosti_tarif.VT).toFixed(5) }}</td>
                    </tr>
                    <tr>
                        <td>Električna energija MT</td>
                        <td>{{ mala_tarifa.toFixed(4) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif.MT.toFixed(5) }}</td>
                        <td>{{ (mala_tarifa * settings.vrednosti_tarif.MT).toFixed(5) }}</td>
                    </tr>
                </template>
                <template v-if="settings.tip_starega_obracuna === 'ET'">
                    <tr class="bold-row">
                        <td>Skupaj el. energija</td>
                        <td>{{ (mala_tarifa + velika_tarifa).toFixed(0) }}</td>
                        <td colspan="2"></td>
                        <td>{{ (useTotalEnergy().value * settings.vrednosti_tarif.ET).toFixed(5) }}</td>
                    </tr>
                    <tr class="energija-ET">
                        <td>Električna energija ET</td>
                        <td>{{ useTotalEnergy().value.toFixed(4) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif.ET.toFixed(5) }}</td>
                        <td>{{ (useTotalEnergy().value * settings.vrednosti_tarif.ET).toFixed(5) }}</td>
                    </tr>
                </template>
                <tr class="bold-row">
                    <td>Skupaj omrežnine:</td>
                    <td colspan="3"></td>
                    <td>{{ sestejVsoOmreznino().toFixed(5) }}</td>
                </tr>
                <template v-for="(data, blok) in blok_data" :key="blok">
                    <tr v-if="data.is_active">
                        <td>Energija blok {{ blok }}</td>
                        <td>{{ data.energija.toFixed(2) }}</td>
                        <td>kWh</td>
                        <td>{{ data.skupna_tarifa_energija.toFixed(5) }}</td>
                        <td>{{ data.cena_omreznine_energije.toFixed(5) }}</td>
                    </tr>
                </template>
                <template v-for="(data, blok) in blok_data" :key="blok">
                    <tr v-if="data.is_active">
                        <td>Dogovorjena moč blok {{ blok }}</td>
                        <td>{{ prikljucna_moc[blok - 1] }}</td>
                        <td>kW</td>
                        <td>{{ data.skupna_tarifa_moc.toFixed(5) }}</td>
                        <td>{{ data.cena_omreznine_moci.toFixed(5) }}</td>
                    </tr>
                </template>
                <template v-for="(data, blok) in blok_data" :key="blok">
                    <tr v-if="data.is_active">
                        <td>Presežna moč blok {{ blok }}</td>
                        <td>{{ data.presezna_moc.toFixed(5) }}</td>
                        <td>kW</td>
                        <td>{{ data.skupna_tarifa_presezna_moc.toFixed(5) }}</td>
                        <td>{{ data.cena_presezne_moci.toFixed(5) }}</td>
                    </tr>
                </template>
                <tr class="bold-row">
                    <td>Prispevki in druge dajatve skupaj:</td>
                    <td colspan="3"></td>
                    <td>{{ sestejVsePrispevke().toFixed(5) }}</td>
                </tr>
                <tr v-for="(prispevek, id) in prispevki" :key="id">
                    <td>{{ prispevek.name }}</td>
                    <td>{{ id == "spte_ove" ? prikljucna_moc_stara.toFixed(0) : total_energy.toFixed(0) }}</td>
                    <td>{{ id == "spte_ove" ? "kW" : "kWh" }}</td>
                    <td>{{ prispevek.is_active ? prispevek.price_per_unit.toFixed(5) : "0.00000" }}</td>
                    <td>{{ prispevek.is_active ? prispevek?.price.toFixed(5) : "0.00000" }}</td>
                </tr>
                <!-- <tr>
                    <td>Trošarina:</td>
                    <td>{{ (mala_tarifa + velika_tarifa).toFixed(5) }}</td>
                    <td>kWh</td>
                    <td>{{ prispe }}</td>
                    <td>{{ ((mala_tarifa + velika_tarifa) * 0.00153).toFixed(5) }}</td>
                </tr> -->
                <tr>
                    <th>Skupaj</th>
                    <th>...</th>
                    <th>...</th>
                    <th>...</th>
                    <th>{{ sumAllCosts().toFixed(5) }}</th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const blok_data = useBlokData();
        const prikljucna_moc = usePrikljucnaMoc();
        const prikljucna_moc_stara = usePrikljucnaMocStara();
        const total_energy = useTotalEnergy();
        const prispevki = usePrispevki();
        const mala_tarifa = useTotalEnergyMT();
        const velika_tarifa = useTotalEnergyVT();
        const settings = useSettings();
        onMounted(() => {});

        // if settings.vrednosti_tarif.VT is updated blink the row
        watch(
            () => settings.value.vrednosti_tarif.VT,
            (val) => {
                const elVT = document.querySelector(".energija-VT") as HTMLElement;
                elVT.classList.add("blink-green");
                setTimeout(() => elVT.classList.remove("blink-green"), 1500);

                const elPrice = document.querySelector(".price") as HTMLElement;
                elPrice.classList.add("blink-green");
                setTimeout(() => elPrice.classList.remove("blink-green"), 1500);

                if (useIsTable().value) sumAllCosts();
            }
        );

        return {
            blok_data,
            prikljucna_moc,
            total_energy,
            prispevki,
            prikljucna_moc_stara,
            mala_tarifa,
            velika_tarifa,
            settings,
            sestejVsoOmreznino,
            sestejVsePrispevke,
            sumAllCosts,
        };
    },
};
</script>

<style scoped>
.novi-racun-component {
    background-color: white;
}

.energy-table {
    width: 100%;
    border-collapse: collapse;
    margin: auto;
}

.energy-table th,
.energy-table td {
    padding: 8px; /* Adjust the padding value to make the rows tighter */
    text-align: center;
    border: 1px solid #e2e8f0;
}

.energy-table th {
    background-color: #f7fafc;
    font-weight: bold;
}

.bold-row {
    font-weight: bold;
    background-color: #edf2f7;
}

.bold-row td {
    font-weight: bold;
}

.blink-green {
    animation: blink-green-animation 1.5s infinite;
}

@keyframes blink-green-animation {
    0% {
        background-color: #ffbc85;
    }
    /* 50% {
        background-color: transparent;
    } */
    100% {
        background-color: transparent;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
