<template>
    <div class="cards-content">
        <div v-for="(data, month, id) in months_data" :key="id">
            <Card class="custom-card">
                <template #title class="custom-title">Month: {{ month }}</template>
                <template #content>
                    <p>Celotna poraba: {{ data.total_energy }}</p>
                </template>
            </Card>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const months_data = useMonthsArray();

        return {
            months_data,
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
</style>
