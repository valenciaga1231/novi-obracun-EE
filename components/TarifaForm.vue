<template>
    <div class="tarifa-component">
        <!-- <h2>Podatki o tarifi:</h2> -->
        <div class="tarifa-content">
            <div class="p-float-label">
                <Dropdown v-model="selectedCity" inputId="dd-city" :options="cities" optionLabel="name" class="w-full md:w-14rem" style="width: 200px" />
                <label for="dd-city">Izberi tarifo</label>
            </div>
            <div v-if="settings.tip_starega_obracuna !== null">
                <div v-if="settings.tip_starega_obracuna === 'VT+MT'">
                    <span class="p-float-label" style="margin-bottom: 30px">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.VT" :minFractionDigits="4" locale="de-DE" suffix="                      EUR/kWh" />
                        <label for="number-input">VT</label>
                    </span>
                    <span class="p-float-label">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.MT" :minFractionDigits="4" locale="de-DE" suffix="                      EUR/kWh" />
                        <label for="number-input">MT</label>
                    </span>
                </div>
                <div v-if="settings.tip_starega_obracuna === 'ET'">
                    <span class="p-float-label">
                        <InputNumber id="number-input" v-model="settings.vrednosti_tarif.ET" :minFractionDigits="4" locale="de-DE" suffix="                      EUR/kWh" />
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
        const selectedCity = ref();
        const cities = ref([
            { name: "VT+MT", code: "VT+MT" },
            { name: "ET", code: "ET" },
        ]);

        watch(selectedCity, (val) => {
            console.log(val);

            settings.value.tip_starega_obracuna = val.code;
            console.log(settings.value);
        });

        return {
            settings,
            cities,
            selectedCity,
        };
    },
};
</script>

<style scoped>
.tarifa-component {
    margin-bottom: 30px;
    width: 600px;
}

h2 {
    margin-bottom: 10px;
    text-align: center;
    margin-bottom: 30px;
}

.tarifa-content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

span {
}
</style>
