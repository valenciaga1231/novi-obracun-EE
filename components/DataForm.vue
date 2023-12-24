<template>
    <div>
        <PrikljucnaMocForm />
        <div>
            <h3>Podatki o tarifi:</h3>
            <select v-model="settings.tip_starega_obracuna">
                <option value="VT+MT">MT/VT</option>
                <option value="ET">ET</option>
            </select>
            <div v-if="settings.tip_starega_obracuna === 'VT+MT'">
                <div>
                    <span>MT:</span>
                    <input type="text" v-model="settings.vrednosti_tarif.MT" />
                </div>
                <div>
                    <span>VT:</span>
                    <input type="text" v-model="settings.vrednosti_tarif.VT" />
                </div>
            </div>
            <div v-if="settings.tip_starega_obracuna === 'ET'">
                <div>
                    <span>Input 1:</span>
                    <input type="text" v-model="settings.vrednosti_tarif.ET" />
                </div>
            </div>
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
        <input type="file" @change="handleFileUpload($event)" accept="pdf/*" />
        <button type="submit" @click="processData">Izračunaj</button>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const data_file = ref<File | null>(null);
        const prikljucna_moc = usePrikljucnaMoc();
        const prispevki = usePrispevki();
        const is_being_edited = ref(false);
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
            prispevki,
            settings,
        };
    },
};
</script>

<style scoped></style>
