<template>
    <div>
        <div v-if="prispevki">
            <h3>Upostevaj prispevke:</h3>
            <Checkbox v-model="prispevki.operater_trga.is_active" :binary="true" />
            <label for="checkbox1"> Za operaterja trga</label>
            <br />
            <br />
            <Checkbox v-model="prispevki.energetsko_ucinkovitost.is_active" :binary="true" />
            <label for="checkbox2"> Za energetsko učinkovistos</label>
            <br />
            <br />
            <Checkbox v-model="prispevki.spte_ove.is_active" :binary="true" />
            <label for="checkbox3"> Za SPTE in OVE</label>
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
