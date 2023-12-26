<template>
    <div class="header-content" :class="{ 'custom-light-theme': is_light_theme }">
        <link v-if="is_light_theme" id="theme-link" rel="stylesheet" href="https://novi-obracun-e76cc111cabe.herokuapp.com/themes/lara_light.css" />
        <link v-if="!is_light_theme" id="theme-link-dark" rel="stylesheet" href="https://novi-obracun-e76cc111cabe.herokuapp.com/themes/lara_dark.css" />
        <h1>Primerjalnik cen EE 2024</h1>
        <div class="dark-mode-switch">
            <div @click="changeTheme">Svetli način:</div>
            <InputSwitch severity="info" v-model="is_light_theme" />
        </div>

        <TabMenu v-model:activeIndex="active" :model="items" />
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const is_light_theme = useIsLightTheme();
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
                label: "Računalo",
                icon: "pi pi-calculator",
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
                command: () => {
                    useRouter().push({ name: "analiza" });
                },
            },
        ]);
        const active = useHeaderTab();

        const changeTheme = () => (is_light_theme.value = !is_light_theme.value);

        return {
            is_light_theme,
            items,
            active,
            changeTheme,
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
    border-bottom: 1px solid #dee2e6;
    flex-wrap: wrap;

    color: white;
}

.custom-light-theme {
    background-color: white;
    color: black;
}

.dark-mode-switch {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
}
</style>
