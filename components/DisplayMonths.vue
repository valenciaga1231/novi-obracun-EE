<template>
    <div>
        <div class="cards-content">
            <div v-for="(data, month, id) in months_data" :key="id">
                <Card class="custom-card" @click="odpriRacun(data.month)" :pt="change_style_object">
                    <template #title class="custom-title">{{ getMonthAbbreviation(data.month) }}</template>
                    <template #content>
                        <p>
                            Poraba kWh: <b>{{ data.total_energy.toFixed(0) }}</b>
                        </p>
                        <span style="text-align: center">Veljavnost podatkov:</span>
                        <ProgressBar :value="100" style="scale: 0.8"></ProgressBar>
                    </template>
                </Card>
            </div>
        </div>
        <Transition name="slide-fade">
            <NoviStariPrimerjava :month="month_bill" v-if="useIsPrimerjavaModal().value" style="z-index: 2" />
        </Transition>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const months_data = useMonthsArray();
        const month_bill = ref(0);

        const odpriRacun = (month: number) => {
            createMonthBill(month);

            month_bill.value = month;
            useIsPrimerjavaModal().value = true;
        };

        const change_style_object = {
            title: {
                style: `font-size: 15px; text-align: center; padding: 0px;`,
            },
            body: {
                style: `font-size: 10px; text-align: center; padding: 10px 5px;`,
            },
        };

        return {
            months_data,
            change_style_object,
            month_bill,
            odpriRacun,
        };
    },
};
</script>

<style scoped>
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
    font-size: 10px;
    text-align: center;
    padding: 10px 5px;
}

.custom-card:hover {
    transition: transform 0.3s;
    transform: scale(1.05);
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
