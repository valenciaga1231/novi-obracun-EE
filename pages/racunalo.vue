<template>
    <div class="racunalo-content">
        <Header />
        <div class="page-content">
            <section class="data-input-section">
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
            </section>
            <section v-if="is_table" class="new-bill-section">
                <div>
                    <NoviRacun />
                </div>
                <Button label="Primerjaj novi/stari racun" icon="pi pi-window-maximize" @click="useIsPrimerjavaModal().value = true" style="max-width: 250px; margin: auto" />
            </section>
        </div>
        <NoviStariPrimerjava v-if="useIsPrimerjavaModal().value" />
    </div>
</template>

<script lang="ts">
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

            // Dobi vrednosti tarif
            const blok_data = useBlokData().value;
            const tarife = getTarifeData();
            for (const blok in useBlokData().value) {
                // Doloci skupno tarifo omreznine za moc
                blok_data[blok].skupna_tarifa_moc = tarife[blok].prenos.tarifna_postavka_P + tarife[blok].distribucija.tarifna_postavka_P;

                // Doloci skupno ceno omreznine za moc
                const id = parseInt(blok) - 1;
                blok_data[blok].cena_omreznine_moci = blok_data[blok].skupna_tarifa_moc * usePrikljucnaMoc().value[id];
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

    max-width: 1250px;
}

.new-bill-section {
    flex: 55%;
    vertical-align: top;

    padding: 0px 25px;

    display: flex;
    flex-direction: column;
    text-align: center;
}
</style>
