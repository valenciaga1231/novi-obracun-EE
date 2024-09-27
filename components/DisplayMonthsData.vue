<template>
    <div class="months-data-content">
        <div ref="display_months">
            <h3 style="text-align: center">Vnešeni meseci</h3>
            <p style="text-align: center">(klikni na mesec za vpogled racunov)</p>
            <div class="cards-content">
                <div v-for="(data, month, id) in months" :key="id">
                    <Card class="custom-card" @click="openBill(data.month)" :pt="change_style_object">
                        <template #title class="custom-title">{{ getMonthAbbreviation(data.month) }}</template>
                        <template #content>
                            <div>
                                Poraba kWh: <b>{{ data.total_energy.toFixed(0) }}</b>
                            </div>
                            <br />
                            <span style="text-align: center">Veljavnost podatkov:</span>
                            <ProgressBar :value="100" style="scale: 0.8"></ProgressBar>
                        </template>
                    </Card>
                </div>
            </div>
            <Dialog v-model:visible="showPrimerjava" maximizable style="width: 80%">
                <NoviStariPrimerjava :month="month_bill" style="z-index: 2" />
            </Dialog>
        </div>

        <Fieldset legend="Povzetek">
            <p>
                Celotni novi stroški z DDV po starem izračunu <b>{{ (total_old_cost * 1.22).toFixed(2) }} EUR</b>
            </p>
            <p>
                Celotni novi stroški z DDV po novem izračunu <b>{{ (total_new_cost * 1.22).toFixed(2) }} EUR</b>
            </p>
            <br />
            Porast/upad cene po mesecih:
            <table>
                <thead>
                    <tr class="table-header">
                        <th></th>
                        <template v-for="(month, index) in months" :key="index">
                            <th>{{ getMonthAbbreviation(month.month) }}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p>Stara</p>
                            <p>Nova</p>
                            <p>Sprememba</p>
                        </td>
                        <td v-for="(month, index) in months" :key="index">
                            <p>{{ month.total_sum_old_DDV.toFixed(2) }}</p>
                            <p>{{ month.total_sum_DDV.toFixed(2) }}</p>
                            <p class="blue-100">{{ ((month.total_sum_DDV / month.total_sum_old_DDV) * 100 - 100).toFixed(2) }} %</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style="font-size: 14px">Vse cene v zgornji tabeli so z DDV.</div>
        </Fieldset>
        <Fieldset legend="Poraba energije" :toggleable="true">
            <table>
                <thead>
                    <tr class="table-header">
                        <th></th>
                        <template v-for="(month, index) in months" :key="index">
                            <th>{{ getMonthAbbreviation(month.month) }}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p>MT</p>
                            <p>VT</p>
                            <p>Skupaj</p>
                        </td>
                        <td v-for="(month, index) in months" :key="index">
                            <p>{{ month.mt_energy.toFixed(0) }}</p>
                            <p>{{ month.vt_energy.toFixed(0) }}</p>
                            <p>{{ month.total_energy.toFixed(0) }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Fieldset>
        <Fieldset legend="Energija po blokih" :toggleable="true">
            <table>
                <thead>
                    <tr class="table-header">
                        <th>Blok</th>
                        <template v-for="(month, index) in months" :key="index">
                            <th>{{ getMonthAbbreviation(month.month) }}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p>1</p>
                            <p>2</p>
                            <p>3</p>
                            <p>4</p>
                            <p>5</p>
                        </td>
                        <td v-for="(month, index) in months" :key="index">
                            <template v-if="month.blok_data">
                                <template v-for="(data, index) in month.blok_data" :key="index">
                                    <p :style="{ backgroundColor: data.is_active ? '' : 'gray', color: data.is_active ? '' : 'gray' }">
                                        {{ data.energija.toFixed(2) }}
                                    </p>
                                </template>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Fieldset>
        <Fieldset legend="Presezna moč" :toggleable="true">
            <table>
                <thead>
                    <tr class="table-header">
                        <th>Blok</th>
                        <template v-for="(month, index) in months" :key="index">
                            <th>{{ getMonthAbbreviation(month.month) }}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p>1</p>
                            <p>2</p>
                            <p>3</p>
                            <p>4</p>
                            <p>5</p>
                        </td>
                        <td v-for="(month, index) in months" :key="index">
                            <template v-if="month.blok_data">
                                <template v-for="(data, index) in month.blok_data" :key="index">
                                    <p :style="{ backgroundColor: calculateBackgroundColor(data.is_active, data.presezna_moc), color: data.is_active ? '' : 'gray' }">
                                        {{ data.presezna_moc.toFixed(2) }}
                                    </p>
                                </template>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Fieldset>
    </div>
</template>

<script setup lang="ts">
const months = useMonthsArray();
const total_new_cost = ref(0);
const total_old_cost = ref(0);
const display_months = ref<HTMLElement | null>(null);
const month_bill = ref(0);
const showPrimerjava = ref(false);

onMounted(() => {
    if (display_months.value) display_months.value.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll on data

    for (const month in months.value) {
        total_new_cost.value += sumMonthCosts(months.value[month].month);
        total_old_cost.value += sumMonthCostsOld(months.value[month].month);
    }
});

// Update total costs when usePrikljucnaMoc is updated
watch(
    () => usePrikljucnaMoc().value,
    () => {
        total_new_cost.value = 0;
        total_old_cost.value = 0;

        for (const month in months.value) {
            total_new_cost.value += sumMonthCosts(months.value[month].month);
            total_old_cost.value += sumMonthCostsOld(months.value[month].month);
        }
    },
    { deep: true }
);

// Odpre prikaz racuna, primerjavo med novim in starim racunom
const openBill = (month: number) => {
    month_bill.value = month;
    showPrimerjava.value = true;
};

const change_style_object = {
    title: {
        style: `font-size: 15px; text-align: center; padding: 0px;`,
    },
    body: {
        style: `font-size: 12px; text-align: center; padding: 10px 5px;`,
    },
};

const calculateBackgroundColor = (is_active: boolean, presezna_moc: number) => {
    if (!is_active) return "gray";
    if (presezna_moc > 0) return "#cd5c5c";
    return "";
};
</script>

<style scoped>
.months-data-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
td {
    width: 70px;
    text-align: center;
}

table {
    border-collapse: collapse;
    border: 1px solid white;

    width: 100%;
}

.table-header th {
    padding: 10px 15px;
    font-size: 16px;

    border-bottom: 1.75px solid white;
}

p {
    margin: 0;
    font-size: 15px;
    padding: 3px 5px;
}

.cards-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    text-align: center;
    margin: auto;
}

.custom-card {
    cursor: pointer;
}

.custom-card-body {
    font-size: 15px;
    text-align: center;
    padding: 10px 5px;
}

.custom-card:hover {
    transition: transform 0.3s;
    transform: scale(1.1);
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
