<template>
    <div>
        <div v-if="prispevki">
            <h3>Upoštevaj prispevke za:</h3>
            <Checkbox v-model="prispevki.operater_trga.is_active" :binary="true" />
            <label for="checkbox1"> Operaterja trga</label>
            <br />
            <br />
            <Checkbox v-model="prispevki.energetsko_ucinkovitost.is_active" :binary="true" />
            <label for="checkbox2"> Energetsko učinkovitost</label>
            <br />
            <br />
            <Checkbox v-model="prispevki.spte_ove.is_active" :binary="true" />
            <label for="checkbox3"> SPTE in OVE</label>
            <br />
            <br />
            <Checkbox v-model="prispevki.trosarina.is_active" :binary="true" />
            <label for="checkbox4"> Trošarino</label>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const prispevki = usePrispevki();

        return {
            prispevki,
        };
    },
};
</script>

<style scoped>
h3 {
    margin-top: 0;
}
</style>
