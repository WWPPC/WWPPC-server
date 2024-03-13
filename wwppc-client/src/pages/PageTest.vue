<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import { FullscreenModal, ModalMode, UIButton, UIDropdown, UILinkButton, UILoadingBar, UILoadingSquare, UILoadingSpinner, UITextBox, UIToggle } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import SuperSecretFeature from '@/components/SuperSecretFeature.vue';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { HeaderedTable, TitledCutCornerContainer, AngledTitledContainer, AnimateInContainer } from '@/components/ui-defaults/UIContainers';

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
                <PanelNavButton text="Fonts" for="/test/fonts"></PanelNavButton>
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
                    <AngledTitledContainer title="title" width="40%" height="200px">
                        titled angle container
                        oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>oof<br>
                    </AngledTitledContainer>
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
            <PanelBody name="fonts" title="Fonts">
                <span style="font-size: var(--font-huge-title);">Huge Title</span>
                <br>
                <span style="font-size: var(--font-title);">Title</span>
                <br>
                <span style="font-size: var(--font-subtitle);">Subtitle</span>
                <br>
                <span style="font-size: var(--font-subsubtitle);">Sub-Subtitle</span>
                <br>
                <h1>Header 1</h1>
                <h2>Header 2</h2>
                <h3>Header 3</h3>
                <p>Paragraph</p>
                <p><b>Bold</b></p>
                <p><i>Italic</i></p>
                <p><code>const buh: number = NaN;</code></p>
                <p style="font-size: var(--font-16);">Size 16</p>
                <p style="font-size: var(--font-18);">Size 18</p>
                <p style="font-size: var(--font-20);">Size 20</p>
                <p style="font-size: var(--font-24);">Size 24</p>
                <p style="font-size: var(--font-28);">Size 28</p>
                <p style="font-size: var(--font-32);">Size 32</p>
                <p style="font-size: var(--font-40);">Size 40</p>
                <p style="font-size: var(--font-48);">Size 48</p>
                <p style="font-size: var(--font-small);">Small</p>
                <p style="font-size: var(--font-medium);">Medium</p>
                <p style="font-size: var(--font-large);">Large</p>
                <p style="font-size: var(--font-huge);">Huge</p>
            </PanelBody>
        </PanelMain>
        <FullscreenModal ref="modal"></FullscreenModal>
        <SuperSecretFeature show></SuperSecretFeature>
    </PanelView>
</template>

<style scoped></style>