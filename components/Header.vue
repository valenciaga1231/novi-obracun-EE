<template>
    <div class="header-content">
        <h1>Primerjalnik cen EE 2024</h1>
        <div class="card">
            <Tabs :value="tabValue">
                <TabList class="text-sm">
                    <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value" @click="router.push({ name: tab.route })" :disabled="tab.disabled">
                        <i :class="tab.icon" />
                        {{ tab.title }}
                    </Tab>
                </TabList>
            </Tabs>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const router = useRouter();
        const tabValue = ref("0");
        const tabs = ref([
            {
                title: "Domov",
                icon: "pi pi-home",
                route: "index",
                value: "0",
                disabled: false,
            },
            {
                title: "Računalo",
                icon: "pi pi-calculator",
                route: "racunalo",
                value: "1",
                disabled: false,
            },
            {
                title: "Analiza",
                icon: "pi pi-list",
                route: "analiza",
                value: "2",
                disabled: true,
            },
        ]);

        // Watch for route changes and update the tab value
        watchEffect(() => {
            const currentRoute = router.currentRoute.value.name;
            const tab = tabs.value.find((tab) => tab.route === currentRoute);
            if (tab) {
                tabValue.value = tab.value;
            }
        });

        return {
            tabs,
            tabValue,
            router,
        };
    },
};
</script>

<style scoped>
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 0 0px 1rem;
    border-bottom: 1px solid #dee2e6;
    flex-wrap: wrap;
    color: rgb(255, 255, 255);
}

h1 {
    color: var(--p-primary-400);
    background-color: var(--p-zinc-700) !important;
    padding: 12px 18px;
    border-radius: 0.5rem;
    margin: 1rem 0;
    text-align: center;

    font-weight: bold;
    letter-spacing: 2px;
    font-size: 1.5rem;
}

a {
    text-decoration: none;
    color: inherit;
}

a:visited {
    color: inherit;
}
</style>
