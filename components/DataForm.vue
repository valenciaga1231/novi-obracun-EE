<template>
    <div>
        <div class="input-container">
            <h3>Podatki o priključni moči:</h3>
            <div>
                <span class="input-text">Blok 1:</span>
                <input id="1" type="text" class="input-field" v-model="prikljucna_moc[0]" />
                <span class="input-text">kW</span>
                <button @click="handleUpClick(1)">Up</button>
                <button @click="handleDownClick(1)">Down</button>
            </div>
            <div>
                <span class="input-text">Blok 2:</span>
                <input id="2" type="text" class="input-field" v-model="prikljucna_moc[1]" />
                <span class="input-text">kW</span>
                <button @click="handleUpClick(2)">Up</button>
                <button @click="handleDownClick(2)">Down</button>
            </div>
            <div>
                <span class="input-text">Blok 3:</span>
                <input id="3" type="text" class="input-field" v-model="prikljucna_moc[2]" />
                <span class="input-text">kW</span>
                <button @click="handleUpClick(3)">Up</button>
                <button @click="handleDownClick(3)">Down</button>
            </div>
            <div>
                <span class="input-text">Blok 4:</span>
                <input id="4" type="text" class="input-field" v-model="prikljucna_moc[3]" />
                <span class="input-text">kW</span>
                <button @click="handleUpClick(4)">Up</button>
                <button @click="handleDownClick(4)">Down</button>
            </div>
            <div>
                <span class="input-text">Blok 5:</span>
                <input id="5" type="text" class="input-field" v-model="prikljucna_moc[4]" />
                <span class="input-text">kW</span>
                <button @click="handleUpClick(5)">Up</button>
                <button @click="handleDownClick(5)">Down</button>
            </div>
        </div>
        <div>
            <h3>Podatki o tarifi:</h3>
            <select>
                <option value="1">MT/VT</option>
                <option value="2">ET</option>
            </select>
        </div>
        <div>
            <h3>Podatki o trenutni priključni moči:</h3>
            <select>
                <option value="1">7 kW in 1x32A</option>
                <option value="2">7 kW in 3x16A</option>
            </select>
        </div>
        <div>
            <div v-if="prispevki">
                <h3>Upostevaj prispevke:</h3>
                <input type="checkbox" v-model="prispevki.operater_trga.is_active" />
                <label for="checkbox1">Za operaterja trga</label>
                <br />
                <input type="checkbox" v-model="prispevki.energetsko_ucinkovitost.is_active" />
                <label for="checkbox2">Za energetsko učinkovistos</label>
                <br />
                <input type="checkbox" v-model="prispevki.spte_ove.is_active" />
                <label for="checkbox3">Za SPTE in OVE</label>
            </div>
        </div>
        <h3>Uvozi 15min podatke iz MojElektro:</h3>
        <input type="file" @click="handleFileUpload" />
        <button type="submit" @click="processData">Izračunaj</button>
    </div>
</template>

<script lang="ts">
import type { PrikljucnaMoc } from "~/types";

export default {
    setup() {
        const data_file = ref<File | null>(null);
        const prikljucna_moc = usePrikljucnaMoc();
        const prispevki = usePrispevki();
        const is_being_edited = ref(false);

        const handleFileUpload = (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                console.log("File uploaded"); //! Dev
                data_file.value = files[0];
            }
        };

        const processData = async () => {
            if (data_file.value) await useUploadDocument(data_file.value);
            else throw new Error("No file uploaded");

            console.log(useExcelData().value);
            console.log("Processing data"); //! Dev

            parseEnergyBlocks();
            useIsTable().value = true;
        };

        const handleUpClick = (id: number) => {
            const input_field = document.getElementById(id.toString()) as HTMLInputElement;
            const input_value = parseFloat(input_field.value);
            input_field.value = (input_value + 0.1).toFixed(1).toString();
            handleInputChange(id);
        };

        const handleDownClick = (id: number) => {
            const input_field = document.getElementById(id.toString()) as HTMLInputElement;
            const input_value = parseFloat(input_field.value);
            input_field.value = (input_value - 0.1).toFixed(1).toString();
            handleInputChange(id);
        };

        const handleInputChange = (id: number) => {
            const input_fields = document.getElementsByClassName("input-field");
            const input_values = Array.from(input_fields).map((input_field) => parseFloat((input_field as HTMLInputElement).value)) as PrikljucnaMoc;

            // only check the input_id in input_values array, and if it is greater than the one behind it in array, set it to the value behind it
            if (input_values[id - 1] > input_values[id]) {
                (input_fields[id - 1] as HTMLInputElement).value = input_values[id].toString();
                input_values[id - 1] = input_values[id];
            }
            if (input_values[id - 1] < input_values[id - 2]) {
                (input_fields[id - 1] as HTMLInputElement).value = input_values[id - 2].toString();
                input_values[id - 1] = input_values[id - 2];
            }

            // Posodobi prikljucne moci
            usePrikljucnaMoc().value = input_values;

            // Ponovno izracunaj omreznino za moc in presezno moc
            izracunajOmrezninoMoci();
            izracunajPreseznoMoc();
            izracunajCenoPresezneMoci();
            dolociTarifeZaBlok();
        };

        return {
            handleFileUpload,
            processData,
            handleInputChange,
            handleUpClick,
            handleDownClick,
            prikljucna_moc,
            prispevki,
        };
    },
};
</script>

<style scoped>
.input-container {
    display: flex;
    flex-direction: column;
}

.input-field {
    padding: 5px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    max-width: 25px;
    margin: 10px;
    outline: none;
}
</style>
