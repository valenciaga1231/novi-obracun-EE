<template>
    <div>
        <p class="font-bold" style="color: var(--p-primary-400)">Primerjava novih tarif s starimi</p>
        <p class="text-sm mb-3 text-justify">Po novem boste plačevali toliko več v posameznem bloku kot kaže sprememba spodaj v tabelah za energijo in moč. Tabeli podajata zgolj informativne podatke o spremembah tarif za omrežnino energije in moči. Pri tabeli energije lahko hitro vidimo povečanje ali zmanjšanje stroškov omrežnine medtem, ko pri tabeli moči ni nujno takoj razvidna sprememba zaradi precejšnjih razlik v moči po blokih.</p>
        <div class="flex flex-wrap justify-between">
            <div class="m-auto">
                <p class="text-center" style="color: var(--p-primary-400)">Tabela za energijo</p>
                <p class="text-sm">Sprememba napram stari tarifi VT: {{ oldTariffs.VT }} EUR/kWh in stari tarifi MT: {{ oldTariffs.MT }} EUR/kWh.</p>
                <table class="text-sm">
                    <thead>
                        <tr>
                            <th class="p-1">Blok</th>
                            <th class="p-1">Nova tarifa [&euro;/kWh]</th>
                            <th class="p-1">Sprememba VT [%]</th>
                            <th class="p-1">Sprememba MT [%]</th>
                            <th v-if="oldTariffs.ET" class="p-1">Sprememba ET [%]</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(newEnergy, index) in newTariffsEnergy" :key="index">
                            <td class="p-1">{{ index + 1 }}</td>
                            <td class="p-1">{{ newEnergy.toFixed(5) }}</td>
                            <td class="p-1" :style="{ backgroundColor: getBackgroundColor(((newEnergy - oldTariffs.VT) / oldTariffs.VT) * 100) }">{{ (((newEnergy - oldTariffs.VT) / oldTariffs.VT) * 100).toFixed(2) }}</td>
                            <td class="p-1" :style="{ backgroundColor: getBackgroundColor(((newEnergy - oldTariffs.MT) / oldTariffs.MT) * 100) }">
                                {{ (((newEnergy - oldTariffs.MT) / oldTariffs.MT) * 100).toFixed(2) }}
                            </td>
                            <td v-if="oldTariffs.ET" class="p-1" :style="{ backgroundColor: getBackgroundColor(((newEnergy - oldTariffs.ET) / oldTariffs.ET) * 100) }">
                                {{ (((newEnergy - oldTariffs.ET) / oldTariffs.ET) * 100).toFixed(2) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="m-auto">
                <p class="text-center" style="color: var(--p-primary-400)">Tabela za moč</p>
                <p class="text-sm">Sprememba napram stari tarifi moči: {{ oldTariffs.power }} EUR/kW/mesec</p>
                <table class="text-sm">
                    <thead>
                        <tr>
                            <th class="p-1">Blok</th>
                            <th class="p-1">Nova tarifa</th>
                            <th class="p-1">Sprememba [%]</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(newPower, index) in newTariffsPower" :key="index">
                            <td class="p-1">{{ index + 1 }}</td>
                            <td class="p-1">{{ newPower.toFixed(5) }}</td>
                            <td class="p-1">{{ (((newPower - oldTariffs.power) / oldTariffs.power) * 100).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const settings = useSettings();
const newTariffsPower = ref([0, 0, 0, 0, 0]);
const newTariffsEnergy = ref([0, 0, 0, 0, 0]);
const oldTariffs = computed(() => settings.value.vrednosti_tarif_omreznine);

onMounted(() => {
    updateNewTariffs();
});

watch(
    () => settings.value.user_group.code,
    (newCode, oldCode) => {
        if (newCode !== oldCode) {
            updateNewTariffs();
        }
    }
);

function updateNewTariffs() {
    const newTariffs = getTarifeData(settings.value.user_group.code);
    // Determine combined new tariffs (prenos + distribucija) for each blok
    for (let blok = 1; blok <= 5; blok++) {
        newTariffsPower.value[blok - 1] = newTariffs[blok].distribucija.tarifna_postavka_P + newTariffs[blok].prenos.tarifna_postavka_P;
        newTariffsEnergy.value[blok - 1] = newTariffs[blok].distribucija.tarifna_postavka_W + newTariffs[blok].prenos.tarifna_postavka_W;
    }
}

const getBackgroundColor = (value: number) => {
    switch (true) {
        case value > 1000:
            return "var(--p-red-800)";
        case value > 600:
            return "var(--p-red-700)";
        case value > 200:
            return "var(--p-red-600)";
        case value > 50:
            return "var(--p-red-500)";
        case value < 0:
            return "var(--p-green-700)";
        default:
            return "";
    }
};
</script>

<style scoped></style>
