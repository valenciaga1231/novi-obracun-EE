<template>
    <div class="months-data-content">
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
                                    <p :style="{ backgroundColor: data.is_active ? '' : 'gray', color: data.is_active ? '' : 'gray' }">
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

        return { months };
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
