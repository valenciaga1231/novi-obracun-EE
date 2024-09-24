<template>
    <div class="racunalo-content">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <div class="page-content">
            <!-- Data input section (Dogovorjena moc, EE tarifa, Data uploader, Prispevki) -->
            <section class="data-input-section">
                <Fieldset legend="Spremeni vhodne podatke" :toggleable="true">
                    <div style="text-align: center">
                        <Select v-model="useSettings().value.user_group" optionLabel="name" :options="userGroupList" @change="updateUserGroup" :invalid="useSettings().value.user_group.code === null" placeholder="Izberi uporabniško skupino" class="w-full md:w-56" />
                    </div>
                    <PrikljucnaMocForm />
                    <div style="max-width: 1250px; display: flex; flex-direction: row; justify-content: space-between; flex-wrap: wrap; gap: 20px">
                        <Fieldset legend="Tarifa" :toggleable="true" style="flex: 33%">
                            <TarifaForm />
                        </Fieldset>
                        <UploadData style="flex: 33%" />
                        <Fieldset legend="Prispevki" :toggleable="true" style="flex: 33%">
                            <PrispevkiForm />
                        </Fieldset>
                    </div>
                </Fieldset>
            </section>

            <!-- Button to toggle instructions panel -->
            <button @click="toggleInstructions" class="toggle-instructions-btn">Navodila</button>

            <!-- Sliding instructions panel -->
            <Drawer name="slide-fade" v-model:visible="showInstructions" position="right" style="width: 50%">
                <section class="instructions-info-section">
                    <div class="instructions">
                        <h3 style="margin-top: 0px">Navodila za uporabo:</h3>
                        <p>1. Podatke o <b>dogovorjeni moči</b> najdete na portalu <a href="https://mojelektro.si/login" target="_blank">MojElektro</a> kjer se prijavite. V meniju nato kliknemo Merilna mesta / merilne točke, kjer izberemo merilno mesto. Nato v meniju merilnega mesta izberemo Dogovorjena/obračunska moč, kjer bo izpisana moč za vsak blok. Slednje pravilno vnesemo v računalo.</p>
                        <p>2. Velika in mala tarifa sta podani na položnici za elektriko. Oz. če nas zanima tarifa za naseldnje leto kliknemo <a href="https://www.elektro-energija.si/za-dom/dokumenti-in-ceniki" target="_blank">tu</a>. Vnesemo vrednosti brez DDV.</p>
                        <p>3. Tudi podatke datoteko z <b>15 minutnimi meritvami</b> najedemo na portalu <a href="https://mojelektro.si/login" target="_blank">MojElektro</a> na izbranem merilnem mestu pod 15 minutni podatki. Izvozimo <b>Excel datoteko</b> za poljubni MESEC ali LETO oz. poljubno obdobje. Za dober pregled nad primerjavo letnih stroškov EE je najlažje vnesti datoteko z podatki za leto 2023.</p>
                        <p>4. Kliknemo <b>Izračunaj</b> in izpisali se bodo podatki po mesecih. V prvem oknu lahko vidimo cene glede na stari in novi obračun. Za izpis računa za vsak mesec posebaj lahko kliknemo na posamezen mesec(kvadratek), kjer bo primerjava med starim in novim računom.</p>
                    </div>
                    <div class="info">
                        <h3>Informacije o računalu:</h3>
                        <p>1. Vnešeni podatki se ne pošljejo nikamor, ker se vsi računi izvedejo v brskalniku pri uporabniku.</p>
                        <p>2. Za samooskrbne uporabnike bo izračun dodan kmalu.</p>
                        <p>3. V primeru napake ali dodatnih vprašanj me kontaktirajte na <a href="mailto:merjcompany@gmail.com" target="_blank">e-mail</a>.</p>
                        <p>4. Github repozitorij je dostopen na <a href="https://github.com/valenciaga1231/novi-obracun-EE" target="_blank">tukaj</a>.</p>
                    </div>
                </section>
            </Drawer>
        </div>

        <!-- Display data section -->
        <div class="data-display" v-if="useIsTable().value === true" style="padding: 20px">
            <div class="data-tables">
                <Button @click="showDialog = true" class="optimize-btn">Optimizacija stroškov&nbsp;<b>(novo)</b></Button>
                <DisplayMonthsData />
            </div>
        </div>

        <!-- Dialog for optimization results -->
        <Dialog header="Optimizacija Blokov" v-model:visible="showDialog" modal :style="{ width: '50vw' }">
            <p>V primeru na klik spodnjega gumba bo stekla optimizacija moči posameznega bloka glede na podane podatke. Optimizacija sloni na tem, da se poišče minimum stroškov glede na vnešeno obdobje.</p>
            <p>
                Vaši trenutni stroški po novem obračunu za vnešeno obdobje so trenutno:
                <b>{{ (totalCosts * 1.22).toFixed(2) }} €</b> <br />
                V primeru, da bi rad izvedel na koliko lahko znizas stroške kliki spodnji gumb.
            </p>
            <div class="card flex justify-center">
                <Button type="button" label="Optimiziraj" :loading="isOptimizing" icon="pi pi-refresh" @click="onClickOptimizePowerSettings()" />
            </div>
            <div v-if="totalCostsOptimized > 0">
                <h4>Z optimizacijo smo dobili sledeče rezultate:</h4>
                <p>Nove optimizirane vrednosti blokov so:</p>
                <div style="display: flex; flex-direction: row; justify-content: space-evenly">
                    <div v-for="(moc, id) in optimizedPrikljucnaMoc">
                        <div>Blok {{ id + 1 }}</div>
                        <div style="margin-left: 5px">{{ moc }}</div>
                    </div>
                </div>
                <p>
                    Skupni stroški po optimizaciji so: <b>{{ totalCostsOptimized.toFixed(2) }} €</b> Kar je prihranek v višini: <b>{{ (totalCosts * 1.22 - totalCostsOptimized).toFixed(2) }} €</b> <br />
                    Vnesi te vrednosti blokov in ponovi izračun z klikom na gumb za vpogled podatkov po mesecih: <Button @click="repeatcalculationWithOptimizedBloks" size="small">Ponovi izračun z optimiziranimi bloki</Button>
                </p>
                <p><b>POZOR:</b> Optimizacija je bila narejena na podlagi podatkov o preteklosti, kar ne nujno pomeni, da bi v primeru spremembe dogovorjene moči pri operaterju pomenilo nizje stroške!</p>
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        const is_table = useIsTable();
        const showInstructions = ref(false);
        const showDialog = ref(false);
        const optimizedPrikljucnaMoc = ref<number[]>([]);
        const monthsData = useMonthsArray();
        const totalCosts = computed(() => {
            return Object.values(monthsData.value).reduce((acc, monthData) => acc + sumMonthCosts(monthData.month), 0);
        });
        const totalCostsOptimized = ref(0);
        const isOptimizing = ref(false);
        const prikljucna_moc = usePrikljucnaMoc();

        const userGroupList = ref([
            { name: "Uporabniška skupina 0: uporabniki priključeni na NN izvod nazivne napetosti 420/230", code: 0 },
            { name: "Uporabniška skupina 1: uporabniki priključeni na NN na zbiralnici NN v TP SN/NN", code: 1 },
            { name: "Uporabniška skupina 2: uporabniki priključeni na SN izvod nazivne napetosti 35, 20 in 10kV", code: 2 },
            { name: "Uporabniška skupina 3: uporabniki priključeni na SN na zbiralnici SN v RTP VN/SN", code: 3 },
            { name: "Uporabniška skupina 4: uporabniki priključeni na VN izvod nazivne napetosti 400, 220 in 110 kV", code: 4 },
        ]);

        onMounted(() => {
            // Get local storage data
            const data = localStorage.getItem("prikljucna_moc");
            if (data) usePrikljucnaMoc().value = JSON.parse(data);
            const vrednosti_tarif = localStorage.getItem("vrednosti_tarif");
            if (vrednosti_tarif) useSettings().value.vrednosti_tarif = JSON.parse(vrednosti_tarif);
            const tip_starega_obracuna = localStorage.getItem("tip_starega_obracuna");
            if (tip_starega_obracuna) useSettings().value.tip_starega_obracuna = tip_starega_obracuna as "VT+MT" | "ET" | null;
            const stara_prikljucna_moc = localStorage.getItem("stara_prikljucna_moc");
            if (stara_prikljucna_moc) usePrikljucnaMocStara().value = JSON.parse(stara_prikljucna_moc);
            const user_group = localStorage.getItem("user_group");
            if (user_group) useSettings().value.user_group = JSON.parse(user_group);

            // Set prices for prikljucna moc
            const tarife = getTarifeData(0);
            const blok_price_data = usePrikljucnaMocPrices().value;
            for (let i = 0; i < blok_price_data.length; i++) {
                const skupna_tarifna_moc = tarife[i + 1].prenos.tarifna_postavka_P + tarife[i + 1].distribucija.tarifna_postavka_P;
                blok_price_data[i] = skupna_tarifna_moc * usePrikljucnaMoc().value[i];
            }
        });

        const toggleInstructions = () => {
            showInstructions.value = !showInstructions.value;
        };

        const onClickOptimizePowerSettings = () => {
            isOptimizing.value = true;

            setTimeout(() => {
                // optimizing.value = true;
                const savePrikljucnaMoc = [...usePrikljucnaMoc().value];

                const optimizedPower = optimizePowerSettings();
                optimizedPrikljucnaMoc.value = optimizedPower;
                console.log(optimizedPower);

                // Update the reactive state with the optimized power settings
                for (let i = 0; i < prikljucna_moc.value.length; i++) {
                    prikljucna_moc.value[i] = optimizedPower[i];
                }
                updateMonthlyExpenses(monthsData);

                totalCostsOptimized.value = Object.values(monthsData.value).reduce((acc, monthData) => acc + sumMonthCosts(monthData.month), 0) * 1.22;
                console.log("Total costs optimized: ", totalCostsOptimized.value); //! Dev

                for (let i = 0; i < prikljucna_moc.value.length; i++) {
                    prikljucna_moc.value[i] = savePrikljucnaMoc[i];
                }
                updateMonthlyExpenses(monthsData);
                isOptimizing.value = false;
            }, 100);
        };

        const repeatcalculationWithOptimizedBloks = () => {
            for (let i = 0; i < prikljucna_moc.value.length; i++) {
                prikljucna_moc.value[i] = optimizedPrikljucnaMoc.value[i];
            }
            updateMonthlyExpenses(monthsData);
            showDialog.value = false;
        };

        const updateUserGroup = () => {
            const _useSettings = useSettings().value;
            if (_useSettings.user_group !== null) {
                localStorage.setItem("user_group", JSON.stringify(_useSettings.user_group));
            }
        };

        return {
            is_table,
            showInstructions,
            showDialog,
            optimizedPrikljucnaMoc,
            totalCostsOptimized,
            totalCosts,
            isOptimizing,
            userGroupList,
            toggleInstructions,
            onClickOptimizePowerSettings,
            repeatcalculationWithOptimizedBloks,
            updateUserGroup,
        };
    },
};
</script>

<style scoped>
.racunalo-content {
    margin-top: 20px;
    /* scale: 0.5; */
}

.page-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    flex-wrap: wrap;

    max-width: 2500px;
    margin: auto;
    position: relative;
}
.data-input-section {
    flex: 45%;

    display: flex;
    flex-direction: column;
    gap: 25px;

    margin: auto;
    margin-bottom: 50px;
    margin-top: 0px;

    max-width: 1400px;
}

.new-bill-section {
    flex: 55%;
    vertical-align: top;

    padding: 0px 25px;

    display: flex;
    flex-direction: column;
    text-align: center;
}

.instructions-info-section {
    flex: 25%;

    padding: 0px 25px;

    display: flex;
    flex-direction: column;
    text-align: center;
}

.instructions p {
    margin: 0px;
    margin-bottom: 10px;

    text-align: justify;
    text-justify: inter-word;
}

.info p {
    margin: 0px;
    margin-bottom: 10px;

    text-align: justify;
    text-justify: inter-word;
}

.data-display {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;

    margin: auto;
    margin-bottom: 50px;
    margin-top: 0px;

    max-width: 1400px;
}

.toggle-instructions-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 998;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}

.instructions-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background-color: var(--p-surface-900);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    z-index: 999;
    overflow-y: auto;
    padding: 20px;
}

.instructions-info-section a {
    color: var(--p-primary-400);
    text-decoration: none;
}

.instructions-info-section a:hover {
    text-decoration: underline;
}
</style>
