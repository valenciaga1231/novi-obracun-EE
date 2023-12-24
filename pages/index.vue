<template>
    <div>
        <div class="header-content">
            <h1>Novi izracun EE</h1>
            <TabMenu :model="items" />
        </div>
        <div class="flex">
            <DataForm />
            <div v-if="is_table">
                <NoviRacun />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const title = "Primerjalnik";
        const is_table = useIsTable();
        const items = ref([
            {
                label: "Vhodni podatki",
                icon: "pi pi-home",
            },
            {
                label: "Račun",
                icon: "pi pi-chart-line",
            },
            {
                label: "Analiza",
                icon: "pi pi-list",
            },
            {
                label: "Dodatno",
                icon: "pi pi-inbox",
            },
        ]);

        onMounted(() => {
            //include script in header
            const script = document.createElement("script");
            script.src = "https://unpkg.com/xlsx/dist/xlsx.full.min.js";
            document.head.appendChild(script);
        });

        return {
            title,
            is_table,
            items,
        };
    },
};
</script>

<style scoped>
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
}
</style>
