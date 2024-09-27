<template>
    <div>
        <div v-if="prispevki" class="flex flex-col text-base">
            <h3>Upoštevaj prispevke za:</h3>
            <div class="mt-2">
                <Checkbox v-model="prispevki.operater_trga.is_active" :binary="true" />
                <label for="checkbox1"> Operaterja trga</label>
            </div>
            <div class="mt-2">
                <Checkbox v-model="prispevki.energetsko_ucinkovitost.is_active" :binary="true" />
                <label for="checkbox2"> Energetsko učinkovitost</label>
            </div>
            <div class="mt-2">
                <Checkbox v-model="prispevki.spte_ove.is_active" :binary="true" />
                <label for="checkbox3"> SPTE in OVE</label>
            </div>
            <div class="mt-2">
                <Checkbox v-model="prispevki.trosarina.is_active" :binary="true" />
                <label for="checkbox4"> Trošarino</label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const prispevki = usePrispevki();
</script>

<style scoped></style>
