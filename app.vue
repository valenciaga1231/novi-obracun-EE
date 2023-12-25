<template>
    <div>
        <NuxtPage />
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const title = "Primerjalnik";
        const is_table = useIsTable();

        onMounted(() => {
            //include script in header
            const script = document.createElement("script");
            script.src = "https://unpkg.com/xlsx/dist/xlsx.full.min.js";
            document.head.appendChild(script);

            useUserData().value = true; // Sets to true so middleware works properly

            // Get prikljucna moc from localStorage
            const data = localStorage.getItem("prikljucna_moc");
            if (data) usePrikljucnaMoc().value = JSON.parse(data);
        });

        return {
            title,
            is_table,
        };
    },
};
</script>

<style>
html {
    box-sizing: border-box;
    --shadow-dark: 0 2rem 6rem (0, 0, 0, 0.3);
}

body {
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0 0;
    padding: 0;
}
</style>
