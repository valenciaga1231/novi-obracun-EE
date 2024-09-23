// https://nuxt.com/docs/api/configuration/nuxt-config
// import Lara from "@primevue/themes/lara";
import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
    devtools: { enabled: false },
    typescript: {
        typeCheck: true,
        strict: true,
    },
    build: {
        transpile: ["xlsx"],
    },
    ssr: false,
    css: ["primeicons/primeicons.css"],
    modules: ["@primevue/nuxt-module"],
    //@ts-ignore
    primevue: {
        options: {
            ripple: true,
            inputVariant: "filled",
            theme: {
                preset: Aura,
                options: {
                    prefix: "p",
                    darkModeSelector: "system",
                    cssLayer: false,
                },
            },
        },
        components: {
            include: ["Calendar", "Button", "Drawer", "InputNumber", "Card", "Dropdown", "Fieldset", "Checkbox", "FileUpload", "MultiSelect", "Panel", "InputSwitch", "InputNumber", "ProgressBar", "ProgressSpinner", "Dialog", "Tabs", "TabList", "Tab", "Select"],
        },
        autoImport: true,
    },
});
