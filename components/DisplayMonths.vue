<template>
    <div class="cards-content">
        <div v-for="(data, month, id) in months_data" :key="id">
            <Card class="custom-card" @click="odpriRacun">
                <template #title class="custom-title">Month: {{ month }}</template>
                <template #content>
                    <p>Poraba kWh: {{ data.total_energy.toFixed(0) }}</p>
                    <p style="text-align: center">Veljavnost podatkov:</p>
                    <ProgressBar :value="100"></ProgressBar>
                </template>
            </Card>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const months_data = useMonthsArray();
        const odpriRacun = () => {
            console.log("Odpiram racun"); // TODO: Open racun
        };
        return {
            months_data,
            odpriRacun,
        };
    },
};
</script>

<style scoped>
.cards-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
    flex-wrap: wrap;
}

.custom-card {
    cursor: pointer;
}

.custom-card:hover {
    transition: transform 0.3s;
    transform: scale(1.05);
}
</style>
