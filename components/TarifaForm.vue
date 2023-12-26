<template>
    <div class="tarifa-component">
        <!-- <h2>Podatki o tarifi:</h2> -->
        <div class="tarifa-content">
            <div class="p-float-label">
                <Dropdown v-model="selected_tarif" :options="tarifs" optionLabel="name" class="w-full md:w-14rem" style="width: 200px" />
                <label for="dd-city">Izberi tarifo (brez DDV)</label>
            </div>
            <div v-if="settings.tip_starega_obracuna !== null">
                <div v-if="settings.tip_starega_obracuna === 'VT+MT'">
                    <span class="p-float-label" style="margin-bottom: 30px">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.VT" :minFractionDigits="5" locale="de-DE" suffix="                      EUR/kWh" />
                        <label for="number-input">VT</label>
                    </span>
                    <span class="p-float-label">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.MT" :minFractionDigits="5" locale="de-DE" suffix="                      EUR/kWh" />
                        <label for="number-input">MT</label>
                    </span>
                </div>
                <div v-if="settings.tip_starega_obracuna === 'ET'">
                    <span class="p-float-label">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.ET" :minFractionDigits="5" locale="de-DE" suffix="                      EUR/kWh" />
                        <label for="number-input">ET</label>
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
                if (useIsTable().value) sumAllCosts();
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
