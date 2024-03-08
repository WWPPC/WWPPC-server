<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import { FullscreenModal, ModalMode, UIButton, UIDropdown, UILinkButton, UILoadingBar, UILoadingSquare, UILoadingSpinner, UITextBox, UIToggle } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
import SuperSecretFeature from '@/components/SuperSecretFeature.vue';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { HeaderedTable, TitledCutCornerContainer, TitledAngleContainer, AnimateInContainer } from '@/components/ui-defaults/UIContainers';

const modal = ref(FullscreenModal);

const result = ref('open the modal!');
const result2 = ref('hi');
const actualResult = ref('');

const thing2 = ref<any>([]);
</script>

<template>
    <PanelView name="test">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Example" for="/test/default"></PanelNavButton>
                <PanelNavButton text="Example" for="/test/example"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="default" title="Test Page 1" is-default>
                <UIButton @click="async () => result = await modal?.showModal({ title: 'why is borken', content: 'oof <img src=\'/assets/timer.svg\' style=\'height: 40px;\'>', mode: ModalMode.QUERY })" text="Test modal"></UIButton>
                <UIDropdown :items="[{ text: result, value: 'a' }, { text: result2, value: 'b' }]" width="100px" default="a" required @input="(t) => actualResult = typeof t == 'string' ? t : t[0]"></UIDropdown>
                <UITextBox @input="(t) => result2 = t" default-value="hi"></UITextBox>
                <br>
                <span>{{ actualResult }}</span>
                <br>
                <div style="display: flex;">
                    <!-- <iframe src="https://discord.com/widget?id=1210952002587328522&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe> -->
                    <HeaderedTable :content="{
                        headers: ['col 1', 'col 2', 'col 3'],
                        data: [
                            ['a1', 'a2', 'a3'],
                            ['b1', 'b2', 'b3']
                        ],
                        generator: (row, col, data) => ({ text: `${row} ${col} ${data}`, backgroundColor: col == 'col 2' ? 'blue' : '', style: 'transform: rotateZ(20deg);'})
                    }" height="200px"></HeaderedTable>
                    hi
                    <TitledAngleContainer title="title" width="40%" height="200px">
                        titled angle container
                        oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>
                    </TitledAngleContainer>
                    hi
                    <TitledCutCornerContainer title="title" width="40%" height="200px" border-color="yellow">
                        oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>
                    </TitledCutCornerContainer>
                </div>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <AnimateInContainer type="slideUp" :delay=1000>
                        <TitledCutCornerContainer title="FADE IN">
                            HI HI HI HI HI HI HI<br>
                            hi<br>
                            hi<br>
                            hi<br>
                            hi<br>
                            hi<br>
                            hi<br>
                            hi<br>
                            hi<br>
                            hi<br>
                            hi<br>
                        </TitledCutCornerContainer>
                        <span>
                            second test
                        </span>
                </AnimateInContainer>
            </PanelBody>
            <PanelBody name="example" title="Test Page 2">
                test
                <UIButton @click="() => modal.showModal({ title: 'hi', content: 'test' })" text="example button"></UIButton>
                <UIButton text="disabled button" disabled></UIButton>
                <UIToggle disabled></UIToggle>
                <UIDropdown disabled :items="[]"></UIDropdown>
                <UILinkButton text="disbaled link!!" disabled></UILinkButton>
                <UILoadingBar></UILoadingBar>
                <div style="width: 300px; height: 300px;">
                    <UILoadingSquare></UILoadingSquare>
                </div>
                <div style="width: 100px; height: 100px; padding: 50px 50px;">
                    <UILoadingSpinner></UILoadingSpinner>
                </div>
                <UIDropdown @input="(t) => thing2 = t" :items="[
                    { text: 'oof', value: 'oof' }
                ]" :grouped-items="[
                    {
                        label: 'g1', items: [
                            { text: 'hi', value: 'dfdf' },
                            { text: 'test 2', value: 'teesssst' }
                        ]
                    },
                    {
                        label: 'G2!!!!!!', items: [
                            { text: 'hi', value: 'aaaaaaaaaaa' },
                            { text: 'test 2', value: 'eeeeeeeeeeeeee' },
                            { text: 'oof', value: 'ee' }
                        ]
                    }
                ]" width="400px" height="100px" multiple></UIDropdown>
                {{ thing2 }}
            </PanelBody>
        </PanelMain>
        <FullscreenModal ref="modal"></FullscreenModal>
        <SuperSecretFeature show></SuperSecretFeature>
    </PanelView>
</template>