<template>
    <div>
        <div style="display: flex; justify-content: space-evenly">
            <div style="display: flex; flex-direction: column; justify-content: space-between; margin: 10px 20px">
                <h3 style="font-size: 24px; font-weight: bold">Stari račun</h3>
            </div>
            <div>
                <p v-if="settings.date.start && settings.date.end" style="text-align: center"><b>Datum: </b>{{ settings.date.start.toLocaleDateString("en-GB").replace(/\//g, ".") }} do {{ settings.date.end.toLocaleDateString("en-GB").replace(/\//g, ".") }}</p>
                <p class="price-window">
                    <b>Cena: </b> <span class="price">{{ month_data.total_sum_old_DDV.toFixed(2) }} </span>
                    € (z DDV)
                </p>
            </div>
        </div>
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
            <tbody></tbody>
            <tbody>
                <template v-if="settings.tip_starega_obracuna === 'VT+MT'">
                    <tr class="energija-VT">
                        <td style="text-align: left">Električna energija VT</td>
                        <td>{{ month_data.vt_energy.toFixed(0) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif.VT.toFixed(6) }}</td>
                        <td>{{ (Math.round(month_data.vt_energy) * settings.vrednosti_tarif.VT).toFixed(5) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left">Električna energija MT</td>
                        <td>{{ month_data.mt_energy.toFixed(0) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif.MT.toFixed(6) }}</td>
                        <td>{{ (Math.round(month_data.mt_energy) * settings.vrednosti_tarif.MT).toFixed(5) }}</td>
                    </tr>
                    <tr class="bold-row">
                        <td style="text-align: left">Skupaj el. energija</td>
                        <td>{{ (month_data.mt_energy + month_data.vt_energy).toFixed(0) }}</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>{{ (Math.round(month_data.mt_energy) * settings.vrednosti_tarif.MT + Math.round(month_data.vt_energy) * settings.vrednosti_tarif.VT).toFixed(5) }}</td>
                    </tr>
                </template>
                <tr>
                    <td style="text-align: left">Obračunska moč</td>
                    <td>{{ prikljucna_moc_stara.toFixed(0) }}</td>
                    <td>kW</td>
                    <td>{{ "0.774170" }}</td>
                    <td>{{ (prikljucna_moc_stara * 0.77417).toFixed(5) }}</td>
                </tr>
                <tr>
                    <td style="text-align: left">Omrežnina VT</td>
                    <td>{{ month_data.vt_energy.toFixed(0) }}</td>
                    <td>kW</td>
                    <td>{{ "0.041820" }}</td>
                    <td>{{ (month_data.vt_energy * 0.04182).toFixed(5) }}</td>
                </tr>
                <tr>
                    <td style="text-align: left">Omrežnina MT</td>
                    <td>{{ month_data.mt_energy.toFixed(0) }}</td>
                    <td>kW</td>
                    <td>{{ "0.032150" }}</td>
                    <td>{{ (month_data.mt_energy * 0.03215).toFixed(5) }}</td>
                </tr>
                <tr class="bold-row">
                    <td style="text-align: left">Skupaj omrežnina</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>{{ (Math.round(month_data.mt_energy) * 0.03215 + Math.round(month_data.vt_energy) * 0.04182 + Math.round(prikljucna_moc_stara) * 0.77417).toFixed(5) }}</td>
                </tr>
                <tr v-for="(prispevek, id) in month_data.prispevki" :key="id">
                    <td style="text-align: left">{{ prispevek.name }}</td>
                    <td>{{ id == "spte_ove" ? prikljucna_moc_stara.toFixed(0) : month_data.total_energy.toFixed(0) }}</td>
                    <td>{{ id == "spte_ove" ? "kW" : "kWh" }}</td>
                    <td>{{ prispevek.is_active ? prispevek.price_per_unit.toFixed(5) : "0.00000" }}</td>
                    <td>{{ prispevek.is_active ? prispevek?.price.toFixed(5) : "0.00000" }}</td>
                </tr>
                <tr class="bold-row">
                    <td style="text-align: left">Prispevki in druge dajatve skupaj:</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>{{ sestejVsePrispevke(props.month).toFixed(5) }}</td>
                </tr>
                <tr class="bold-row" style="border-top: 1.75px solid black; padding-top: 20px; height: 50px">
                    <td style="text-align: left">Skupaj (brez DDV)</td>
                    <td colspan="3"></td>
                    <td>{{ sumMonthCostsOld(props.month).toFixed(5) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        month: {
            type: Number,
            required: true,
        },
    },

    setup(props) {
        const prikljucna_moc_stara = usePrikljucnaMocStara();
        const settings = useSettings();

        const month_data = useMonthsArray().value[props.month];

        return {
            props,
            prikljucna_moc_stara,
            settings,
            month_data,
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
.price-window {
    font-weight: bold;
    border: 1.75px solid black;
    padding: 10px 20px;
    border-radius: 5px;
}
</style>
