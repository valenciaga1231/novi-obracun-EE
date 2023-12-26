export default defineNuxtRouteMiddleware((to, from) => {
    // Set header tab
    if (to.path === "/racunalo") {
        useHeaderTab().value = 1;
    } else if (to.path === "/racun") {
        useHeaderTab().value = 2;
    } else if (to.path === "/analiza") {
        useHeaderTab().value = 3;
    } else if (to.path === "/") {
        useHeaderTab().value = 0;
    }
});
