<template>
    <div>
        <p style="text-align: center; margin: 0px">Stara obračunska moč:</p>
        <InputNumber v-model="stara_prikljucna_moc" :min="0" :max="1000" showButtons buttonLayout="horizontal" suffix="  kW" decrementButtonClassName="pi pi-plus" incrementButtonClassName="pi pi-minus" :pt="change_style_object">
            <template>
                <span class="pi pi-plus" />
            </template>
            <template>
                <span class="pi pi-minus" />
            </template>
        </InputNumber>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        inputWidth: {
            type: Number,
            default: 100,
        },
    },
    setup(props) {
        const stara_prikljucna_moc = usePrikljucnaMocStara();

        // Style object for input, additional styling options can be added
        const change_style_object = {
            input: {
                root: {
                    style: `width: ${props.inputWidth}px; text-align: center;`,
                },
            },
        };

        watch(
            () => stara_prikljucna_moc.value,
            (new_val) => {
                stara_prikljucna_moc.value = new_val; // Update state
                localStorage.setItem("stara_prikljucna_moc", JSON.stringify(new_val)); // Update local storage
            }
        );

        return {
            stara_prikljucna_moc,
            change_style_object,
        };
    },
};
</script>
