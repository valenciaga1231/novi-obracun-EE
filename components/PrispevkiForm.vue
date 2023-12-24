<template>
    <div>
        <div v-if="prispevki">
            <h3>Upostevaj prispevke:</h3>
            <input type="checkbox" v-model="prispevki.operater_trga.is_active" />
            <label for="checkbox1">Za operaterja trga</label>
            <br />
            <input type="checkbox" v-model="prispevki.energetsko_ucinkovitost.is_active" />
            <label for="checkbox2">Za energetsko učinkovistos</label>
            <br />
            <input type="checkbox" v-model="prispevki.spte_ove.is_active" />
            <label for="checkbox3">Za SPTE in OVE</label>
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
