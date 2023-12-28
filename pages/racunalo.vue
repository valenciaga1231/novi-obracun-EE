<template>
    <div class="racunalo-content">
        <Header />
        <div class="page-content">
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
