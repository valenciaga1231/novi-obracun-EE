<template>
    <div>
        <div class="h-20" style="display: flex; justify-content: space-evenly">
            <div style="display: flex; flex-direction: column; justify-content: space-between; margin: 10px 20px">
                <h3 style="font-size: 24px; font-weight: bold">Stari račun</h3>
            </div>
            <div>
                <p v-if="month_data.date.start && month_data.date.end" style="text-align: center"><b>Datum: </b>{{ month_data.date.start.toLocaleDateString("en-GB").replace(/\//g, ".") }} do {{ month_data.date.end.toLocaleDateString("en-GB").replace(/\//g, ".") }}</p>
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
            <!-- <Divider /> -->
            <tbody>
                <template v-if="settings.tip_starega_obracuna === 'VT+MT'">
                    <tr class="energija-VT">
                        <td style="text-align: left">Električna energija VT</td>
                        <td>{{ month_data.vt_energy.toFixed(0) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif_old.VT.toFixed(6) }}</td>
                        <td>{{ (Math.round(month_data.vt_energy) * settings.vrednosti_tarif_old.VT).toFixed(5) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left">Električna energija MT</td>
                        <td>{{ month_data.mt_energy.toFixed(0) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif_old.MT.toFixed(6) }}</td>
                        <td>{{ (Math.round(month_data.mt_energy) * settings.vrednosti_tarif_old.MT).toFixed(5) }}</td>
                    </tr>
                    <tr class="bold-row">
                        <td style="text-align: left">Skupaj el. energija</td>
                        <td>{{ month_data.total_energy.toFixed(0) }}</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>{{ (Math.round(month_data.mt_energy) * settings.vrednosti_tarif_old.MT + Math.round(month_data.vt_energy) * settings.vrednosti_tarif_old.VT).toFixed(5) }}</td>
                    </tr>
                </template>
                <template v-if="settings.tip_starega_obracuna === 'ET'">
                    <tr class="energija-ET">
                        <td style="text-align: left">Električna energija ET</td>
                        <td>{{ Math.round(month_data.total_energy).toFixed(0) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif_old.ET.toFixed(6) }}</td>
                        <td>{{ (Math.round(month_data.total_energy) * settings.vrednosti_tarif_old.ET).toFixed(5) }}</td>
                    </tr>
                    <tr class="bold-row">
                        <td style="text-align: left">Skupaj el. energija</td>
                        <td>{{ month_data.total_energy.toFixed(0) }}</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>{{ (Math.round(month_data.total_energy) * settings.vrednosti_tarif_old.ET).toFixed(5) }}</td>
                    </tr>
                </template>
                <tr>
                    <td style="text-align: left">Obračunska moč</td>
                    <td>{{ prikljucna_moc_stara.toFixed(0) }}</td>
                    <td>kW</td>
                    <td>{{ "0.774170" }}</td>
                    <td>{{ (prikljucna_moc_stara * settings.vrednosti_tarif_omreznine.power).toFixed(5) }}</td>
                </tr>
                <template v-if="settings.tip_starega_obracuna === 'VT+MT'">
                    <tr>
                        <td style="text-align: left">Omrežnina VT</td>
                        <td>{{ month_data.vt_energy.toFixed(0) }}</td>
                        <td>kW</td>
                        <td>{{ "0.041820" }}</td>
                        <td>{{ (Math.round(month_data.vt_energy) * settings.vrednosti_tarif_omreznine.VT).toFixed(5) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left">Omrežnina MT</td>
                        <td>{{ month_data.mt_energy.toFixed(0) }}</td>
                        <td>kW</td>
                        <td>{{ settings.vrednosti_tarif_omreznine.MT.toFixed(6) }}</td>
                        <td>{{ (Math.round(month_data.mt_energy) * settings.vrednosti_tarif_omreznine.MT).toFixed(5) }}</td>
                    </tr>
                    <tr class="bold-row">
                        <td style="text-align: left">Skupaj omrežnina</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>{{ (Math.round(month_data.mt_energy) * settings.vrednosti_tarif_omreznine.MT + Math.round(month_data.vt_energy) * settings.vrednosti_tarif_omreznine.VT + Math.round(prikljucna_moc_stara) * settings.vrednosti_tarif_omreznine.power).toFixed(5) }}</td>
                    </tr>
                </template>
                <template v-if="settings.tip_starega_obracuna === 'ET'">
                    <tr>
                        <td style="text-align: left">Omrežnina ET</td>
                        <td>{{ Math.round(month_data.total_energy).toFixed(0) }}</td>
                        <td>kW</td>
                        <td>{{ settings.vrednosti_tarif_omreznine.ET?.toFixed(5) }}</td>
                        <td>{{ (Math.round(month_data.total_energy) * (settings.vrednosti_tarif_omreznine.ET ?? 0)).toFixed(5) }}</td>
                    </tr>
                    <tr class="bold-row">
                        <td style="text-align: left">Skupaj omrežnina</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>{{ (Math.round(month_data.total_energy) * (settings.vrednosti_tarif_omreznine.ET ?? 0) + prikljucna_moc_stara * settings.vrednosti_tarif_omreznine.power).toFixed(5) }}</td>
                    </tr>
                </template>
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

<script lang="ts">
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
.main-header {
    color: #d16f3a;
    border-top: none;

    border-bottom: 1.75px solid black;
}

.energy-table {
    width: 100%;
    border-collapse: collapse;
    margin: auto;
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
