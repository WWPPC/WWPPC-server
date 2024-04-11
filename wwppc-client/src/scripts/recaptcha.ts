import { load, ReCaptchaInstance } from 'recaptcha-v3';
import { ref } from 'vue';

let loaded = false;
let loadError: false | string = false;
const loadPromises = new Set<[Function, Function]>();
load('6LfvsYgpAAAAAKi_E0IgDfIb7BCZKYfSlphYTNem').then((wrapper) => {
    loaded = true;
    instance.value = wrapper;
    loadPromises.forEach((p) => p[0]());
}).catch((reason) => {
    loadError = reason;
    loadPromises.forEach((p) => p[1](reason));
});
export const executeRecaptcha = async (action: string) => {
    await recaptchaLoaded();
    return await instance.value!.execute(action);
};
export const recaptchaLoaded = async () => {
    if (loaded) return;
    if (loadError) throw new Error(loadError);
    return await new Promise((resolve, reject) => loadPromises.add([resolve, reject]));
};
export const instance = ref<ReCaptchaInstance | null>(null);
export const showRecaptcha = async () => {
    await recaptchaLoaded();
    instance.value?.showBadge();
}
export const hideRecaptcha = async () => {
    await recaptchaLoaded();
    instance.value?.hideBadge();
}
export default { execute: executeRecaptcha, loaded: recaptchaLoaded, instance, show: showRecaptcha, hide: hideRecaptcha };