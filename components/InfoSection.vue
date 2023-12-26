<template>
    <div class="info-content">
        <Panel header="V letu 2024 prihaja nov tarifni sistem">
            <div class="text-window">
                <p>Z dnem <b>1. 6. 2024</b> bo stopil v veljavo nov tarifni sistem. Le ta se nanaša samo na omrežnino. Njegov cilj je spodbuditi uporabnike, da s prilagajanjem odjema prispevajo k optimizaciji distribucijskega in tudi širše elektroenergetskega sistema. Tako lahko dosežemo razbremenitev omrežja v času, ko je to najbolj obremenjeno z vidika porabe električne energije in moči.</p>
                <p>Uporabnik bo lahko svoj odjem prilagajal tako po moči kot po porabljeni električni energiji in s tem privarčeval.</p>
                <p style="display: flex; align-items: center; justify-content: space-between">
                    <span>Te zanima kakšen račun boš imel?</span>
                    <Button @click="processClick()" severity="info" style="max-width: 120px; text-align: center; margin: auto; font-size: 13px">Izračunaj</Button>
                </p>
            </div>
            <div></div>
        </Panel>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const router = useRouter();

        const processClick = () => {
            useHeaderTab().value = 1;
            router.push({ name: "racunalo" });
        };

        return {
            processClick,
        };
    },
};
</script>

<style scoped>
.info-content {
    display: flex;
    flex-direction: column;
    margin: auto;
    opacity: 0.9;
}
.text-window {
    border-radius: 5px;
    margin: 10px 0;
    font-size: 14px;

    text-align: justify;
    text-justify: inter-word;

    max-width: 800px;
}
</style>
