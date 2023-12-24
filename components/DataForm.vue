<template>
    <div>
        <section class="data-input-section">
            <PrikljucnaMocForm />
            <div style="max-width: 1250px; display: flex; flex-direction: row; justify-content: space-between">
                <TarifaForm />
                <PrispevkiForm />
            </div>
            <h3>Uvozi 15min podatke iz MojElektro:</h3>
            <input type="file" @change="handleFileUpload($event)" accept="pdf/*" />
            <button type="submit" @click="processData">Izračunaj</button>
        </section>
        <section class="new-bill-section">Tukaj bo raucn</section>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const data_file = ref<File | null>(null);
        const prikljucna_moc = usePrikljucnaMoc();
        const settings = useSettings();

        const handleFileUpload = (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                console.log("File uploaded"); //! Dev
                data_file.value = files[0];
            }
        };

        const processData = async () => {
            useResetData(); // Reset data

            if (data_file.value) await useUploadDocument(data_file.value);
            else throw new Error("No file uploaded");

            console.log(useExcelData().value);
            console.log("Processing data"); //! Dev

            parseEnergyBlocks();
            useIsTable().value = true;
        };

        return {
            handleFileUpload,
            processData,
            prikljucna_moc,
            settings,
        };
    },
};
</script>

<style scoped>
.data-input-section {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1250px;
}
</style>
