<template>
    <div class="upload-data-component">
        <h2>Uvozi mesečne 15-min podatke iz MojElektro</h2>
        <div class="buttons">
            <div style="text-align: center; font-size: 12px">
                <FileUpload mode="basic" accept=".xlsx, .xls" :auto="true" chooseLabel="Browse" :maxFileSize="10000000" @select="handleFileUpload($event)" class="customized-upload" style="font-size: 11px" />
            </div>
            <div>
                <Button @click="processData()" severity="warn" style="max-width: 120px; text-align: center; margin: auto; font-size: 13px" :disabled="isButtonDisabled">Izračunaj</Button>
            </div>
        </div>
        <p v-if="isButtonDisabled" class="text-xs text-center">Pred klikom na izračun morajo biti vnečeni podatki na poljih, ki so obarvana z rdečo in vnešena XLSX datoteka.</p>
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
        const settings = useSettings();
        const uploaded_files = ref<File[]>([]); // New data property
        const on_going_calculation = ref(false);

        const handleFileUpload = (event: FileUploadSelectEvent) => {
            const files = event.files;

            if (files && files.length > 0) {
                console.log("File uploaded"); //! Dev
                data_file.value = files[0];
                uploaded_files.value.push(files[0]); // Store uploaded file in the uploaded_files array
            }
            // console.log("DATAFILE: "); //! Dev
            // console.log(data_file.value); //! Dev
        };

        const processData = async () => {
            if (on_going_calculation.value) return; // Prevent multiple clicks

            on_going_calculation.value = true;
            useIsTable().value = false;
            useResetData(); // Reset data

            try {
                console.log("Reading data from file"); //! Dev
                if (data_file.value) await parseDocumentData(data_file.value);
                else throw new Error("No file uploaded");

                parseEnergyBlocks();
            } catch (error) {
                console.error("Error during processing:", error);
            } finally {
                setTimeout(() => (on_going_calculation.value = false), 500); // Prevent multiple clicks
                useIsTable().value = true;
            }
        };

        // Computed property to determine if the button should be disabled
        const isButtonDisabled = computed(() => {
            return !data_file.value || !settings.value.tip_starega_obracuna || on_going_calculation.value || settings.value.vrednosti_tarif_omreznine.label === "Not defined";
        });

        const clearFile = () => (data_file.value = null);

        return {
            handleFileUpload,
            processData,
            clearFile,
            settings,
            data_file,
            isButtonDisabled,
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
