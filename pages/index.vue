<template>
    <div class="index-component" :class="{ 'custom-light-theme': is_light_theme }">
        <div class="index-content">
            <Header />
            <InfoSection style="margin-top: 20px; width: 50%" />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const is_light_theme = useIsLightTheme();
        const router = useRouter();

        return {
            is_light_theme,
        };
    },
};
</script>

<style scoped>
.index-component {
    width: 100%;

    /* These two heights always make 100% or at least 100vh background */
    height: 100%;
    min-height: 100vh;

    position: relative;
    background: url("https://novi-obracun-e76cc111cabe.herokuapp.com/images/ozadje.png") center center fixed;
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

.index-content {
    position: relative; /* Position must be set so overlay work properly */
    z-index: 1;
}
</style>
