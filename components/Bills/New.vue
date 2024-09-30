<template>
    <div class="novi-racun-component">
        <div class="h-20" style="display: flex; justify-content: space-evenly">
            <div style="display: flex; flex-direction: column; justify-content: space-between; margin: 10px 20px">
                <h3 style="font-size: 24px; font-weight: bold">Novi račun</h3>
            </div>
            <div>
                <p v-if="month_data.date.start && month_data.date.end" style="text-align: center"><b>Datum: </b>{{ month_data.date.start.toLocaleDateString("en-GB").replace(/\//g, ".") }} do {{ month_data.date.end.toLocaleDateString("en-GB").replace(/\//g, ".") }}</p>
                <p class="price-window">
                    <b>Cena: </b> <span class="price">{{ (sumMonthCosts(props.month) * 1.22).toFixed(2) }} </span>
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
            <tbody>
                <template v-if="settings.tip_novega_obracuna === 'VT+MT'">
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
                <template v-if="settings.tip_novega_obracuna === 'ET'">
                    <tr class="energija-ET">
                        <td style="text-align: left">Električna energija ET</td>
                        <td>{{ Math.round(month_data.mt_energy + month_data.vt_energy).toFixed(0) }}</td>
                        <td>kWh</td>
                        <td>{{ useSettings().value.vrednosti_tarif.ET.toFixed(6) }}</td>
                        <td>{{ (Math.round(month_data.mt_energy + month_data.vt_energy) * settings.vrednosti_tarif.ET).toFixed(5) }}</td>
                    </tr>
                    <tr class="bold-row">
                        <td style="text-align: left">Skupaj el. energija</td>
                        <td>{{ (month_data.mt_energy + month_data.vt_energy).toFixed(0) }}</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                        <td>{{ (Math.round(month_data.mt_energy + month_data.vt_energy) * settings.vrednosti_tarif.ET).toFixed(5) }}</td>
                    </tr>
                </template>
                <tr>
                    <td style="text-align: left">Omrežnina za energijo</td>
                </tr>
                <template v-for="(data, blok) in month_data.blok_data" :key="blok">
                    <tr v-if="data.is_active">
                        <td class="pl-5" style="text-align: left; padding-left: 20px">Energija časovni blok {{ blok }}</td>
                        <td>{{ data.energija.toFixed(2) }}</td>
                        <td>kWh</td>
                        <td>{{ data.skupna_tarifa_energija.toFixed(6) }}</td>
                        <td>{{ data.cena_omreznine_energije.toFixed(5) }}</td>
                    </tr>
                </template>
                <tr>
                    <td style="text-align: left">Omrežnina za obračunsko moč</td>
                </tr>
                <template v-for="(data, blok) in month_data.blok_data" :key="blok">
                    <tr v-if="data.is_active">
                        <td style="text-align: left; padding-left: 20px">Dogovorjena moč blok {{ blok }}</td>
                        <td>{{ prikljucna_moc[blok - 1] }}</td>
                        <td>kW</td>
                        <td>{{ data.skupna_tarifa_moc.toFixed(6) }}</td>
                        <td>{{ data.cena_omreznine_moci.toFixed(5) }}</td>
                    </tr>
                </template>
                <tr v-if="hasPreseznaMoc()">
                    <td style="text-align: left">Presežna moč</td>
                </tr>
                <template v-for="(data, blok) in month_data.blok_data" :key="blok">
                    <tr v-if="data.is_active && data.cena_presezne_moci > 0">
                        <td style="text-align: left; padding-left: 20px">Presežna moč blok {{ blok }}</td>
                        <td>{{ data.presezna_moc.toFixed(5) }}</td>
                        <td>kW</td>
                        <td>{{ data.skupna_tarifa_presezna_moc.toFixed(6) }}</td>
                        <td>{{ data.cena_presezne_moci.toFixed(5) }}</td>
                    </tr>
                </template>
                <tr class="bold-row">
                    <td style="text-align: left">Skupaj omrežnine:</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.</td>
                    <td>{{ sestejVsoOmreznino(props.month).toFixed(5) }}</td>
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
                <tr class="bold-row" style="border-top: 1.75px solid black; height: 35px">
                    <td style="text-align: left">Skupaj (brez DDV)</td>
                    <td colspan="3"></td>
                    <td>{{ sumMonthCosts(props.month).toFixed(2) }}</td>
                </tr>
                <tr class="bold-row" style="border-top: 1.75px solid black; height: 35px">
                    <td style="text-align: left">Skupaj (z DDV)</td>
                    <td colspan="3"></td>
                    <td>{{ (sumMonthCosts(props.month) * 1.22).toFixed(2) }}</td>
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
        const prikljucna_moc = usePrikljucnaMoc();
        const prikljucna_moc_stara = usePrikljucnaMocStara();
        const settings = useSettings();
        const month_data = useMonthsArray().value[props.month];

        const hasPreseznaMoc = () => {
            return Object.values(month_data.blok_data).some((data) => data.is_active && data.presezna_moc > 0);
        };

        return {
            props,
            prikljucna_moc,
            prikljucna_moc_stara,
            settings,
            month_data,
            hasPreseznaMoc,
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
