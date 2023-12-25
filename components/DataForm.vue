<template>
    <div>
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
        <section class="new-bill-section">Tukaj bo raucn</section>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        return {};
    },
};
</script>

<style scoped>
.data-input-section {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1250px;

    margin-bottom: 50px;
}

.new-bill-section {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1250px;
    background-color: #ccc;
    text-align: center;
}
</style>
