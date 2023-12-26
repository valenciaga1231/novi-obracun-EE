<template>
    <div>
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
            useUserData().value = true; // Sets to true so middleware works properly

            // Get local storage data
            const data = localStorage.getItem("prikljucna_moc");
            if (data) usePrikljucnaMoc().value = JSON.parse(data);
            const vrednosti_tarif = localStorage.getItem("vrednosti_tarif");
            if (vrednosti_tarif) useSettings().value.vrednosti_tarif = JSON.parse(vrednosti_tarif);
            const tip_starega_obracuna = localStorage.getItem("tip_starega_obracuna");
            if (tip_starega_obracuna) useSettings().value.tip_starega_obracuna = tip_starega_obracuna as "VT+MT" | "ET";
            const is_light_theme = localStorage.getItem("is_light_theme");
            if (is_light_theme) useIsLightTheme().value = JSON.parse(is_light_theme);
            else {
                // Handle default browser mode if not in local storage
                const is_browser_dark_mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
                useIsLightTheme().value = !is_browser_dark_mode;
            }

            // Dobi vrednosti tarif
            const blok_data = useBlokData().value;
            const tarife = getTarifeData();
            for (const blok in useBlokData().value) {
                // Doloci skupno tarifo omreznine za moc
                blok_data[blok].skupna_tarifa_moc = tarife[blok].prenos.tarifna_postavka_P + tarife[blok].distribucija.tarifna_postavka_P;

                // Doloci skupno ceno omreznine za moc
                const id = parseInt(blok) - 1;
                blok_data[blok].cena_omreznine_moci = blok_data[blok].skupna_tarifa_moc * usePrikljucnaMoc().value[id];
            }
        });

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
}
</style>
