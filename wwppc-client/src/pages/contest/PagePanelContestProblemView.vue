<script setup lang="ts">
import { setTitlePanel } from '@/scripts/title';
import { DoubleCutCornerContainer, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { globalModal, UIButton, UIDropdown, UIFileUpload, UIIconButton } from '@/components/ui-defaults/UIDefaults';
import { ContestProblemCompletionState, completionStateString, type ContestProblem, type ContestSubmission } from '@/scripts/ContestManager';
import { ref, watch, onMounted } from 'vue';
import { useContestManager } from '@/scripts/ContestManager';
import { useRoute, useRouter } from 'vue-router';
import { autoGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import WaitCover from '@/components/WaitCover.vue';
import latexify from '@/scripts/katexify';

const route = useRoute();
const router = useRouter();
const contestManager = useContestManager();
const modal = globalModal();

// placeholder data behind loading cover
const problem = ref<ContestProblem>({
    id: 'loading',
    contest: 'WWPIT Loading Contest',
    round: 0,
    number: 0,
    name: 'Loading Problem...',
    author: 'Loading Screen',
    content: `
<b>Lorem ipsum dolor sit amet</b>,
<br><br>
<a href="https://wwppc.tech">c</a>onsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
<br><br>
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. $\\sum_{i=0}^{\\infty}$ Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
<br><br>
<codeblock>function sum(a, b) {
    if (b > a) {
        let c = a;
        a = b;
        b = c;
    }
    let sum = a;
    let i = 0;
    do {
        sum++;
        i = i + 1;
    } while (i < b);
    return sum;
}
</codeblock>
    `,
    constraints: { memory: 1, time: -1 },
    status: ContestProblemCompletionState.ERROR
});
const submission = ref<ContestSubmission>();
const loadErrorModal = (title: string, content: string) => {
    modal.showModal({ title: title, content: content + '<br>Click <code>OK</code> to return to problem list.', color: 'red' }).then(() => {
        router.push(`/contest/problemList`);
    });
};
onMounted(async () => {
    if (route.params.problemId !== undefined) {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.exec(route.params.problemId.toString())) {
            loadErrorModal('Malformed problem ID', 'The supplied problem ID is invalid!');
            return;
        }
        const { problem: p, submission: s } = await contestManager.getProblemDataId(route.params.problemId.toString());
        if (p === null) {
            loadErrorModal('Problem not found', 'The requested problem does not exist!');
            return;
        }
        problem.value = p;
        if (s !== null) {
            submission.value = s;
        }
    } else if (route.params.problemRound !== undefined && route.params.problemNumber !== undefined) {
        const { problem: p, submission: s } = await contestManager.getProblemData(Number(route.params.problemRound.toString()), Number(route.params.problemNumber.toString()));
        if (p === null) {
            loadErrorModal('Problem not found', 'The requested problem does not exist!');
            return;
        }
        problem.value = p;
        if (s !== null) {
            submission.value = s;
        }
    } else if (route.query.ignore_server === undefined) {
        loadErrorModal('No problem ID', 'No problem ID was supplied!');
    }
});

watch(() => problem.value.name, () => {
    setTitlePanel(problem.value.name);
});
const problemName = autoGlitchTextTransition(() => problem.value.name, 40, 1, 20);
//change problemSubtitle1 to have UUID of problem isntead of round-number?
const problemSubtitle1 = autoGlitchTextTransition(() => `Problem ${problem.value.round}-${problem.value.number}; by ${problem.value.author}`, 40, 1, 20);
const problemSubtitle2 = autoGlitchTextTransition(() => `${problem.value.constraints.memory}MB, ${problem.value.constraints.time}ms&emsp;|&emsp;${completionStateString(problem.value.status)}`, 40, 1, 20);

// uploads
const fileUpload = ref<InstanceType<typeof UIFileUpload>>();
const languageDropdown = ref<InstanceType<typeof UIDropdown>>();
const handleUpload = () => {
    const file: File | undefined | null = fileUpload.value?.files?.item(0);
    if (fileUpload.value == undefined || file == undefined) return;
    if (file.size > 10240) {
        fileUpload.value.resetFileList();
        modal.showModal({ title: 'File size too large', content: 'The maximum file size for submissions is 10kB', color: 'red' });
        return;
    }
    const ext = file.name.split(".").at(-1);
    if (languageDropdown.value == undefined || ext == undefined) return;
    const options = Array.from(languageDropdown.value.items).reverse();
    for (const option of options) {
        if (option.value.includes(ext)) {
            languageDropdown.value.value = option.value;
            break;
        }
    }
};
</script>

<template>
    <div style="margin-left: -4px;">
        <UIIconButton text="Back to Problem List" img="/assets/arrow-left.svg" @click="$router.push('/contest/problemList')" color="lime"></UIIconButton>
    </div>
    <div class="problemViewPanel">
        <div class="problemViewDouble">
            <TitledCutCornerContainer :title="problemName" style="grid-row: span 3;" vertical-flipped>
                <div class="problemViewSubtitle">
                    <span v-html="problemSubtitle1"></span>
                    <span v-html="problemSubtitle2"></span>
                </div>
                <div class="problemViewContent" v-html="latexify(problem.content)"></div>
                <WaitCover text="Loading..." :show="problem.id == 'loading' && route.query.ignore_server === undefined"></WaitCover>
            </TitledCutCornerContainer>
            <DoubleCutCornerContainer>
                <div style="text-align: center;">
                    <h3>Submit</h3>
                    <div style="text-align: justify;">
                        Submissions are not graded until the round is over, but you can update your submission at any time.
                    </div>
                </div>
                <br>
                <form class="problemViewSubmitForm" action="javascript:void(0)">
                    <div class="problemViewSubmitFormInner">
                        <span>Source code:</span>
                        <UIFileUpload ref="fileUpload" @input=handleUpload accept=".c,.cpp,.py,.java"></UIFileUpload>
                        <span>Language:</span>
                        <UIDropdown ref="languageDropdown" :items="[
                            { text: 'Java 8', value: 'java8' },
                            { text: 'Java 17', value: 'java17' },
                            { text: 'Java 21', value: 'java21' },
                            { text: 'C', value: 'c' },
                            { text: 'C++ 11', value: 'cpp11' },
                            { text: 'C++ 17', value: 'cpp17' },
                            { text: 'Python 3.6.9', value: 'py369' }
                        ]" required></UIDropdown>
                    </div>
                    <UIButton text="Upload Submission" type="submit" width="min-content" @click=undefined></UIButton>
                </form>
            </DoubleCutCornerContainer>
            <DoubleCutCornerContainer flipped>
                Previous submission:
                <div>{{ submission ?? 'no submission yet!' }}</div>
                <!--format this oof (maybe a component?)-->
            </DoubleCutCornerContainer>
        </div>
    </div>
</template>

<style scoped>
.problemViewPanel {
    display: flex;
    flex-direction: column;
    height: calc(100% - 32px);
}

.problemViewDouble {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, min-content);
    grid-template-rows: minmax(0, min-content) minmax(0, min-content) minmax(0, 1fr);
    row-gap: 16px;
    column-gap: 16px;
    height: 100%;
    margin-top: 16px;
}

@media (max-width: 800px) {
    .problemViewPanel {
        height: unset;
    }

    .problemViewDouble {
        grid-template-columns: 1fr;
    }
}

.problemViewSubtitle {
    display: flex;
    width: calc(100% - 16px);
    justify-content: space-between;
    padding: 8px 8px;
    margin-bottom: 8px;
    border-radius: 8px;
    background-color: #333;
    font-weight: normal;
    font-size: var(--font-small);
}

.problemViewContent {
    font-size: var(--font-small);
    text-align: justify;
}

.problemViewSubmitForm {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.problemViewSubmitFormInner {
    display: grid;
    grid-template-columns: max-content min-content;
    row-gap: 8px;
    column-gap: 8px;
    margin-bottom: 4px;
}

.problemViewSubmitFormInner>*:nth-child(odd) {
    justify-self: right;
}
</style>