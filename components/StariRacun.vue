<template>
    <div>
        <table class="energy-table">
            <thead>
                <tr class="main-header">
                    <td style="text-align: left">PRODUKT</td>
                    <td>KOLICINA</td>
                    <td>
                        ENOTA<br />
                        MERE (EM)
                    </td>
                    <td>CENA<br />[EUR/EM]</td>
                    <td>ZNESEK EUR<br />BREZ DDV</td>
                </tr>
            </thead>
            <tbody>
                <tr class="energija-VT">
                    <td style="text-align: left">Električna energija VT</td>
                    <td>{{ velika_tarifa.toFixed(0) }}</td>
                    <td>kWh</td>
                    <td>{{ useSettings().value.vrednosti_tarif.VT.toFixed(6) }}</td>
                    <td>{{ (velika_tarifa * settings.vrednosti_tarif.VT).toFixed(5) }}</td>
                </tr>
                <tr>
                    <td style="text-align: left">Električna energija MT</td>
                    <td>{{ mala_tarifa.toFixed(0) }}</td>
                    <td>kWh</td>
                    <td>{{ useSettings().value.vrednosti_tarif.MT.toFixed(6) }}</td>
                    <td>{{ (mala_tarifa * settings.vrednosti_tarif.MT).toFixed(5) }}</td>
                </tr>
                <tr class="bold-row">
                    <td style="text-align: left">Skupaj el. energija</td>
                    <td>{{ (mala_tarifa + velika_tarifa).toFixed(0) }}</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>{{ (mala_tarifa * settings.vrednosti_tarif.MT + velika_tarifa * settings.vrednosti_tarif.VT).toFixed(5) }}</td>
                </tr>
                <tr>
                    <td style="text-align: left">Obračunska moč</td>
                    <td>{{ prikljucna_moc_stara.toFixed(0) }}</td>
                    <td>kW</td>
                    <td>{{ "0.774170" }}</td>
                    <td>{{ (prikljucna_moc_stara * 0.77417).toFixed(5) }}</td>
                </tr>
                <tr>
                    <td style="text-align: left">Omrežnina VT</td>
                    <td>{{ velika_tarifa.toFixed(0) }}</td>
                    <td>kW</td>
                    <td>{{ "0.041820" }}</td>
                    <td>{{ (mala_tarifa * 0.04182).toFixed(5) }}</td>
                </tr>
                <tr>
                    <td style="text-align: left">Omrežnina MT</td>
                    <td>{{ mala_tarifa.toFixed(0) }}</td>
                    <td>kW</td>
                    <td>{{ "0.032150" }}</td>
                    <td>{{ (mala_tarifa * 0.03215).toFixed(5) }}</td>
                </tr>
                <tr class="bold-row">
                    <td style="text-align: left">Skupaj omrežnina</td>
                    <td>{{ (mala_tarifa + velika_tarifa).toFixed(0) }}</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>{{ (mala_tarifa * settings.vrednosti_tarif.MT + velika_tarifa * settings.vrednosti_tarif.VT).toFixed(5) }}</td>
                </tr>
                <tr v-for="(prispevek, id) in prispevki" :key="id">
                    <td style="text-align: left">{{ prispevek.name }}</td>
                    <td>{{ id == "spte_ove" ? prikljucna_moc_stara.toFixed(0) : total_energy.toFixed(0) }}</td>
                    <td>{{ id == "spte_ove" ? "kW" : "kWh" }}</td>
                    <td>{{ prispevek.is_active ? prispevek.price_per_unit.toFixed(6) : "0.00000" }}</td>
                    <td>{{ prispevek.is_active ? prispevek?.price.toFixed(6) : "0.00000" }}</td>
                </tr>
                <tr class="bold-row">
                    <td style="text-align: left">Prispevki in druge dajatve skupaj:</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>{{ sestejVsePrispevke().toFixed(5) }}</td>
                </tr>
                <tr class="bold-row" style="border-top: 1.75px solid black; padding-top: 20px; height: 50px">
                    <td style="text-align: left">Skupaj</td>
                    <td colspan="3"></td>
                    <td>{{ sumAllCosts().toFixed(5) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    setup() {
        const prikljucna_moc_stara = usePrikljucnaMocStara();
        const total_energy = useTotalEnergy();
        const prispevki = usePrispevki();
        const mala_tarifa = useTotalEnergyMT();
        const velika_tarifa = useTotalEnergyVT();
        const settings = useSettings();
        return {
            prikljucna_moc_stara,
            total_energy,
            prispevki,
            mala_tarifa,
            velika_tarifa,
            settings,
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

.main-header {
    color: #d16f3a;
    border-top: none;

    border-bottom: 1.75px solid black;
}

h3 {
    margin: 0;
    text-align: center;
}

.energy-table th,
.energy-table td {
    padding: 5px;
    text-align: right;
}

.energy-table th {
    background-color: #f7fafc;
    font-weight: bold;
}

.bold-row {
    font-weight: bold;
}

.bold-row td {
    font-weight: bold;
}
</style>
