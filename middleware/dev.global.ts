export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path !== "/") {
        if (!useUserData().value) {
            return navigateTo("/");
        }
    }
});
