import UIButton from './UIButton.vue';
import UILinkButton from './UILinkButton.vue';
import UITextBox from './UITextBox.vue';
import UINumberBox from './UINumberBox.vue';
import UIToggle from './UIToggle.vue';
import UIDropdown from './UIDropdown.vue';
import FullscreenModal, { ModalMode, type ModalParams } from './FullscreenModal.vue';
export {
    UIButton,
    UITextBox,
    UINumberBox,
    UIToggle,
    UIDropdown,
    UILinkButton,
    FullscreenModal,
    ModalMode
}

import { defineStore } from 'pinia';
import { ref } from 'vue';

const modal = ref<InstanceType<typeof FullscreenModal>>();
export const globalModal = defineStore('globalModal', {
    actions: {
        setModal(newModal: InstanceType<typeof FullscreenModal>) {
            modal.value = newModal;
        },
        showModal(params: ModalParams) {
            if (modal.value != null) {
                return modal.value.showModal(params);
            } else {
                return new Promise((resolve) => resolve(null));
            }
        }
    }
})