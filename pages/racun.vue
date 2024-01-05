<template>
    <div>
        <Header />
        <section class="racun-section">
            <NoviRacun :month="11" v-if="useIsTable().value" style="max-width: 1000px" />
        </section>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        return {};
    },
};
</script>

<style scoped>
.racun-section {
    margin: 0 auto;
    padding: 0 20px;
    max-width: 1000px;
    width: 100%;
}
</style>
