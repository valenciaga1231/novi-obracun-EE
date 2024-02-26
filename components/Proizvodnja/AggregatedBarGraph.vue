<template>
    <div>
        <div>
            <h1>Generation</h1>
            <div id="main"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { type EChartsType, type EChartsCoreOption } from "echarts/core";

export default {
    setup() {
        const api_data = apiGenerationData(); // Get global api_data state
        const { $echarts } = useNuxtApp(); // Import bundled size eCharts through nuxtApp

        let options: EChartsCoreOption; // Chart options
        let chart: EChartsType; // Chart instance

        const getGenerationData = async () => {
            const response = await fetch("http://localhost:50000/generation/get_all_types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}), // Empty body means gather today's data
            });
            api_data.value = await response.json();
            console.log(api_data.value); //! Dev
        };

        getGenerationData();

        onMounted(() => {
            // Init echarts on selected DOM element
            //@ts-ignore
            chart = $echarts.init(document.getElementById("main")); // Check for init() parameters https://echarts.apache.org/en/api.html#echarts
        });

        // Watches for API changes so once, data is fetched, it updates the chart
        watch(api_data, () => {
            setOptions();
            options && chart.setOption(options);
        });

        // Sets barChart options
        const setOptions = () => {
            // Generate hours array for x-Axis
            const x_bar_data = Array.from(Array(api_data.value?.BIOMASS?.length).keys(), (num) => num + 1);

            options = {
                tooltip: {
                    show: true,
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                },
                legend: {},
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        data: x_bar_data,
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "[MWh]",
                    },
                ],
                series: [
                    {
                        name: "Nuclear",
                        type: "bar",
                        color: "#B7D554",
                        stack: "Ad",
                        // emphasis: {
                        //     focus: "series",
                        // },
                        data: api_data.value.NUCLEAR,
                    },
                    {
                        name: "Coal",
                        type: "bar",
                        stack: "Ad",
                        color: "#ac8c35",
                        data: api_data.value.COAL_BROWN,
                    },
                    {
                        name: "Hydro",
                        type: "bar",
                        stack: "Ad",
                        color: "#089bf3",
                        data: api_data.value.HYDRO_RIVER,
                    },
                    {
                        name: "Hydro pump",
                        type: "bar",
                        stack: "Ad",
                        color: "#2772b2",
                        data: api_data.value.HYDRO_PUMP,
                    },
                    {
                        name: "Solar",
                        type: "bar",
                        stack: "Ad",
                        color: "#ffdf00",
                        data: api_data.value.SOLAR,
                    },
                    {
                        name: "Wind",
                        type: "bar",
                        stack: "Ad",
                        color: "#74cdb9",
                        data: api_data.value.WIND_ONSHORE,
                    },
                    {
                        name: "Biomass",
                        type: "bar",
                        stack: "Ad",
                        color: "#46AD61",
                        data: api_data.value.BIOMASS,
                    },
                    {
                        name: "Gas",
                        type: "bar",
                        stack: "Ad",
                        color: "#bb2f51",
                        data: api_data.value.FOSSIL_GAS,
                    },
                ],
            };
        };

        return {};
    },
};
</script>

<style scoped>
#main {
    width: 800px;
    height: 400px;
}
</style>
