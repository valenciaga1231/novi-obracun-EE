// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    typescript: {
        typeCheck: true,
        strict: true,
    },
    css: ["primevue/resources/themes/lara-light-green/theme.css", "@/assets/main.css", "primeicons/primeicons.css"],
    modules: ["nuxt-primevue"],
    //@ts-ignore
    primevue: {
        options: {
            ripple: true,
        },
        components: {
            include: ["Calendar", "Button", "TabMenu", "InputNumber", "Card"],
        },
        cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
    },
});
