<template>
    <div>
        <Header />
        <div class="index-content">
            <section class="data-input-section">
                <PrikljucnaMocForm />
                <div style="max-width: 1250px; display: flex; flex-direction: row; justify-content: space-between; flex-wrap: wrap">
                    <Fieldset legend="Tarifa" :toggleable="true">
                        <TarifaForm />
                    </Fieldset>
                    <Fieldset legend="Prispevki" :toggleable="true">
                        <PrispevkiForm />
                    </Fieldset>
                </div>
                <UploadData />
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
        const title = "Primerjalnik";
        const is_table = useIsTable();
        const items = ref([
            {
                label: "Podatki",
                icon: "pi pi-home",
            },
            {
                label: "Račun",
                icon: "pi pi-chart-line",
            },
            {
                label: "Analiza",
                icon: "pi pi-list",
            },
        ]);

        onMounted(() => {
            //include script in header
            const script = document.createElement("script");
            script.src = "https://unpkg.com/xlsx/dist/xlsx.full.min.js";
            document.head.appendChild(script);
        });

        return {
            title,
            is_table,
            items,
        };
    },
};
</script>

<style scoped>
.index-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}
.data-input-section {
    flex: 60%;

    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1250px;
    margin-bottom: 50px;
}

.new-bill-section {
    flex: 40%;
    vertical-align: top;

    display: flex;
    flex-direction: column;
    max-width: 1250px;
    background-color: #ccc;
    text-align: center;
}
</style>
