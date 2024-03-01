<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal, ModalMode, UIButton, UIDropdown, UITextBox } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import SuperSecretFeature from '@/components/SuperSecretFeature.vue';
import ContestTimer from '@/components/contest/ContestTimer.vue';

const modal = ref(FullscreenModal);

const result = ref('open the modal!');
const result2 = ref('hi');
const actualResult = ref('');
</script>

<template>
    <PanelView name="test">
        <PanelHeader>
            <LargeLogo></LargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Example" for="/test/example"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="default" :is-default=true>
                <UIButton @click="async () => result = await modal?.showModal({ title: 'why is borken', content: 'oof <img src=\'/assets/timer.svg\' style=\'height: 40px;\'>', mode: ModalMode.QUERY })" text="Test modal"></UIButton>
                <UIDropdown :items="[{ text: result, value: 'a' }, { text: result2, value: 'b' }]" width="100px" default="a" :required=true @input="(t) => actualResult = t"></UIDropdown>
                <UITextBox @input="(t) => result2 = t" default-value="hi"></UITextBox>
                <br>
                <span>{{ actualResult }}</span>
            </PanelBody>
            <PanelBody name="example">
                test
                <UIButton @click="() => modal.showModal({title: 'hi', content: 'test'})" text="example button"></UIButton>
            </PanelBody>
        </PanelMain>
        <FullscreenModal ref="modal"></FullscreenModal>
        <SuperSecretFeature :show="true"></SuperSecretFeature>
    </PanelView>
</template>