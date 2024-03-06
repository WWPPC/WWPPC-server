import UIButton from './UIButton.vue';
import UITextBox from './UITextBox.vue';
import UINumberBox from './UINumberBox.vue';
import UIToggle from './UIToggle.vue';
import UIDropdown from './UIDropdown.vue';
import UILinkButton from './UILinkButton.vue';
import UIImage from './UIImage.vue';
import UILoadingBar from './UILoadingBar.vue';
import UILoadingSpinner from './UILoadingSpinner.vue';
import UILoadingSquare from './UILoadingSquare.vue';
import FullscreenModal, { ModalMode, type ModalParams } from './FullscreenModal.vue';
import UIDivider from './UIDivider.vue';
export {
    UIButton,
    UITextBox,
    UINumberBox,
    UIToggle,
    UIDropdown,
    UILinkButton,
    UIImage,
    UILoadingBar,
    UILoadingSpinner,
    UILoadingSquare,
    FullscreenModal,
    ModalMode,
    UIDivider
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