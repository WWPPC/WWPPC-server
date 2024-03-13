import { defineStore } from "pinia";
import { reactive } from "vue";

const state = reactive({
    username: '',
    profileImage: ''
});
export const useAccountManager = defineStore('accountManager', {
    state: () => state,
    actions: {

    }
});