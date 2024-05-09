<template>
    <div class="months-data-content">
        <Fieldset legend="Povzetek">
            <p>
                Celotni novi stroski z DDV po starem izracunu <b>{{ (total_old_cost * 1.22).toFixed(2) }} EUR</b>
            </p>
            <p>
                Celotni novi stroski z DDV po novem izracunu <b>{{ (total_new_cost * 1.22).toFixed(2) }} EUR</b>
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
                        <td v-for="(value, index) in new_costs" :key="index">
                            <p>{{ (old_costs[index] * 1.22).toFixed(2) }}</p>
                            <p>{{ (new_costs[index] * 1.22).toFixed(2) }}</p>
                            <p class="blue-100">{{ (((new_costs[index] * 1.22) / (old_costs[index] * 1.22)) * 100 - 100).toFixed(2) }} %</p>
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

<script lang="ts">
export default {
    setup() {
        const months = useMonthsArray();
        const total_new_cost = ref(0);
        const total_old_cost = ref(0);
        const new_costs = ref<number[]>([]);
        const old_costs = ref<number[]>([]);

        onMounted(() => {
            for (const month in months.value) {
                const new_cost = sumMonthCosts(months.value[month].month);
                const old_cost = sumMonthCostsOld(months.value[month].month);

                total_new_cost.value += new_cost;
                total_old_cost.value += old_cost;

                new_costs.value.push(new_cost);
                old_costs.value.push(old_cost);
            }
        });

        const calculateBackgroundColor = (is_active: boolean, presezna_moc: number) => {
            if (!is_active) return "gray";
            if (presezna_moc > 0) return "#cd5c5c";
            return "";
        };

        return { months, total_new_cost, total_old_cost, new_costs, old_costs, calculateBackgroundColor };
    },
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
    font-size: 20px;

    border-bottom: 1.75px solid white;
}

p {
    margin: 0;
    font-size: 18px;
    padding: 5px 10px;
}
</style>
