import { defineStore } from 'pinia';
import { ref } from 'vue';

import UIButton from './inputs/UIButton.vue';
import UILinkButton from './inputs/UILinkButton.vue';
import UIIconButton from './inputs/UIIconButton.vue';
import UITextBox from './inputs/UITextBox.vue';
import UITextArea from './inputs/UITextArea.vue';
import UINumberBox from './inputs/UINumberBox.vue';
import UIToggle from './inputs/UIToggle.vue';
import UIDropdown from './inputs/UIDropdown.vue';
import UIFileUpload from './inputs/UIFileUpload.vue';
import UILoadingBar from './UILoadingBar.vue';
import UILoadingSpinner from './UILoadingSpinner.vue';
import UILoadingSquare from './UILoadingSquare.vue';
import FullscreenModal, { ModalMode, type ModalParams } from './FullscreenModal.vue';
import UIDivider from './UIDivider.vue';
import GlowText from './text/GlowText.vue';
import GlitchText from './text/GlitchText.vue';
import UICopyButton from './UICopyButton.vue';
import UITimer from './UITimer.vue';
import UITimeDisplay from './UITimeDisplay.vue';
import UISponsorLogo from './UISponsorLogo.vue';

export {
    UIButton,
    UILinkButton,
    UIIconButton,
    UITextBox,
    UITextArea,
    UINumberBox,
    UIToggle,
    UIDropdown,
    UIFileUpload,
    UILoadingBar,
    UILoadingSpinner,
    UILoadingSquare,
    FullscreenModal,
    ModalMode,
    UIDivider,
    GlowText,
    GlitchText,
    UICopyButton,
    UITimer,
    UITimeDisplay,
    UISponsorLogo
}

const modal = ref<InstanceType<typeof FullscreenModal>>();
export const globalModal = defineStore('globalModal', {
    actions: {
        setModal(newModal: InstanceType<typeof FullscreenModal>) {
            modal.value = newModal;
        },
        showModal(params: ModalParams): { result: Promise<string | boolean | null>, cancel: () => void } {
            if (modal.value != null) {
                return modal.value.showModal(params);
            } else {
                return { result: new Promise((resolve) => resolve(null)), cancel: () => { } };
            }
        },
        cancelAllModals() {
            modal.value?.cancelAllModals();
        }
    }
});