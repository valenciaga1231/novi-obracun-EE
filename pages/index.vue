<template>
    <div class="index-component" :class="{ 'custom-light-theme': is_light_theme }">
        <div class="w-5/6 m-auto index-content text-base md:text-xl">
            <InfoSection />
        </div>
    </div>
</template>

<script setup lang="ts">
const is_light_theme = useIsLightTheme();
</script>

<style scoped>
.index-component {
    /* These two heights always make 100% or at least 100vh background */
    min-height: 100vh;

    position: relative;
    background: url("/images/ozadje.webp") center center fixed;
    background-size: cover;
}
/* To dim the background make pseudo element ::before to cover background */
.index-component::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* Adjust the alpha value to control dimness */
}

.custom-light-theme::before {
    background-color: rgba(0, 0, 0, 0.2); /* Adjust the alpha value to control dimness */
}
</style>
