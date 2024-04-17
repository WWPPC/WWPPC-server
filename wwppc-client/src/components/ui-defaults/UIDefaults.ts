import { defineStore } from 'pinia';
import { ref } from 'vue';

import FullscreenModal, { ModalMode, type ModalParams } from './FullscreenModal.vue';
import UIButton from './inputs/UIButton.vue';
import UIDropdown from './inputs/UIDropdown.vue';
import UIFileUpload from './inputs/UIFileUpload.vue';
import UIIconButton from './inputs/UIIconButton.vue';
import UILinkButton from './inputs/UILinkButton.vue';
import UINumberBox from './inputs/UINumberBox.vue';
import UITextArea from './inputs/UITextArea.vue';
import UITextBox from './inputs/UITextBox.vue';
import UIToggle from './inputs/UIToggle.vue';
import GlitchText from './text/GlitchText.vue';
import GlowText from './text/GlowText.vue';
import UIDivider from './UIDivider.vue';
import UIImage from './UIImage.vue';
import UILoadingBar from './UILoadingBar.vue';
import UILoadingSpinner from './UILoadingSpinner.vue';
import UILoadingSquare from './UILoadingSquare.vue';

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

const modal = ref<InstanceType<typeof FullscreenModal>>();
export const globalModal = defineStore('globalModal', {
    actions: {
        setModal(newModal: InstanceType<typeof FullscreenModal>) {
            modal.value = newModal;
        },
        async showModal(params: ModalParams): Promise<string | boolean | null> {
            if (modal.value != null) {
                return await modal.value.showModal(params);
            } else {
                return await new Promise((resolve) => resolve(null));
            }
        },
        async cancelModal() {
            await modal.value?.cancelModal();
        },
        async cancelAllModals() {
            await modal.value?.cancelAllModals();
            await modal.value?.cancelModal();
        }
    }
})