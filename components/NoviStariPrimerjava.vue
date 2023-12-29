<template>
    <div class="container" @click="closePopup">
        <div class="popup" @click.stop>
            <div class="popup-content">
                <NoviRacun style="width: 100%; flex: 45%" />
                <StariRacun style="width: 100%; flex: 45%" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup() {
        const closePopup = () => {
            useIsPrimerjavaModal().value = false;
        };

        // This is done to disable scrolling backround when the popup is open
        onMounted(() => {
            document.body.style.overflow = "hidden"; // Set overflow property to hidden when the popup is mounted
        });
        onBeforeUnmount(() => {
            document.body.style.overflow = ""; // Reset overflow property when the popup is unmounted
        });

        return {
            closePopup,
        };
    },
};
</script>

<style scoped>
.container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup {
    position: relative;
    width: 90%;
    height: 80%;
    background-color: var(--surface-a); /* PrimeVue color */
    overflow: auto;
    cursor: default;

    border-radius: 10px;
}

.popup-content {
    display: flex;
    flex-direction: row;
    align-items: top;
    gap: 20px;
    flex-wrap: wrap;
    padding: 30px;
}
</style>
