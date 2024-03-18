<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import { FullscreenModal, ModalMode, UIButton, UIDropdown, UILinkButton, UILoadingBar, UILoadingSquare, UILoadingSpinner, UITextBox, UIToggle } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import SuperSecretFeature from '@/components/SuperSecretFeature.vue';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { HeaderedTable, TitledCutCornerContainer, AngledTitledContainer, AnimateInContainer } from '@/components/ui-defaults/UIContainers';
import TitledCollapsible from '@/components/ui-defaults/containers/TitledCollapsible.vue';

const modal = ref(FullscreenModal);

const result = ref('open the modal!');
const result2 = ref('hi');
const actualResult = ref('');

const thing2 = ref<any>([]);
</script>

<template>
    <PanelView name="test" title="Test Page">
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
                    generator: (row, col, data) => ({ text: `${row} ${col} ${data}`, backgroundColor: col == 'col 2' ? 'blue' : '', style: 'transform: rotateZ(20deg);' })
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
                <AnimateInContainer type="slideUp" :delay=1000>
                    <TitledCutCornerContainer title="FADE IN">
                        HI HI HI HI HI HI HI<br>
                        hi<br>
                        hi<br>
                        hi<br>
                        hi<br>
                    </TitledCutCornerContainer>
                    <span>
                        second test
                    </span>
                </AnimateInContainer>
                <div class="fullBlock" style="
                                        display: flex;
                                        flex-direction: column;
                ">
                    <AnimateInContainer type="slideUp" show-on-screen>
                        <TitledCollapsible title="Why is CSS so bad">
                            It worked last week and then nothing happened and now it's broken
                            <br>
                            the same code works on the vue playground
                            <br>
                            <a href="https://play.vuejs.org/#eNrNWgtv27gd/yqcbwfbXfyM07Re0q7pWrSHdTtcexgGGBhoibbYUI+JlO20y3ffjy9Zkh9102J3LeJI5P/9JuPPrRdZ1l8VrDVtXckg55kikqkiezZLeJyluSIvUyFoJvlcMLLI05i0+4PKmkZu/3mWXA0sOhDxolicCaoY3gi5qpJQXAl2PWspJtWsZfYJufn1TfWfQaoyAdjVoEKzddZSMkiTBV/2P8o0gfSfNdKsFaRxxgXL/5EpniZy1poSs6P3qBDp+iezpvKCnfn1IGLB7Z71j3Kj12atn3MmWb5is1a5p2i+ZFBAb796/3e2wXO5GadhIQB9ZPMXJlNRaBkt2E2RhBC7AmekfWt8wJPlB/lqo1givVJaUA15b+BnLXjh5RHVt+Ke9ycGb5bcw4oNRzajgAiaLLWzQG0bEZ9JApU+8OD2jKTJDVukOfs1C+Ea/f4uLRLFwjOSswW5dyHjgmSWwGlSkSxPM0muScgWPGE/67crJ6uJjymRKofWdmnNQxU9r69FjC8j1Vicp3nIcuiU5o0dKvgywVpbsIVqk/+SdsAgZW4ec02qbQEXaaLe80+sgS9hQOWMxUJsztNUMAqFjDDpiuUvYB6qLW/YcMdGrpkQoH3/rNOtGEBG6Rr6w0QdY4t+nQG5viYLKiTTOBZjnoZ3FuPqzYd3f/srX70SLIYSlrAH2rwxhnG0h5Zn3UkdKu+SgHS65PqZjxC6plyVbjUUrUEdvf6KioKBqhbDvjzvI6Ju4OwQVnopOET5hQWq0+1b35Dnz8kQdO41sTIsfgvms2QwIG/bK0ZkBkCiXUK0y8gErityiWy6Ax2iUrLgG6IiLhFgNCPpgixpPqdL5BpofCxg40Iy8pGuqM0TTd1G8atNlkrWcTppBzv2RyojylzIVyQQVEqkGXgifllYycqXiEcK6qgMDsNgCTpn4iS8N2avhm0oROOT0D/odAT25882afsmP8n9/dUgGjdpnqrL21hbtPXsagCMJhGeZIUi6i7TXcKUZgTCrEVWPVROJq5N6kh1Z7pIyCWseTcliDBNsWKigbFRdeVU8W4QZv/MaZbts9vXEIHUyEIA6sDdIWXISZEq2MH8anBqGKf67p9rTRGvxix4RBYclsynHcKV63o1hZAgwVdsm3g9yT8hI3Sd0yW1hyW3aYrxFN6Y8yTszFp/tGFhlnXWtXkCqhQ1r7VNZE1jSibZhqDr8bC23gt0vd6lWCnmhi5ZR1yxKlka3C5zXQM8ibnAkttVKCc9U/anRBd9t6zTfoHGOiURD0OW6BqhTXfUYjaHvN3KmFsI5q2iH3shz1GDrEXTtdvJaKhr1JQ8gfajceYx3Dosq1QaG+O4nRi9miflRm+7UzqjRPkGe37ZnD+Mx2O3aQzZA0Isp8S2TrcToH5q4CzlbvXL9jRFxZvTqjslQ2iDnz3ua2pilo0OpptvVTBIa2TulOhP7xuw1fGMqaJJyXd7Q2xF806vZ6CFHpe6FcqDR4SHtwjBO/JoUHE5DIZQGp2ktal6XmuXRiMWOw62b1VXDAMZYQi5hXV2vbTN35pDKhA5yxgFzSR1j7sg1i6j4fBH87ELgKFmCYgiF50Bqh5TckBzaN0L03XSl6tlafycYjy1Ao2Hw1gSRtEqzTKGD69V+V7xhinp8IAMqGD/6vRG3TbBEOVe8WYd8WUTVyp309Bb5WIkl7d2U4SOC4ztFNHZzlR/Iu1s0+52tWyI1Hp4xHTz/aiWQQbCO0SbqDWEqhdKjHdURX3jzo55lP/JVUWCR9pfEADkYqnJWc9t7bRTOwPBdXad5pDdfkPn5vDj+w2U3NOLSpVOaUcV95YFd/S4XnG9+L1NpfjXNlDTaaHSkzSbmqHf67Yvqr3Ta4cDPdm70wEC3qDp9o2gR38wYV8Gyy6ePUyUmdIZDcc/2lRpd8sUwTDhpoDKQAAT68ImCU1CDE/FYmHMO0v+YurdggZlZXILMRcwR/s95mPsvcToRXBO04e4EmjtIhPRc0bO9cdEf1zoj8f641J/PBn62mULsZZIl6Q8puKMcIVqHjgAmQe20vQHlq9mC659pRZdoANFdWC0gunxsF3WhC8p8VOR072SHxD6oLy7cmrSRjwvizmnnWTKMzwWOWf5GYnTJJUZ5D9ptHFLpoEfHmsO91YcRxDQvTmL6IprSjJOUxV5DR558V0zHD2e6uqGaMs2EJUnHZ1ZsNtqDe+uoq6vgh7+yQ48YtvBP92FHw+b8GPzdKHhR8M9CBOHgNx2CBiFPMJ4D4KXyIAZBCPRpUE430U4HzcRzg2vJwZhsosw8ToYy2iEidHhqUF4vAfBi2QEMQjmCfpqjD1mlYg/gfKynVJGTxogMQt5oUvQFmZsrgAqMGa0qYGcjxsgUdGAmDQZaYieu6kxDh73jfHH2lt10CqU1e1iB0YW8x2wy31QdUDD0lEzkTudSibsCO5jeDeT8uWcdpDn44uLM4Lfw/6lZ3ToGCEjimnHHjLJH+wtGE10WzRsebz07HA5kPesEBbcq7Bm81uuemY/zCnak9s1FFCecXGJKuBqM8BCwpDTd+sIDcjV6r6d87B1cLbZdzbRtxZ8cQf9gZ1Artq4WB20yw3b/niy4vbS1vEzr1xwBQbN45N53TkiVZXsLwohbkQa3J42m1WX60cinYz1WiYTmnktzFVafdvhqxQnA52ie3c9dQfQkHmKM7/qBREXpfkbeLbAen/GuG8zDaDWbqNRrTe4U8k203Ri+WisdapGV3pIUxEYW7bG7W8PGmWX6I9ZXFUDd0RHpbXHpH3iopP+BuKeHxfXlsffj7zZcXFNwffSeiL6FgE/e5LXpXk5h9SIez3nqdC3BbZs1dnbOaecxwwI9SCuMgoel+kcaJv40d7P3GbQ6J9vz7DfbwL64fXr1+f1m46cwqG4kDCW9XIV4vDNgk9Om/hggrtfNwfLItNlXeIPH7p6p3lnOvVV24IDuutJP9qz6feqlW1ba2pn/Pry0ZsXI/Ihlj0VFXHp6SYtHNJwL1PeM32B5cXFxeksp+hNiuMQUuNtvaIvZVCj/eWUPRtlNEdzqUrgXOgG8SPQp4gTpTn/pI9m+wQyZf9EecoW880CVU6Hhyz+Qv//CqIUow3+inGc6uSF/n8S1XkBZcum/f+MW8v5JCtNJpOvIXmSjS4vL7+GpkQCCbbHXLsXaZhMqncOp13ZnXht9/Wylmk6DVmQmz8XHhD/4DVfkVUv+b5FBJ48UITmTeMDhNjWh4dbQte17yfGg61hKubpcgRpXvmbzylpa69Uyn7YSVJFOke7Iu4OfV+sMqoKUfaYXWb+wgpfR/g3gkV/xQHfQ8D3FPqjp637/wGWLU5x">BUHHHHHHHHHHH</a>
                            <br>
                            WHY DOES IT WORK HERE???
                        </TitledCollapsible>
                    </AnimateInContainer>
                    <div style="
                                                                display: flex;
                                                                flex-direction: column;
                                                                ">
                        <div style="
                                                                            display: grid;
                                                                            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
                                                                            grid-auto-flow: dense;
                                                                            width: 100%;
                                                                            row-gap: 24px;
                                                                            column-gap: 24px;
                                                                            ">
                            <AnimateInContainer type="slideUp" show-on-screen>
                                <TitledCollapsible title="da hECK" height="100%">
                                    ?????????
                                </TitledCollapsible>
                            </AnimateInContainer>
                            <AnimateInContainer type="slideUp" show-on-screen>
                                <TitledCollapsible title="da hECK" height="100%">
                                    ?????????
                                </TitledCollapsible>
                            </AnimateInContainer>
                            <AnimateInContainer type="slideUp" show-on-screen>
                                <TitledCollapsible title="da hECK">
                                    ?????????
                                </TitledCollapsible>
                            </AnimateInContainer>
                            <AnimateInContainer type="slideUp" show-on-screen>
                                <TitledCollapsible title="da hECK">
                                    ?????????
                                </TitledCollapsible>
                            </AnimateInContainer>
                        </div>
                    </div>
                </div>
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