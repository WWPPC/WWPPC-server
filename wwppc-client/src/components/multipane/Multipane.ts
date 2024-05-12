import { defineStore } from "pinia";
import { reactive } from "vue";

// behold! the most useless global store!
// just exporting the state would work
const state = reactive<{ [key: string]: string | undefined }>({});
export const useMultipane = defineStore('multipane', {
    state: () => state,
});