<template>
    <div class="popup-content text-sm w-full flex flex-wrap justify-evenly">
        <BillsNew :month="props.month" />
        <BillsOld :month="props.month" />
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
