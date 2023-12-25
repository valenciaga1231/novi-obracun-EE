<template>
    <div class="prikljucna-moc-component">
        <h2>Podatki o dogovorjeni moči:</h2>
        <div class="prikljucna-moc-container">
            <Card class="custom-card">
                <template #title class="custom-title"><span>Blok 1</span></template>
                <template #content>
                    <div class="dogovorjena-moc-row">
                        <input id="1" type="text" class="input-field" v-model="prikljucna_moc[0]" />
                        <div class="dogovorjena-moc-update">
                            <button @click="handleUpClick(1)">+</button>
                            <button @click="handleDownClick(1)">-</button>
                        </div>
                        <span class="input-text"><b> kW</b></span>
                    </div>
                    <p style="text-align: center">
                        Cena: <b>{{ useBlokData().value[1].cena_omreznine_moci.toFixed(2) }}</b> €
                    </p>
                </template>
            </Card>
            <Card class="custom-card">
                <template #title class="custom-title"><span>Blok 2</span></template>
                <template #content>
                    <div class="dogovorjena-moc-row">
                        <input id="2" type="text" class="input-field" v-model="prikljucna_moc[1]" />
                        <div class="dogovorjena-moc-update">
                            <button @click="handleUpClick(2)">+</button>
                            <button @click="handleDownClick(2)">-</button>
                        </div>
                        <span class="input-text"><b> kW</b></span>
                    </div>
                    <p style="text-align: center">
                        Cena: <b>{{ useBlokData().value[2].cena_omreznine_moci.toFixed(2) }}</b> €
                    </p>
                </template>
            </Card>
            <Card class="custom-card">
                <template #title class="custom-title"><span>Blok 3</span></template>
                <template #content>
                    <div class="dogovorjena-moc-row">
                        <input id="3" type="text" class="input-field" v-model="prikljucna_moc[2]" />
                        <div class="dogovorjena-moc-update">
                            <button @click="handleUpClick(3)">+</button>
                            <button @click="handleDownClick(3)">-</button>
                        </div>
                        <span class="input-text"><b> kW</b></span>
                    </div>
                    <p style="text-align: center">
                        Cena: <b>{{ useBlokData().value[3].cena_omreznine_moci.toFixed(2) }}</b> €
                    </p>
                </template>
            </Card>
            <Card class="custom-card">
                <template #title class="custom-title"><span>Blok 4</span></template>
                <template #content>
                    <div class="dogovorjena-moc-row">
                        <input id="4" type="text" class="input-field" v-model="prikljucna_moc[3]" />
                        <div class="dogovorjena-moc-update">
                            <button @click="handleUpClick(4)">+</button>
                            <button @click="handleDownClick(4)">-</button>
                        </div>
                        <span class="input-text"><b> kW</b></span>
                    </div>
                    <p style="text-align: center">
                        Cena: <b>{{ useBlokData().value[4].cena_omreznine_moci.toFixed(2) }}</b> €
                    </p>
                </template>
            </Card>
            <Card class="custom-card">
                <template #title class="custom-title"><span>Blok 5</span></template>
                <template #content>
                    <div class="dogovorjena-moc-row">
                        <input id="5" type="text" class="input-field" v-model="prikljucna_moc[4]" />
                        <div class="dogovorjena-moc-update">
                            <button @click="handleUpClick(5)">+</button>
                            <button @click="handleDownClick(5)">-</button>
                        </div>
                        <span class="input-text"><b> kW</b></span>
                    </div>
                    <p style="text-align: center">
                        Cena: <b>{{ useBlokData().value[5].cena_omreznine_moci.toFixed(2) }}</b> €
                    </p>
                </template>
            </Card>
        </div>
        <div class="all-buttons">
            <div>Spremeni vse bloke:</div>
            <div><Button label="Vse +0.1" @click="handleAllClick(0.1)" rounded /> <Button label="Vse -0.1" @click="handleAllClick(-0.1)" severity="secondary" rounded /></div>
        </div>
    </div>
</template>
<script lang="ts">
import type { PrikljucnaMoc } from "~/types";
export default {
    setup() {
        const prikljucna_moc = usePrikljucnaMoc();
        const prispevki = usePrispevki();
        const settings = useSettings();
        const timeout = ref<NodeJS.Timeout | null>(null);
        const blok_data = useBlokData();
        const tarife_data = getTarifeData();

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

        const handleAllClick = (value: number) => {
            const input_fields = document.getElementsByClassName("input-field"); // Get all inputs
            const input_values = Array.from(input_fields).map((input_field) => parseFloat((input_field as HTMLInputElement).value)) as PrikljucnaMoc; // Get all inputs current values
            const new_input_values = input_values.map((input_value) => (input_value + value).toFixed(1)); // Create new array of input values

            for (let i = 0; i < input_fields.length; i++) {
                (input_fields[i] as HTMLInputElement).value = new_input_values[i]; // Assign new values to inputs
                usePrikljucnaMoc().value[i] = parseFloat(new_input_values[i]); // Posodobi prikljucne moci
            }

            // Add green border if value is positive, gray if negative
            for (let i = 0; i < input_fields.length; i++) {
                const input_field = input_fields[i] as HTMLInputElement;
                if (value < 0) {
                    input_field.classList.remove("green-border");
                    input_field.classList.add("gray-border");
                } else {
                    input_field.classList.remove("gray-border");
                    input_field.classList.add("green-border");
                }
            }

            // Set timeout to remove border after 1.5s or extend it if there is already one scheduled
            if (!timeout.value) {
                timeout.value = setTimeout(() => {
                    for (let i = 0; i < input_fields.length; i++) {
                        const input_field = input_fields[i] as HTMLInputElement;
                        input_field.classList.remove("green-border");
                        input_field.classList.remove("gray-border");
                    }
                    timeout.value = null;
                }, 800);
            } else {
                clearTimeout(timeout.value);
                timeout.value = setTimeout(() => {
                    for (let i = 0; i < input_fields.length; i++) {
                        const input_field = input_fields[i] as HTMLInputElement;
                        input_field.classList.remove("green-border");
                        input_field.classList.remove("gray-border");
                    }
                    timeout.value = null;
                }, 800);
            }

            // Set prikljucna moc to local storage
            localStorage.setItem("prikljucna_moc", JSON.stringify(new_input_values));

            // Ponovno izracunaj omreznino za moc in presezno moc
            izracunajOmrezninoMoci();
            izracunajPreseznoMoc();
            izracunajCenoPresezneMoci();
            dolociTarifeZaBlok();
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

            // Set prikljucna moc to local storage
            localStorage.setItem("prikljucna_moc", JSON.stringify(input_values));

            // Ponovno izracunaj omreznino za moc in presezno moc
            izracunajOmrezninoMoci();
            izracunajPreseznoMoc();
            izracunajCenoPresezneMoci();
            dolociTarifeZaBlok();
        };

        return {
            handleInputChange,
            handleUpClick,
            handleDownClick,
            handleAllClick,
            prikljucna_moc,
            prispevki,
            settings,
            blok_data,
            tarife_data,
        };
    },
};
</script>

<style scoped>
.prikljucna-moc-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    margin: 0 30px;
    flex-wrap: wrap;
}

h2 {
    margin-bottom: 10px;
    text-align: center;
}
.custom-card {
    max-height: 260px;
    margin-bottom: 10px;
    max-width: 225px;
}
.dogovorjena-moc-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    max-width: 200px;
    margin-bottom: 10px;
    max-height: 200px;
}

.input-text {
    margin-left: 10px;
    font-style: bold;
}

.input-field {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 18px;
    width: 60px;
    outline: none;
}
.dogovorjena-moc-update {
    margin-left: 2px;
    display: flex;
    flex-direction: column;
}

.dogovorjena-moc-update button {
    cursor: pointer;
}

.all-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.green-border {
    box-shadow: 0 0 0 3px #059669;
}

.gray-border {
    box-shadow: 0 0 0 3px #475569;
}

@media (max-width: 600px) {
    .input-field {
        width: 50px;
        font-size: 12px;
    }

    .custom-card {
        width: 150px;
    }
    .custom-title {
        font-size: 12px;
    }

    h2 {
        font-size: 16px;
    }
    p {
        font-size: 12px;
    }
    b {
        font-size: 12px;
    }

    span {
        font-size: 15px;
    }
}
</style>
