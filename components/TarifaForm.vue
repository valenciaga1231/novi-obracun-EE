<template>
    <div class="tarifa-component">
        <!-- <h2>Podatki o tarifi:</h2> -->
        <div class="tarifa-content">
            <div class="p-float-label">
                <Dropdown v-model="selected_tarif" :options="tarifs" optionLabel="name" class="w-full md:w-14rem" style="width: 200px" />
                <label for="dd-city">Izberi tarifo</label>
            </div>
            <div v-if="settings.tip_starega_obracuna !== null">
                <div v-if="settings.tip_starega_obracuna === 'VT+MT'">
                    <span class="p-float-label" style="margin-bottom: 30px">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.VT" :minFractionDigits="4" locale="de-DE" suffix="                      EUR/kWh" />
                        <label for="number-input" style="scale: 0.9; margin-left: 12px">VT</label>
                    </span>
                    <span class="p-float-label">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.MT" :minFractionDigits="4" locale="de-DE" suffix="                      EUR/kWh" />
                        <label for="number-input">MT</label>
                    </span>
                </div>
                <div v-if="settings.tip_starega_obracuna === 'ET'">
                    <span class="p-float-label">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.ET" :minFractionDigits="4" locale="de-DE" suffix="                      EUR/kWh" style="scale: 0.8" />
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
        const selected_tarif = ref({ name: "VT+MT", code: "VT+MT" });
        const tarifs = ref([
            { name: "VT+MT", code: "VT+MT" },
            { name: "ET", code: "ET" },
        ]);

        watch(selected_tarif, (val) => {
            //@ts-ignore
            settings.value.tip_starega_obracuna = val.code;
        });

        // check both tarif inputs on change with watcher
        watch(
            () => settings.value.vrednosti_tarif.VT,
            (val) => {
                if (useIsTable().value) sumAllCosts();
            }
        );

        watch(
            () => settings.value.vrednosti_tarif.MT,
            (val) => {
                if (useIsTable().value) sumAllCosts();
            },
            { deep: true }
        );

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
