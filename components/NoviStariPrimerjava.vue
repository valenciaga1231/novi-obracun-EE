<template>
    <div class="popup-content">
        <BillsNew :month="props.month" style="width: 100%; flex: 45%" />
        <BillsOld :month="props.month" style="width: 100%; flex: 45%" />
    </div>
</template>

<script>
export default {
    props: {
        month: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        // This is done to disable scrolling backround when the popup is open
        onMounted(() => {
            document.body.style.overflow = "hidden"; // Set overflow property to hidden when the popup is mounted
        });
        onBeforeUnmount(() => {
            document.body.style.overflow = ""; // Reset overflow property when the popup is unmounted
        });

        return {
            props,
        };
    },
};
</script>

<style scoped></style>
