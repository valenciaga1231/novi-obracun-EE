<template>
    <div>
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
                    <td>{{ velika_tarifa.amount.toFixed(0) }}</td>
                    <td>kWh</td>
                    <td>0,118000</td>
                    <td>{{ velika_tarifa.price.toFixed(5) }}</td>
                </tr>
                <tr>
                    <td>El. energija MT</td>
                    <td>{{ mala_tarifa.amount.toFixed(0) }}</td>
                    <td>kWh</td>
                    <td>0,082000</td>
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
                    <td>{{ data.energija.toFixed(4) }}</td>
                    <td>kWh</td>
                    <td>/</td>
                    <td>{{ data.cena_omreznine_energije.toFixed(4) }}</td>
                </tr>
                <tr v-for="(data, blok) in blok_data" :key="blok">
                    <td>Obračunska moč blok {{ blok }}</td>
                    <td>{{ prikljucna_moc[blok - 1].toFixed(1) }}</td>
                    <td>kW</td>
                    <td>/</td>
                    <td>{{ data.cena_omreznine_moci.toFixed(4) }}</td>
                </tr>
                <tr v-for="(cena, blok) in blok_data" :key="blok">
                    <td>Presezna moč blok {{ blok }}</td>
                    <td>0</td>
                    <td>kW</td>
                    <td>0</td>
                    <td>0</td>
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
                    <td>{{ prispevek.is_active ? prispevek?.price?.toFixed(4) : "0.00000" }}</td>
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
                    <td>{{ (mala_tarifa.price + velika_tarifa.price).toFixed(5) }}</td>
                    <td>kWh</td>
                    <td>0.001530</td>
                    <td>{{ ((mala_tarifa.price + velika_tarifa.price) * 0.00153).toFixed(5) }}</td>
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
        onMounted(() => {});

        return {
            blok_data,
            prikljucna_moc,
            total_energy,
            prispevki,
            prikljucna_moc_stara,
            mala_tarifa,
            velika_tarifa,
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
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
}

.energy-table th {
    background-color: #f2f2f2;
}

.bold-row {
    font-weight: bold;
}
</style>
