<template>
    <div>
        <Select pt:listContainer:class="text-sm" v-model="settings.vrednosti_tarif_omreznine" @change="updateOlduserGroup" :options="useConnectionsTypeList().value" :invalid="settings.vrednosti_tarif_omreznine.label === 'Not defined'" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Izberi tarifo po starem obračunu">
            <template #optiongroup="slotProps">
                <div class="flex items-center">
                    <div>{{ slotProps.option.label }}</div>
                </div>
            </template>
        </Select>
        <p class="text-xs mt-1">Trenutne tarife omrežnine so vnešene za leto 2023!</p>
        <div v-if="settings.vrednosti_tarif_omreznine.label !== 'Not defined'" class="mt-2 text-xs">
            <p>Moč: {{ settings.vrednosti_tarif_omreznine.power }} EUR/kW/mesec</p>
            <p>VT: {{ settings.vrednosti_tarif_omreznine.VT }} EUR/kWh</p>
            <p>MT: {{ settings.vrednosti_tarif_omreznine.MT }} EUR/kWh</p>
            <p v-if="settings.vrednosti_tarif_omreznine.ET">ET: {{ settings.vrednosti_tarif_omreznine.ET }} EUR/kWh</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const settings = useSettings();
const updateOlduserGroup = () => {
    const _useSettings = useSettings().value;
    if (_useSettings.vrednosti_tarif_omreznine !== null) {
        localStorage.setItem("user_group_old", JSON.stringify(_useSettings.vrednosti_tarif_omreznine));
    }
};
</script>

<style scoped></style>
