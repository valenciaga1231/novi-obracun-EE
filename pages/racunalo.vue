<template>
    <div class="racunalo-content text-sm md:text-base">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <div class="flex flex-wrap" style="margin: 2%">
            <!-- Data input section (Dogovorjena moc, EE tarifa, Data uploader, Prispevki) -->
            <section class="data-input-section w-full">
                <!-- Button to toggle instructions panel -->
                <Fieldset legend="Nastavitve in podatki za izračun" :toggleable="false">
                    <div class="flex justify-between mb-3">
                        <p class="basis-1/2 text-sm md:text-base text-justify">Začnite z vnosom podatkov za primerjavo med starim in novim obračunom. Najprej določite novo in staro vrsto odjema in nato še ostalo s klikom naprej. Za dodatne informacije kliknite gumb <a @click="toggleInstructions" class="cursor-pointer" target="_blank">navodila</a>.</p>
                        <Button @click="toggleInstructions" class="self-start" size="small">Navodila</Button>
                    </div>
                    <Fieldset class="mt-3" legend="Izberi staro in novo vrsto odjema" :toggleable="true" :collapsed="isVrstaOdjemaCollapsed" v-on:toggle="isVrstaOdjemaCollapsed = !isVrstaOdjemaCollapsed">
                        <div class="flex justify-evenly flex-wrap gap-6">
                            <div class="">
                                <p style="text-align: left; margin-bottom: 3px">Izberi uporabniško skupino po novem obračunu:</p>
                                <Select class="text-sm" pt:root:class="max-w-full" v-model="settings.user_group" optionLabel="name" :options="userGroupList" @change="updateUserGroup" :invalid="settings.user_group.code === null" placeholder="Izberi uporabniško skupino" fluid />
                            </div>
                            <div>
                                <p style="text-align: left; margin-bottom: 3px">Izberi staro odjemno skupino :</p>
                                <SelectOldTarife class="text-sm" />
                            </div>
                        </div>
                        <div v-if="settings.user_group.code !== null && settings.vrednosti_tarif_omreznine.label !== 'Not defined'">
                            <CompareOmrezninaTarife />
                        </div>
                        <div class="text-center mt-3">
                            <Button @click="isVrstaOdjemaCollapsed = true" severity="info" size="small">Zapri </Button>
                            <Button
                                class="ml-3"
                                @click="
                                    isVrstaOdjemaCollapsed = true;
                                    isPrikljucnaCollapsed = false;
                                "
                                size="small"
                                >Naprej
                            </Button>
                        </div>
                    </Fieldset>
                    <!-- Nastavitev nove dogovorjene moči in stare priključne moči -->
                    <Fieldset class="mt-3" legend="Nastavi novo dogovorjeno obračunsko moč in staro obračunsko moč" :toggleable="true" :collapsed="isPrikljucnaCollapsed" v-on:toggle="isPrikljucnaCollapsed = !isPrikljucnaCollapsed">
                        <div class="flex flex-wrap justify-evenly gap-5">
                            <PrikljucnaMocForm class="w-94 m-auto" />
                            <StaraPrikljucna class="w-94 m-auto" />
                        </div>
                        <div class="text-center mt-3">
                            <Button @click="isPrikljucnaCollapsed = true" severity="info" size="small">Zapri </Button>
                            <Button
                                class="ml-3"
                                @click="
                                    isPrikljucnaCollapsed = true;
                                    isTarifaCollapsed = false;
                                "
                                size="small"
                                >Naprej
                            </Button>
                        </div>
                    </Fieldset>
                    <!-- Nastavitev tarif za električno energijo -->
                    <Fieldset class="mt-3" legend="Tarifa energije pri ponudniku" :toggleable="true" :collapsed="isTarifaCollapsed" v-on:toggle="isTarifaCollapsed = !isTarifaCollapsed">
                        <div class="flex flex justify-evenly gap-2">
                            <div class="w-1/3">
                                <p class="text-justify">V primeru, da želite primerjati le cene po starem in novem obračunu (sprememba načina omrežnine), vnesite enako tarifo za stari in novi obračun.</p>
                                <p class="text-justify">V primeru, da želite za novi račun, ko se regulacija 90% cene konča, vnesite višje tarife v polja za novi obračun. Lahko s klikom na spodnji gumb ali pa poglejte na spletni strani vašega ponudnika.</p>
                                <Button @click="updateTariffsToNew()" class="mt-3" severity="secondary" size="small" raised>Vnesi višje tarife</Button>
                            </div>
                            <TarifaFormOld class="w-1/3" />
                            <TarifaForm class="w-1/3" />
                        </div>
                        <div class="text-center mt-3">
                            <Button @click="isTarifaCollapsed = true" severity="info" size="small">Zapri </Button>
                            <Button
                                class="ml-3"
                                @click="
                                    isTarifaCollapsed = true;
                                    isUploadCollapsed = false;
                                "
                                size="small"
                                >Naprej
                            </Button>
                        </div>
                    </Fieldset>
                    <!-- Naloži podatke in vnos prispevkov -->
                    <Fieldset class="mt-3" legend="Naloži podatke" :toggleable="true" :collapsed="isUploadCollapsed" v-on:toggle="isUploadCollapsed = !isUploadCollapsed">
                        <div class="flex flex-wrap">
                            <UploadData class="basis-1/2 p-3" />
                            <div class="basis-1/2 p-3">
                                <p class="font-bold">Namig za vnos podatkov:</p>
                                <p class="text-justify">- Najboljše da vnesete 15-min podatke iz portala MojElektro za celotno leto 2023, če imate le te na voljo. Kajti trenutni prazniki so v kalkulatorju vnešeni za leto 2023 in bi lahko ob vnosu za leto 2024 podalo malenkost napačne rezultate, vendar večjih odstopanj ni, takoda se lahko vnese tudi za 2024.</p>
                                <p class="text-justify">- Prav tako so stare omrežnine vnešene trenunto zgolj za leto 2023, vendar prav v primeru vnosa podatkov za 2024 ni večjih odstopanj.</p>
                            </div>
                        </div>
                        <div class="text-center mt-3">
                            <Button @click="isUploadCollapsed = true" severity="info" size="small">Zapri </Button>
                        </div>
                    </Fieldset>
                    <Fieldset class="mt-3" legend="Prispevki" :toggleable="true" :collapsed="isPrispevkiCollapsed" v-on:toggle="isPrispevkiCollapsed = !isPrispevkiCollapsed">
                        <p class="text-sm">Označi kateri prispevki želiš, da se upoštevajo na računih.</p>
                        <PrispevkiForm class="mt-3" />
                    </Fieldset>
                </Fieldset>
                <!-- Nastavitev vrste odjema po starem in novem obračunu -->
            </section>
            <!-- Display data section -->
            <section v-if="is_table === true" style="padding: 20px">
                <div>
                    <Button @click="showDialog = true" class="optimize-btn">Optimizacija stroškov&nbsp;<b>(novo)</b></Button>
                    <DisplayMonthsData />
                </div>
            </section>
        </div>
        <!-- Sliding instructions panel -->
        <Drawer name="slide-fade" v-model:visible="showInstructions" position="right" style="width: 50%">
            <section class="instructions-info-section">
                <div class="instructions text-sm">
                    <h3 style="margin-top: 0px">Navodila za uporabo:</h3>
                    <h3 class="text-base font-bold mt-3">1. Izberi staro in novo vrsto odjema:</h3>
                    <p>Uporabniško skupino po novem obračunu izberemo glede na to v katero skupino spadamo. Večina gospodinjstev je skupina 0 - uporabniki priključeni na NN izvod napetosti 420/230.</p>
                    <p>Staro odjemno skupino izberemo glede na to v katero staro odjemno skupino spadamo, da bo primerjava med starim in novim računom pravilna. Večina navadnih gospodinjstev je pod Omrena priključitev: gospodinjstvo.</p>

                    <h3 class="text-base font-bold mt-3">2. Nastavi novo dogovorjeno obračunsko moč in staro obračunsko moč:</h3>
                    <p>Podatke o <b>dogovorjeni moči</b> najdete na portalu <a href="https://mojelektro.si/login" target="_blank">MojElektro</a> kjer se prijavite. V meniju nato kliknemo Merilna mesta / merilne točke, kjer izberemo merilno mesto. Nato v meniju merilnega mesta izberemo Dogovorjena/obračunska moč, kjer bo izpisana moč za vsak blok. Slednje pravilno vnesemo v računalo.</p>
                    <p>Staro priključno moč lahko pogledamo na računu ali pa na portalu <a href="https://mojelektro.si/login" target="_blank">MojElektro</a> kjer izberemo merilno mesto in nato v meniju obračunski podatki ter na enem od obračunov preverimo obračunsko moč.</p>

                    <h3 class="text-base font-bold mt-3">3. Nastavi tarifo energije pri ponudniku:</h3>
                    <p>Velika in mala tarifa sta podani na položnici za elektriko. Oz. če nas zanima tarifa za naseldnje leto kliknemo <a href="https://www.elektro-energija.si/za-dom/dokumenti-in-ceniki" target="_blank">tu</a>. Vnesemo vrednosti brez DDV.</p>

                    <h3 class="text-base font-bold mt-3">4. Naloži podatke:</h3>
                    <p>Podatkovno datoteko z <b>15 minutnimi meritvami</b> najedemo na portalu <a href="https://mojelektro.si/login" target="_blank">MojElektro</a> na izbranem merilnem mestu pod 15 minutni podatki. Izvozimo <b>Excel datoteko</b> za poljubni MESEC ali LETO oz. poljubno obdobje. Za dober pregled nad primerjavo letnih stroškov EE je najlažje vnesti datoteko z podatki za celotno leto 2023.</p>
                    <p>Kliknemo na <b>Izračunaj</b> in izpisali se bodo podatki po mesecih. V prvem oknu lahko vidimo cene glede na stari in novi obračun. Za izpis računa za vsak mesec posebaj lahko kliknemo na posamezen mesec(kvadratek), kjer bo primerjava med starim in novim računom.</p>
                    <p>Po izračunu lahko pogledamo stare in nove račune s klikom na posamezen mesec.</p>
                </div>
                <div class="info text-sm">
                    <h3 class="text-xl font-bold mt-3">Informacije o računalu:</h3>
                    <p>1. Vnešeni podatki se ne pošljejo nikamor, ker se vsi računi izvedejo v brskalniku pri uporabniku.</p>
                    <p>2. Za samooskrbne uporabnike bo izračun dodan kmalu.</p>
                    <p>3. V primeru napake ali dodatnih vprašanj me kontaktirajte na <a href="mailto:merjcompany@gmail.com" target="_blank">e-mail</a>.</p>
                    <p>4. Github repozitorij je dostopen <a href="https://github.com/valenciaga1231/novi-obracun-EE" target="_blank">tukaj</a>.</p>
                </div>
            </section>
        </Drawer>

        <!-- Dialog for optimization results -->
        <Dialog header="Optimizacija Blokov" v-model:visible="showDialog" modal :style="{ width: '50vw' }">
            <p>V primeru na klik spodnjega gumba bo stekla optimizacija moči posameznega bloka glede na podane podatke. Optimizacija sloni na tem, da se poišče minimum stroškov glede na vnešeno obdobje.</p>
            <p>
                Vaši trenutni stroški po novem obračunu za vnešeno obdobje so trenutno:
                <b>{{ (totalCosts * 1.22).toFixed(2) }} €</b> <br />
                V primeru, da bi rad izvedel na koliko lahko znižas stroške kliki spodnji gumb.
            </p>
            <div class="card flex justify-center">
                <Button type="button" label="Optimiziraj" :loading="isOptimizing" icon="pi pi-refresh" @click="onClickOptimizePowerSettings()" />
            </div>
            <div v-if="totalCostsOptimized > 0">
                <h4>Z optimizacijo smo dobili sledeče rezultate:</h4>
                <p>Nove optimizirane vrednosti blokov so:</p>
                <div style="display: flex; flex-direction: row; justify-content: space-evenly">
                    <div v-for="(moc, id) in optimizedPrikljucnaMoc">
                        <div v-if="activeBloks[id]">
                            <div>Blok {{ id + 1 }}</div>
                            <div style="margin-left: 5px">{{ moc }}</div>
                        </div>
                    </div>
                </div>
                <p>
                    Skupni stroški po optimizaciji so: <b>{{ totalCostsOptimized.toFixed(2) }} €</b> Kar je prihranek v višini: <b>{{ (totalCosts * 1.22 - totalCostsOptimized).toFixed(2) }} €</b> <br />
                    Vnesi te vrednosti blokov in ponovi izračun z klikom na gumb za vpogled podatkov po mesecih: <Button @click="repeatcalculationWithOptimizedBloks" size="small">Ponovi izračun z optimiziranimi bloki</Button>
                </p>
                <p><b>POZOR:</b> Optimizacija je bila narejena na podlagi podatkov o preteklosti, kar ne nujno pomeni, da bi v primeru spremembe dogovorjene moči pri operaterju pomenilo nižje stroške!</p>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import type { MonthData } from "@/types"; // Adjust the path according to your project structure

const is_table = useIsTable();
const settings = useSettings();
const showInstructions = ref(false);
const showDialog = ref(false);
const optimizedPrikljucnaMoc = ref<number[]>([]);
const monthsData = useMonthsArray();

const totalCosts = computed(() => {
    return Object.values(monthsData.value).reduce((acc, monthData: MonthData) => acc + sumMonthCosts(monthData.month), 0);
});
const totalCostsOptimized = ref(0);
const isOptimizing = ref(false);
const prikljucna_moc = usePrikljucnaMoc();
const activeBloks = ref([0, 0, 0, 0, 0]);

// Fieldsets collapsed
const isVrstaOdjemaCollapsed = ref(false);
const isPrikljucnaCollapsed = ref(true);
const isTarifaCollapsed = ref(true);
const isUploadCollapsed = ref(false);
const isPrispevkiCollapsed = ref(true);

const userGroupList = ref([
    { name: "0: uporabniki priključeni na NN izvod nazivne napetosti 420/230", code: 0 },
    { name: "1: uporabniki priključeni na NN na zbiralnici NN v TP SN/NN", code: 1 },
    { name: "2: uporabniki priključeni na SN izvod nazivne napetosti 35, 20 in 10kV", code: 2 },
    { name: "3: uporabniki priključeni na SN na zbiralnici SN v RTP VN/SN", code: 3 },
    { name: "4: uporabniki priključeni na VN izvod nazivne napetosti 400, 220 in 110 kV", code: 4 },
]);

onMounted(() => {
    // Get local storage data
    const data = localStorage.getItem("prikljucna_moc");
    if (data) usePrikljucnaMoc().value = JSON.parse(data);
    const vrednosti_tarif = localStorage.getItem("vrednosti_tarif");
    if (vrednosti_tarif) useSettings().value.vrednosti_tarif = JSON.parse(vrednosti_tarif);
    const tip_starega_obracuna = localStorage.getItem("tip_starega_obracuna");
    if (tip_starega_obracuna) useSettings().value.tip_starega_obracuna = tip_starega_obracuna as "VT+MT" | "ET" | null;
    const tip_novega_obracuna = localStorage.getItem("tip_novega_obracuna");
    if (tip_novega_obracuna) useSettings().value.tip_novega_obracuna = tip_novega_obracuna as "VT+MT" | "ET" | null;
    const stara_prikljucna_moc = localStorage.getItem("stara_prikljucna_moc");
    if (stara_prikljucna_moc) usePrikljucnaMocStara().value = JSON.parse(stara_prikljucna_moc);
    const user_group = localStorage.getItem("user_group");
    if (user_group) useSettings().value.user_group = JSON.parse(user_group);
    const user_group_old = localStorage.getItem("user_group_old");
    if (user_group_old) useSettings().value.vrednosti_tarif_omreznine = JSON.parse(user_group_old);

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

    // Get active blocks
    Object.values(monthsData.value).forEach((monthData: MonthData) => {
        monthData.active_blocks.forEach((block, index) => {
            if (block === 1) activeBloks.value[index] = 1;
        });
    });

    setTimeout(() => {
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

const updateTariffsToNew = () => {
    settings.value.tip_novega_obracuna = "VT+MT";
    settings.value.vrednosti_tarif = { VT: 0.16999, MT: 0.14799, ET: 0.15899 };
};

const updateUserGroup = () => {
    const _useSettings = useSettings().value;
    if (_useSettings.user_group !== null) {
        localStorage.setItem("user_group", JSON.stringify(_useSettings.user_group));
    }
};
</script>

<style scoped>
.racunalo-content {
    max-width: 1400px;
    margin: auto;
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

a {
    color: var(--p-primary-400);
    text-decoration: none;
}

.instructions-info-section a:hover {
    text-decoration: underline;
}
</style>
