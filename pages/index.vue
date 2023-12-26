<template>
    <div class="index-component">
        <div class="index-content">
            <Header />
            <InfoSection style="margin-top: 20px; width: 60%" />
        </div>
    </div>
</template>

<script lang="ts"></script>

<style scoped>
.index-component {
    width: 100%;

    /* These two heights always make 100% or at least 100vh background */
    height: 100%;
    min-height: 100vh;

    position: relative;
    background: url("/images/ozadje.png") no-repeat center center fixed;
}
/* To dim the background make pseudo element ::before to cover background */
.index-component::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Adjust the alpha value to control dimness */
}

.index-content {
    position: relative; /* Position must be set so overlay work properly */
    z-index: 1;
}
</style>
