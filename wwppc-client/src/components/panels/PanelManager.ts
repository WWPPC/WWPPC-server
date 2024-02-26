// aggregate stuff
import { defineStore } from "pinia";
import PanelBody from "./PanelBody.vue";
import PanelHeader from "./PanelHeader.vue";
import PanelMain from "./PanelMain.vue";
import PanelNavButton from "./PanelNavButton.vue";
import PanelNavList from "./PanelNavList.vue";
import PanelRightList from "./PanelRightList.vue";
import PanelView from "./PanelView.vue";

export {
    PanelBody,
    PanelHeader,
    PanelMain,
    PanelNavButton,
    PanelNavList,
    PanelRightList,
    PanelView
}

export const usePanelStore = defineStore('panel', {
    state: () => ({
        curr: '',
        panels: Array<HTMLElement>()
    }),
    actions: {
        addPanel(p: HTMLElement) {
            this.panels.push(p);
        },
        selectPanel(name: string): boolean {
            this.panels.forEach(p => p.classList.add('hidden'));
            const search = 'panelName' + name.toUpperCase();
            const panel = this.panels.find(p => p.classList.contains(search));
            if (panel === undefined) return false;
            panel.classList.remove('hidden');
            return true;
        }
    }
});