<template>
    <div class="racunalo-content">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Header />
        <div class="page-content">
            <section class="data-input-section">
                <Fieldset legend="Spremeni vhodne podatke" :toggleable="true">
                    <PrikljucnaMocForm />
                    <div style="max-width: 1250px; display: flex; flex-direction: row; justify-content: space-between; flex-wrap: wrap; gap: 20px">
                        <Fieldset legend="Tarifa" :toggleable="true" style="flex: 33%">
                            <TarifaForm />
                        </Fieldset>
                        <UploadData style="flex: 33%" />
                        <Fieldset legend="Prispevki" :toggleable="true" style="flex: 33%">
                            <PrispevkiForm />
                        </Fieldset>
                    </div>
                </Fieldset>
            </section>
            <section class="instructions-info-section">
                <div class="instructions">
                    <h3>Navodila za uporabo:</h3>
                    <p>1. Podatke o <b>dogovorjeni moči</b> najdete na portalu <a href="https://mojelektro.si/login" target="_blank">MojElektro</a> kjer se prijavite. V meniju nato kliknemo Merilna mesta / merilne točke, kjer izberemo merilno mesto. Nato v meniju merilnega mesta izberemo Dogovorjena/obračunska moč, kjer bo izpisana moč za vsak blok.</p>
                    <p>2. Velika in mala tarifa sta podani na položnici za elektriko. Oz. če nas zanima tarifa za naseldnje leto kliknemo <a href="https://www.elektro-energija.si/za-dom/dokumenti-in-ceniki" target="_blank">tu</a>. Vnesemo vrednosti brez DDV.</p>
                    <p>3. Tudi podatke datoteko z <b>15 minutnimi meritvami</b> najedemo na portalu <a href="https://mojelektro.si/login" target="_blank">MojElektro</a> na izbranem merilnem mestu pod 15 minutni podatki. Izvozimo <b>Excel datoteko</b> za poljubni MESEC ali LETO oz. poljubno obdobje. Za dober pregled nad primerjavo letnih stroškov EE je najlažje vnesti datoteko z podatki za leto 2023.</p>
                    <p>4. Kliknemo <b>Izračunaj</b> in izpisal se nam bo prenovljenei račun za elektriko z novimi tarifami.</p>
                </div>
                <div class="info">
                    <h3>Informacije o računalu:</h3>
                    <p>1. Vnešeni podatki se ne pošljejo nikamor, ker se vsi računi izvedejo v brskalniku pri uporabniku.</p>
                    <p>2. Za samooskrbne uporabnike bo izračun dodan kmalu.</p>
                </div>
            </section>
        </div>
        <div class="data-display" v-if="useIsTable().value === true" style="padding: 20px">
            <div class="data-tables">
                <DisplayMonthsData />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { usePrikljucnaMocPrices } from "~/composables/stanja";

export default {
    setup() {
        const is_table = useIsTable();

        onMounted(() => {
            // Get local storage data
            const data = localStorage.getItem("prikljucna_moc");
            if (data) usePrikljucnaMoc().value = JSON.parse(data);
            const vrednosti_tarif = localStorage.getItem("vrednosti_tarif");
            if (vrednosti_tarif) useSettings().value.vrednosti_tarif = JSON.parse(vrednosti_tarif);
            const tip_starega_obracuna = localStorage.getItem("tip_starega_obracuna");
            if (tip_starega_obracuna) useSettings().value.tip_starega_obracuna = tip_starega_obracuna as "VT+MT" | "ET" | null;
            const stara_prikljucna_moc = localStorage.getItem("stara_prikljucna_moc");
            if (stara_prikljucna_moc) usePrikljucnaMocStara().value = JSON.parse(stara_prikljucna_moc);

            // Set prices for prikljucna moc
            const tarife = getTarifeData();
            const blok_price_data = usePrikljucnaMocPrices().value;
            for (let i = 0; i < blok_price_data.length; i++) {
                const skupna_tarifna_moc = tarife[i + 1].prenos.tarifna_postavka_P + tarife[i + 1].distribucija.tarifna_postavka_P;
                blok_price_data[i] = skupna_tarifna_moc * usePrikljucnaMoc().value[i];
            }
        });

        return {
            is_table,
        };
    },
};
</script>

<style scoped>
.racunalo-content {
}

.page-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    flex-wrap: wrap;

    max-width: 2500px;
    margin: auto;
}
.data-input-section {
    flex: 45%;

    display: flex;
    flex-direction: column;
    gap: 25px;

    margin: auto;
    margin-bottom: 50px;
    margin-top: 0px;

    max-width: 1400px;
}

.new-bill-section {
    flex: 55%;
    vertical-align: top;

    padding: 0px 25px;

    display: flex;
    flex-direction: column;
    text-align: center;
}

.instructions-info-section {
    flex: 25%;

    padding: 0px 25px;

    display: flex;
    flex-direction: column;
    text-align: center;
}

.instructions p {
    margin: 0px;
    margin-bottom: 10px;

    text-align: justify;
    text-justify: inter-word;
}

.info p {
    margin: 0px;
    margin-bottom: 10px;

    text-align: justify;
    text-justify: inter-word;
}

.data-display {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;

    margin: auto;
    margin-bottom: 50px;
    margin-top: 0px;

    max-width: 1400px;
}

.data-tables {
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
