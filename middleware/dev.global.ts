export default defineNuxtRouteMiddleware((to, from) => {
    // console.log("Middleware: ", to.path, from.path); //! Dev

    // Set header tab
    if (to.path === "/racunalo") {
        useHeaderTab().value = 1;
    } else if (to.path === "/analiza") {
        useHeaderTab().value = 2;
    } else if (to.path === "/") {
        useHeaderTab().value = 0;
    }
});
