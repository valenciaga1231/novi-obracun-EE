<template>
    <div class="header-content">
        <h1>Primerjalnik cen EE 2024</h1>
        <TabMenu v-model:activeIndex="active" :model="items" />
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const is_table = useIsTable();
        const items = ref([
            {
                label: "Domov",
                icon: "pi pi-home",
                command: () => {
                    console.log("Podatki");
                    useRouter().push({ name: "index" });
                },
            },
            {
                label: "Racunalo",
                icon: "pi pi-home",
                command: () => {
                    useRouter().push({ name: "racunalo" });
                },
            },
            {
                label: "Račun",
                icon: "pi pi-money-bill",
                command: () => {
                    console.log("Racun");
                    useRouter().push({ name: "racun" });
                },
            },
            {
                label: "Analiza",
                icon: "pi pi-list",
                command: () => {},
            },
        ]);
        const active = useHeaderTab();

        onMounted(() => {
            //include script in header
            const script = document.createElement("script");
            script.src = "https://unpkg.com/xlsx/dist/xlsx.full.min.js";
            document.head.appendChild(script);
        });

        return {
            is_table,
            items,
            active,
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
    flex-wrap: wrap;
}
</style>
