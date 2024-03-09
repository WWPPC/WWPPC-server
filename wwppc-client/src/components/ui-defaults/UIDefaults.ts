import UIButton from './inputs/UIButton.vue';
import UILinkButton from './inputs/UILinkButton.vue';
import UIIconButton from './inputs/UIIconButton.vue';
import UITextBox from './inputs/UITextBox.vue';
import UINumberBox from './inputs/UINumberBox.vue';
import UIToggle from './inputs/UIToggle.vue';
import UIDropdown from './inputs/UIDropdown.vue';
import UIImage from './UIImage.vue';
import UILoadingBar from './UILoadingBar.vue';
import UILoadingSpinner from './UILoadingSpinner.vue';
import UILoadingSquare from './UILoadingSquare.vue';
import FullscreenModal, { ModalMode, type ModalParams } from './FullscreenModal.vue';
import UIDivider from './UIDivider.vue';
import GlowText from './text/GlowText.vue';
import GlitchText from './text/GlitchText.vue';
export {
    UIButton,
    UILinkButton,
    UIIconButton,
    UITextBox,
    UINumberBox,
    UIToggle,
    UIDropdown,
    UIImage,
    UILoadingBar,
    UILoadingSpinner,
    UILoadingSquare,
    FullscreenModal,
    ModalMode,
    UIDivider,
    GlowText,
    GlitchText
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