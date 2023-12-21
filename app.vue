<template>
    <div>
        <h1>{{ title }}</h1>
        <div class="flex">
            <DataForm />
            <div v-if="is_table">
                <DisplayTable />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup() {
        const title = "Primerjalnik";
        const is_table = useIsTable();

        onMounted(() => {
            //include script in header
            const script = document.createElement("script");
            script.src = "https://unpkg.com/xlsx/dist/xlsx.full.min.js";
            document.head.appendChild(script);
        });

        return {
            title,
            is_table,
        };
    },
};
</script>

<style scoped>
.energy-table {
    width: 50%;
    border-collapse: collapse;
    margin: auto;
}

.energy-table th,
.energy-table td {
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
}

.energy-table th {
    background-color: #f2f2f2;
}

.flex {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
</style>
