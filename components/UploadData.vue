<template>
    <div class="upload-data-component">
        <h2>Uvozi mesečne 15-min podatke iz MojElektro</h2>
        <div class="buttons">
            <div style="text-align: center; font-size: 12px">
                <FileUpload mode="basic" accept=".xlsx, .xls" :auto="true" chooseLabel="Browse" :maxFileSize="10000000" @select="handleFileUpload($event)" class="customized-upload" style="font-size: 11px" />
            </div>
            <Button @click="processData()" severity="warning" style="max-width: 120px; text-align: center; margin: auto; font-size: 13px" :disabled="is_button_disabled">Izračunaj</Button>
        </div>
        <div v-if="data_file" style="text-align: center">
            <p>Datoteka:</p>
            <div @click="clearFile" class="file-data" style="cursor: pointer">
                <SvgsExcelIcon :width="30" :height="30" />
                {{ data_file.name }}
            </div>
        </div>
        <div class="rectangle-popup" v-if="on_going_calculation">
            <ProgressSpinner></ProgressSpinner>
            Izracunavam
        </div>
    </div>
</template>

<script lang="ts">
import type { FileUploadSelectEvent } from "primevue/fileupload";
import { parseDocumentData } from "~/composables/documentParser";

export default {
    setup() {
        const data_file = ref<File | null>(null);
        const prikljucna_moc = usePrikljucnaMoc();
        const settings = useSettings();
        const is_button_disabled = ref(true);
        const uploaded_files = ref<File[]>([]); // New data property
        const on_going_calculation = ref(false);

        const handleFileUpload = (event: FileUploadSelectEvent) => {
            const files = event.files;

            if (files && files.length > 0) {
                console.log("File uploaded"); //! Dev
                data_file.value = files[0];
                // first clear uploade
                uploaded_files.value.push(files[0]); // Store uploaded file in the uploaded_files array
            }
            // console.log("DATAFILE: "); //! Dev
            // console.log(data_file.value); //! Dev
        };

        // Enable button if file and tarifs are set
        watch(
            [data_file, settings],
            (value) => {
                data_file.value && settings.value.tip_starega_obracuna ? (is_button_disabled.value = false) : (is_button_disabled.value = true);
            },
            { deep: true }
        );

        const processData = async () => {
            is_button_disabled.value = true;
            useIsTable().value = false;
            on_going_calculation.value = true;
            useResetData(); // Reset data

            if (data_file.value) await parseDocumentData(data_file.value);
            else throw new Error("No file uploaded");

            // console.log(useExcelData().value); //! Dev
            console.log("Processing data"); //! Dev

            parseEnergyBlocks();
            on_going_calculation.value = false;
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
            uploaded_files,
            on_going_calculation,
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

.buttons {
    display: flex;
    flex-direction: row;
    margin: auto;
    gap: 30px;

    flex-wrap: wrap;
}

.file-data {
    margin: auto;
    border: 1px solid black;
    border-radius: 5px;
    padding: 4px 8px;
    width: 250px;
    word-wrap: break-word; /* Allows long words to break and wrap */
    white-space: normal; /* Ensures whitespace is handled normally */
}

.warning {
    margin: 10px auto;
    text-align: center;
    font-size: 12px;
    color: red;
}

.rectangle-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    width: 100%;
    height: 100%;

    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);

    color: white;

    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
