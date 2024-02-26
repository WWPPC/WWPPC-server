<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal, ModalMode, UIButton, UIDropdown, UITextBox } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import SuperSecretFeature from '@/components/ui-defaults/SuperSecretFeature.vue';
import ContestTimer from '@/components/ContestTimer.vue';

const modal = ref(FullscreenModal);

const result = ref('open the modal!');
const result2 = ref('hi');
const actualResult = ref('');
</script>

<template>
    <PanelView>
        <PanelHeader>
            <PanelNavList>
                <LargeLogo></LargeLogo>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain default="default" page="test">
            <PanelBody name="default">
                <UIButton @click="async () => result = await modal?.showModal({title: 'why is borken', content: 'oof <img src=\'/assets/timer.svg\' style=\'height: 40px;\'>', mode: ModalMode.QUERY})" text="Test modal"></UIButton>
                <UIDropdown :items="[{text: result, value: 'a'}, {text: result2, value: 'b'}]" width="100px" default="a" :required=true @input="(t) => actualResult = t"></UIDropdown>
                <UITextBox @input="(t) => result2 = t" default-value="hi"></UITextBox>
                <br>
                <span>{{ actualResult }}</span>
            </PanelBody>
        </PanelMain>
    </PanelView>
    <FullscreenModal ref="modal"></FullscreenModal>
    <SuperSecretFeature :show="true"></SuperSecretFeature>
</template>