<template>
    <div class="racunalo-content">
        <Header />
        <div class="index-content">
            <section class="data-input-section">
                <PrikljucnaMocForm />
                <div style="max-width: 1250px; display: flex; flex-direction: row; justify-content: space-between; flex-wrap: wrap">
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
            </section>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const is_table = useIsTable();

        useHead({
            title: "Primerjalnk cen Električne energije 2024",
            meta: [
                {
                    name: "description",
                    content: "Primerjalnik cen električne energije za leto 2024 in novi tarifni sistem",
                },
            ],
            htmlAttrs: { lang: "si" },
            link: [{ rel: "canonical", href: "https://novi-obracun-e76cc111cabe.herokuapp.com/" }],
        });

        useSeoMeta({
            title: "Primerjalnik cen električne energije 2024",
            ogTitle: "Primerjalnik cen električne energije 2024",
            description: "Primerjalnik cen električne energije 2024",
            ogDescription: "Primerjalnik cen 2024 za električno energijo",
        });

        onMounted(() => {
            //include script in header
            const script = document.createElement("script");
            script.src = "https://unpkg.com/xlsx/dist/xlsx.full.min.js";
            document.head.appendChild(script);
        });

        return {
            is_table,
        };
    },
};
</script>

<style scoped>
.racunalo-content {
    background-color: white;
    width: 100%;
    /* height: 100vh; */
    height: 100%;
}

.index-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    flex-wrap: wrap;
}
.data-input-section {
    flex: 55%;

    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1000px;
    margin-bottom: 50px;
    margin-top: 0px;
}

.new-bill-section {
    flex: 45%;
    vertical-align: top;

    display: flex;
    flex-direction: column;
    max-width: 1250px;
    text-align: center;
}
</style>
