<template>
    <div class="header-content">
        <!-- <link v-if="is_light_theme" crossorigin="" id="theme-link" rel="stylesheet" href="https://novi-obracun-e76cc111cabe.herokuapp.com/themes/lara_light.css" />
        <link v-if="!is_light_theme" crossorigin="" id="theme-link-dark" rel="stylesheet" href="https://novi-obracun-e76cc111cabe.herokuapp.com/themes/lara_dark.css" /> -->
        <h1 :class="{ 'custom-light-theme': is_index_path == false && is_light_theme }">Primerjalnik cen EE 2024</h1>
        <!-- <div class="dark-mode-switch">
            <div :class="{ 'custom-light-theme': is_index_path == false && is_light_theme }">Svetli način:</div>
            <InputSwitch severity="info" v-model="is_light_theme" @change="changeTheme" />
        </div> -->
        <TabMenu v-model:activeIndex="active" :model="items" style="margin-bottom: 0px" />
    </div>
</template>

<script lang="ts">
// import { usePrimeVue } from "primevue/config";
export default {
    setup() {
        const is_light_theme = useIsLightTheme();

        const items = ref([
            {
                label: "Domov",
                icon: "pi pi-home",
                command: () => {
                    useRouter().push({ name: "index" });
                },
            },
            {
                label: "Proizvodnja",
                icon: "pi pi-sun",
                command: () => {
                    useRouter().push({ name: "proizvodnja" });
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
                disabled: true,
                command: () => {
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

        // TODO: Idk but something is wrong with this class assigning
        const is_index_path = ref(false);
        const router = useRouter();
        onMounted(() => {
            // on route change do something
            router.afterEach((to, from) => {
                if (to.fullPath === "/") is_index_path.value = true;
                else is_index_path.value = false;
            });

            // Enable or disable Racun section in menu bar
            items.value[3].disabled = !useIsTable().value;
        });

        // Watch  to enable or disable Racun section in menu bar
        watch(
            () => useIsTable().value,
            (val) => (items.value[3].disabled = !val)
        );

        const changeTheme = () => {
            // if (is_light_theme.value) PrimeVue.changeTheme("lara-light-green", "lara-dark-green", "theme-link-dark", () => {});
            // else PrimeVue.changeTheme("lara-dark-green", "lara-light-green", "theme-link", () => {});
            // localStorage.setItem("is_light_theme", JSON.stringify(is_light_theme.value));
        };

        return {
            is_light_theme,
            items,
            is_index_path,
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
    align-items: flex-end;
    padding: 0 0 0px 1rem;
    border-bottom: 1px solid #dee2e6;
    flex-wrap: wrap;
    color: rgb(255, 255, 255);
}

h1 {
    color: white;
    background-color: rgba(255, 255, 255, 0.5) !important;
    padding: 15px 10px;
    border-radius: 5px;
    margin: 10px;
}
.custom-light-theme {
    color: black !important;
}

.dark-mode-switch {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;

    background-color: rgba(255, 255, 255, 0.5);
    padding: 5px 10px;
    border-radius: 5px;
}
</style>
