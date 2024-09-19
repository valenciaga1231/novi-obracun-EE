<template>
    <div class="tarifa-component">
        <div class="tarifa-content">
            <div class="p-float-label">
                <label for="input-tariff">Izberi tarifo (brez DDV)</label>
                <Select inputId="input-tariff" v-model="selected_tarif" :options="tarifs" optionLabel="name" class="w-full md:w-14rem" fluid />
            </div>
            <div v-if="settings.tip_starega_obracuna !== null">
                <div v-if="settings.tip_starega_obracuna === 'VT+MT'" style="display: flex; flex-direction: column">
                    <span class="flex-auto" style="margin-bottom: 30px">
                        <label for="number-input-vt" class="font-bold block mb-2">VT</label>
                        <InputNumber inputId="number-input-vt" v-model="settings.vrednosti_tarif.VT" :minFractionDigits="6" locale="de-DE" suffix="                      EUR/kWh" fluid />
                    </span>
                    <span class="flex-auto">
                        <label for="number-input-mt">MT</label>
                        <InputNumber inputId="number-input-mt" v-model="settings.vrednosti_tarif.MT" :minFractionDigits="6" locale="de-DE" suffix="                      EUR/kWh" fluid />
                    </span>
                </div>
                <div v-if="settings.tip_starega_obracuna === 'ET'">
                    <span class="p-float-label">
                        <label for="number-input-et">ET</label>
                        <InputNumber inputId="number-input-et" v-model="settings.vrednosti_tarif.ET" :minFractionDigits="6" locale="de-DE" suffix="                      EUR/kWh" fluid />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const settings = useSettings();
        const selected_tarif = ref();
        const tarifs = ref([
            { name: "VT+MT", code: "VT+MT" },
            { name: "ET", code: "ET" },
        ]);

        // Update settings if it is changed in settings and update local storage
        watch(
            () => settings.value.vrednosti_tarif,
            (val) => {
                // if (useIsTable().value) sumAllCosts();
                localStorage.setItem("vrednosti_tarif", JSON.stringify(val));
            },
            { deep: true }
        );

        onMounted(() => {
            // Set selected tarif
            if (settings.value.tip_starega_obracuna !== null) selected_tarif.value = { name: settings.value.tip_starega_obracuna, code: settings.value.tip_starega_obracuna };

            // Update selected tarif if it is changed in settings
            watch(
                () => useSettings().value.tip_starega_obracuna,
                (val) => {
                    if (val !== null) selected_tarif.value = { name: val, code: val };
                },
                { deep: true }
            );

            // Update setting and local storage if selected tarif is changed
            watch(selected_tarif, (val) => {
                //@ts-ignore
                settings.value.tip_starega_obracuna = val.code;
                localStorage.setItem("tip_starega_obracuna", val.code);
            });
        });

        return {
            settings,
            tarifs,
            selected_tarif,
        };
    },
};
</script>

<style scoped>
h2 {
    margin-bottom: 10px;
    text-align: center;
    margin-bottom: 30px;
}

.tarifa-content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 35px;
}
</style>
