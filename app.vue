<template>
    <div style="height: 100vh">
        <Header />
        <NuxtPage />
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        useHead({
            title: "Primerjalnk cen Električne energije 2024",
            meta: [
                {
                    name: "description",
                    content: "Primerjalnik cen električne energije za leto 2024 in novi tarifni sistem",
                },
            ],
            htmlAttrs: { lang: "si" },
            link: [{ rel: "canonical", href: "https://novi-obracun-e76cc111cabe.herokuapp.com/" }],
        });

        useSeoMeta({
            title: "Primerjalnik cen električne energije 2024",
            ogTitle: "Primerjalnik cen električne energije 2024",
            description: "Primerjalnik cen električne energije 2024",
            ogDescription: "Primerjalnik cen 2024 za električno energijo",
        });

        onMounted(() => {
            // Define theme
            const is_light_theme = localStorage.getItem("is_light_theme");
            if (is_light_theme) useIsLightTheme().value = JSON.parse(is_light_theme);
            else {
                // Handle default browser mode if not in local storage
                const is_browser_dark_mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
                useIsLightTheme().value = !is_browser_dark_mode;
            }
        });

        onUnmounted(() => {});

        return {};
    },
};
</script>

<style>
html {
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0 0;
    padding: 0;

    height: 100vh;
}
</style>
