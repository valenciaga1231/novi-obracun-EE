// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    typescript: {
        // typeCheck: true,
        // strict: true,
    },
    build: {
        transpile: ["xlsx"],
    },
    css: ["primevue/resources/themes/lara-dark-green/theme.css", "@/assets/main.css", "primeicons/primeicons.css"],
    modules: ["nuxt-primevue"],
    //@ts-ignore
    primevue: {
        options: {
            ripple: true,
        },
        components: {
            include: ["Calendar", "Button", "TabMenu", "InputNumber", "Card", "Dropdown", "Fieldset", "Checkbox", "FileUpload", "MultiSelect", "Panel", "InputSwitch", "InputNumber", "ProgressBar", "ProgressSpinner"],
        },
        cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
    },
    imports: {
        autoImport: true,
    },
});
