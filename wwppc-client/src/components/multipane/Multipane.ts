import { defineStore } from 'pinia';
import { reactive } from 'vue';

import MultipaneSelectorContainer from './MultipaneSelectorContainer.vue';
import MultipaneSelector from './MultipaneSelector.vue';
import MultipanePaneContainer from './MultipanePaneContainer.vue';
import MultipanePane from './MultipanePane.vue';

export class Multipane {
    selected: string = '';
    hovering: string = '';
}
const state = reactive<{ [key: string]: Multipane | undefined }>({});
export const useMultipane = defineStore('multipane', {
    state: () => state,
});

export {
    MultipaneSelectorContainer,
    MultipaneSelector,
    MultipanePaneContainer,
    MultipanePane
}