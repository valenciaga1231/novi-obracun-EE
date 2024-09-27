<template>
    <div class="prikljucna-moc-component">
        <h2>Podatki o dogovorjeni obračunski moči:</h2>
        <div class="flex flex-col flex-wrap">
            <div class="prikljucna-moc-inputs flex flex-col gap-3">
                <div>
                    Blok 1
                    <InputNumber class="ml-1" v-model="prikljucna_moc[0]" showButtons buttonLayout="horizontal" mode="decimal" suffix=" kW" :min="0" :max="100" :step="0.1" inputClass="enabled:pointer-events-none" @input="inputUpdated" fluid />
                </div>
                <div>
                    Blok 2
                    <InputNumber class="ml-1" v-model="prikljucna_moc[1]" showButtons buttonLayout="horizontal" mode="decimal" suffix=" kW" :min="0" :max="100" :step="0.1" inputClass="enabled:pointer-events-none" @input="inputUpdated" fluid />
                </div>
                <div>
                    Blok 3
                    <InputNumber class="ml-1" v-model="prikljucna_moc[2]" showButtons buttonLayout="horizontal" mode="decimal" suffix=" kW" :min="0" :max="100" :step="0.1" inputClass="enabled:pointer-events-none" @input="inputUpdated" fluid />
                </div>
                <div>
                    Blok 4
                    <InputNumber class="ml-1" v-model="prikljucna_moc[3]" showButtons buttonLayout="horizontal" mode="decimal" suffix=" kW" :min="0" :max="100" :step="0.1" inputClass="enabled:pointer-events-none" @input="inputUpdated" fluid />
                </div>
                <div>
                    Blok 5
                    <InputNumber class="ml-1" v-model="prikljucna_moc[4]" showButtons buttonLayout="horizontal" mode="decimal" suffix=" kW" :min="0" :max="100" :step="0.1" inputClass="enabled:pointer-events-none" @input="inputUpdated" fluid />
                </div>
                <p class="text-xs">Namig: Drži gumb za hitrejšo spremembo.</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { InputNumberInputEvent } from "primevue/inputnumber";

const prikljucna_moc = usePrikljucnaMoc();

const inputUpdated = (event: InputNumberInputEvent) => {
    const currentValue = parseFloat((event.value as number).toFixed(1));
    const currentIndex = prikljucna_moc.value.findIndex((value) => value === event.value);
    const previousValue = prikljucna_moc.value[currentIndex - 1];
    const nextValue = prikljucna_moc.value[currentIndex + 1];

    if (currentValue !== undefined) {
        // Timeout is used to prevent lowering number event exectuing after this
        setTimeout(() => {
            if (currentIndex > 0 && currentValue < previousValue) {
                prikljucna_moc.value[currentIndex] = previousValue;
            } else if (currentIndex < prikljucna_moc.value.length - 1 && currentValue > nextValue && currentIndex !== 4) {
                prikljucna_moc.value[currentIndex] = nextValue;
            } else {
                prikljucna_moc.value[currentIndex] = currentValue;
            }
            localStorage.setItem("prikljucna_moc", JSON.stringify(prikljucna_moc.value));
        }, 100);
    }
};
</script>

<style scoped>
h2 {
    margin-bottom: 10px;
    text-align: center;
}

.dogovorjena-moc-update button {
    cursor: pointer;
}
</style>
