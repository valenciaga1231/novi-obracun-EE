<template>
    <div>
        <h3 style="text-align: center; margin-top: 20px; font-size: 24px; font-weight: bold">Novi račun</h3>
        <p v-if="settings.date.start && settings.date.end" style="text-align: center">{{ settings.date.start.toLocaleDateString("en-GB").replace(/\//g, ".") }} do {{ settings.date.end.toLocaleDateString("en-GB").replace(/\//g, ".") }}</p>
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
                <tr>
                    <td>El. energija VT</td>
                    <td>{{ velika_tarifa.amount.toFixed(2) }}</td>
                    <td>kWh</td>
                    <td>{{ useSettings().value.vrednosti_tarif.VT.toFixed(5) }}</td>
                    <td>{{ velika_tarifa.price.toFixed(5) }}</td>
                </tr>
                <tr>
                    <td>El. energija MT</td>
                    <td>{{ mala_tarifa.amount.toFixed(2) }}</td>
                    <td>kWh</td>
                    <td>{{ useSettings().value.vrednosti_tarif.MT.toFixed(5) }}</td>
                    <td>{{ mala_tarifa.price.toFixed(5) }}</td>
                </tr>
                <tr class="bold-row">
                    <td>Skupaj el. energija</td>
                    <td>{{ (mala_tarifa.amount + velika_tarifa.amount).toFixed(0) }}</td>
                    <td>...</td>
                    <td>...</td>
                    <td>{{ (mala_tarifa.price + velika_tarifa.price).toFixed(5) }}</td>
                </tr>
                <tr v-for="(data, blok) in blok_data" :key="blok">
                    <td>Omreznina energija blok {{ blok }}</td>
                    <td>{{ data.energija.toFixed(5) }}</td>
                    <td>kWh</td>
                    <td>{{ data.skupna_tarifa_energija.toFixed(5) }}</td>
                    <td>{{ data.cena_omreznine_energije.toFixed(5) }}</td>
                </tr>
                <tr v-for="(data, blok) in blok_data" :key="blok">
                    <td>Obračunska moč blok {{ blok }}</td>
                    <td>{{ prikljucna_moc[blok - 1].toFixed(1) }}</td>
                    <td>kW</td>
                    <td>{{ data.skupna_tarifa_moc.toFixed(5) }}</td>
                    <td>{{ data.cena_omreznine_moci.toFixed(5) }}</td>
                </tr>
                <tr v-for="(data, blok) in blok_data" :key="blok">
                    <td>Presezna moč blok {{ blok }}</td>
                    <td>{{ data.presezna_moc.toFixed(5) }}</td>
                    <td>kW</td>
                    <td>{{ data.skupna_tarifa_presezna_moc.toFixed(5) }}</td>
                    <td>{{ data.cena_presezne_moci.toFixed(5) }}</td>
                </tr>
                <tr class="bold-row">
                    <td>Skupaj omreznine:</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>{{ sestejVsoOmreznino().toFixed(5) }}</td>
                </tr>
                <tr v-for="(prispevek, id) in prispevki" :key="id">
                    <td>{{ prispevek.name }}</td>
                    <td>{{ id == "spte_ove" ? prikljucna_moc_stara.toFixed(0) : total_energy.toFixed(0) }}</td>
                    <td>{{ id == "spte_ove" ? "kW" : "kWh" }}</td>
                    <td>{{ prispevek.is_active ? prispevek.price_per_unit.toFixed(5) : "0.00000" }}</td>
                    <td>{{ prispevek.is_active ? prispevek?.price.toFixed(5) : "0.00000" }}</td>
                </tr>
                <tr class="bold-row">
                    <td>Skupaj prispevki:</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>{{ sestejVsePrispevke().toFixed(5) }}</td>
                </tr>
                <tr>
                    <td>Trošarina:</td>
                    <td>{{ (mala_tarifa.amount + velika_tarifa.amount).toFixed(5) }}</td>
                    <td>kWh</td>
                    <td>0.001530</td>
                    <td>{{ ((mala_tarifa.amount + velika_tarifa.amount) * 0.00153).toFixed(5) }}</td>
                </tr>
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
</style>
