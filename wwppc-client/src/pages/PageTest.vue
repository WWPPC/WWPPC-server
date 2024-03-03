<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import { FullscreenModal, ModalMode, UIButton, UIDropdown, UILinkButton, UILoadingBar, UILoadingSquare, UITextBox, UIToggle } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
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
            <PanelNavLargeLogo></PanelNavLargeLogo>
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
            <PanelBody name="default" is-default>
                <UIButton @click="async () => result = await modal?.showModal({ title: 'why is borken', content: 'oof <img src=\'/assets/timer.svg\' style=\'height: 40px;\'>', mode: ModalMode.QUERY })" text="Test modal"></UIButton>
                <UIDropdown :items="[{ text: result, value: 'a' }, { text: result2, value: 'b' }]" width="100px" default="a" required @input="(t) => actualResult = t"></UIDropdown>
                <UITextBox @input="(t) => result2 = t" default-value="hi"></UITextBox>
                <br>
                <span>{{ actualResult }}</span>
                <br>
                <iframe src="https://discord.com/widget?id=1210952002587328522&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
            </PanelBody>
            <PanelBody name="example">
                test
                <UIButton @click="() => modal.showModal({title: 'hi', content: 'test'})" text="example button"></UIButton>
                <UIButton text="disabled button" disabled></UIButton>
                <UIToggle disabled></UIToggle>
                <UIDropdown disabled :items="[]"></UIDropdown>
                <UILinkButton text="disbaled link!!" disabled></UILinkButton>
                <UILoadingBar></UILoadingBar>
                <UILoadingSquare></UILoadingSquare>
            </PanelBody>
        </PanelMain>
        <FullscreenModal ref="modal"></FullscreenModal>
        <SuperSecretFeature show></SuperSecretFeature>
    </PanelView>
</template>