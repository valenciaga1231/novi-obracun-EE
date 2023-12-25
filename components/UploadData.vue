<template>
    <div class="upload-data-component">
        <h2>Uvozi mesečne 15-min podatke iz MojElektro</h2>
        <div style="text-align: center; margin-bottom: 15px; font-size: 12px">
            <FileUpload mode="basic" accept=".xlsx, .xls, .csv" :maxFileSize="1000000" @select="handleFileUpload($event)" @clear="clearFile()" style="max-width: 900px; font-size: 14px" />
        </div>
        <Button @click="processData" severity="info" style="max-width: 120px; text-align: center; margin: auto" :disabled="is_button_disabled">Izračunaj</Button>
    </div>
</template>

<script lang="ts">
import type { FileUploadSelectEvent } from "primevue/fileupload";

export default {
    setup() {
        const data_file = ref<File | null>(null);
        const prikljucna_moc = usePrikljucnaMoc();
        const settings = useSettings();
        const is_button_disabled = ref(true);

        const handleFileUpload = (event: FileUploadSelectEvent) => {
            const files = event.files;
            console.log(files);

            if (files && files.length > 0) {
                console.log("File uploaded"); //! Dev
                data_file.value = files[0];
            }
        };

        // Enable button if file and tarifs are set
        watch([data_file, settings], (value) => (data_file.value && settings.value.tip_starega_obracuna ? (is_button_disabled.value = false) : (is_button_disabled.value = true)), { deep: true });

        const processData = async () => {
            useResetData(); // Reset data

            if (data_file.value) await useUploadDocument(data_file.value);
            else throw new Error("No file uploaded");

            console.log(useExcelData().value);
            console.log("Processing data"); //! Dev

            parseEnergyBlocks();
            useIsTable().value = true;
        };

        const clearFile = () => (data_file.value = null);
        return {
            handleFileUpload,
            processData,
            clearFile,
            prikljucna_moc,
            settings,
            data_file,
            is_button_disabled,
        };
    },
};
</script>

<style scoped>
.upload-data-component {
    display: flex;
    flex-direction: column;
    margin: auto;
}

h2 {
    margin-bottom: 10px;
    text-align: center;
}
</style>
