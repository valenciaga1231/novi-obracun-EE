export default defineNuxtRouteMiddleware((to, from) => {
    // Dont go to racun if these was no calculation made
    if (to.path === "/racun" && !useIsTable().value) {
        return navigateTo("/");
    }

    // Set header tab
    if (to.path === "/proizvodnja") {
        useHeaderTab().value = 1;
    } else if (to.path === "/racunalo") {
        useHeaderTab().value = 2;
    } else if (to.path === "/racun") {
        useHeaderTab().value = 3;
    } else if (to.path === "/analiza") {
        useHeaderTab().value = 4;
    } else if (to.path === "/") {
        useHeaderTab().value = 0;
    }
});
