<script setup lang="ts">
import { setTitlePanel } from '@/scripts/title';
import { DoubleCutCornerContainer, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { globalModal, UIButton, UIDropdown, UIFileUpload, UIIconButton } from '@/components/ui-defaults/UIDefaults';
import { completionStateString, ContestProblemCompletionState, ContestUpdateSubmissionResult, getUpdateSubmissionMessage, type ContestProblem } from '@/scripts/ContestManager';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { autoGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import WaitCover from '@/components/common/WaitCover.vue';
import latexify from '@/scripts/katexify';
import ContestProblemStatusCircle from '@/components/contest/ContestProblemStatusCircle.vue';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import ContestProblemSubmissionCase from '@/components/contest/ContestProblemSubmissionCase.vue';
import { useUpsolveManager } from '@/scripts/UpsolveManager';

const route = useRoute();
const router = useRouter();
const serverConnection = useServerConnection();
const upsolveManager = useUpsolveManager();
const modal = globalModal();

// placeholder data behind loading cover
let problemId = '';
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
    constraints: { memory: 0, time: 0 },
    submissions: [],
    status: ContestProblemCompletionState.ERROR,
});
const loadErrorModal = (title: string, content: string) => {
    modal.showModal({
        title: title,
        content: content + '<br>Click <code>OK</code> to return to archive problem list.',
        color: 'red'
    }).result.then(() => {
        router.push(`/contest/archive/${route.params.archiveContest}`);
    });
};
const loadProblem = async () => {
    if (route.query.ignore_server !== undefined) return;
    if (isNaN(Number(route.params.archiveRound)) || isNaN(Number(route.params.archiveProblem))) {
        loadErrorModal('Invalid round or problem number', 'The round or problem is not a number.');
        return;
    }
    const p = await upsolveManager.getProblemData(route.params.archiveContest.toString(), Number(route.params.archiveRound), Number(route.params.archiveProblem));
    if (p instanceof Error) {
        loadErrorModal(p.message, 'Could not load the problem.');
        return;
    }
    problem.value = {
        ...p,
        submissions: [],
        status: ContestProblemCompletionState.NOT_UPLOADED
    };
    problemId = p.id;
    updateSubmissions();
};
onMounted(loadProblem);
const updateSubmissions = () => {
    setTimeout(async () => {
        const s = await upsolveManager.getSubmissions(problemId) ?? [];
        problem.value.submissions = s;
        problem.value.status = s[0]?.status ?? ContestProblemCompletionState.NOT_UPLOADED;
    }, 100);
};
watch(() => upsolveManager.submissionsUpdated, updateSubmissions);
watch(() => serverConnection.loggedIn, updateSubmissions);

watch(() => problem.value.name, () => {
    setTitlePanel(problem.value.name);
});
const problemName = autoGlitchTextTransition(() => problem.value.name, 40, 1, 20);
const problemSubtitle1 = autoGlitchTextTransition(() => {
    if (problem.value.contest === undefined) return `By ${problem.value.author}`;
    return `${problem.value.contest} ${problem.value.round + 1}-${problem.value.number + 1}; by ${problem.value.author}`;
}, 40, 1, 20);
const problemSubtitle2 = autoGlitchTextTransition(() => `${problem.value.constraints.memory}MB, ${problem.value.constraints.time}ms&emsp;|&emsp;${completionStateString(problem.value.status)}`, 40, 1, 20);

// copy spaghetti paste

// uploads
const fileUpload = ref<InstanceType<typeof UIFileUpload>>();
const languageDropdown = ref<InstanceType<typeof UIDropdown>>();
const submit = ref<InstanceType<typeof UIButton>>();
const handleUpload = () => {
    const file: File | undefined | null = fileUpload.value?.files?.item(0);
    if (fileUpload.value == undefined || file == undefined) return;
    if (file.size > serverConnection.serverConfig.maxSubmissionSize) {
        fileUpload.value.resetFileList();
        modal.showModal({
            title: 'File size too large',
            content: 'The maximum file size for submissions is 10kB',
            color: 'red'
        });
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
const submitUpload = async () => {
    if (languageDropdown.value?.value == undefined || languageDropdown.value?.value == '' || fileUpload.value == null || fileUpload.value.files == null) {
        return;
    }
    const file = fileUpload.value.files.item(0);
    if (file == null) {
        modal.showModal({ title: 'No file selected', content: 'No file was selected!', color: 'red' });
        return;
    }
    const status = await upsolveManager.updateSubmission(problem.value.id, (languageDropdown.value.value as string), await file.text());
    if (status != ContestUpdateSubmissionResult.SUCCESS) {
        modal.showModal({ title: 'Could not submit', content: getUpdateSubmissionMessage(status), color: 'red' })
    } else {
        modal.showModal({ title: 'Submission uploaded', content: 'Grading will happen soon', color: 'lime' });
    }
    fileUpload.value.resetFileList();
    languageDropdown.value.value = '';
};

// thing for katex
const problemContent = ref('');
watch(problem, () => {
    latexify(problem.value.content).then((html) => problemContent.value = html);
});
onMounted(() => {
    latexify(problem.value.content).then((html) => problemContent.value = html);
});
</script>

<template>
    <div style="margin-left: -4px;">
        <UIIconButton :text="`Back to ${route.params.archiveContest}`" img="/assets/arrow-left.svg" @click="$router.push('/contest/archive/' + route.params.archiveContest)" color="lime"></UIIconButton>
    </div>
    <div class="problemViewPanel">
        <div class="problemViewDouble">
            <TitledCutCornerContainer :title="problemName" style="grid-row: span 3;" vertical-flipped no-padding>
                <div class="problemViewSubtitle">
                    <span v-html="problemSubtitle1" style="font-weight: bold; grid-row: 1;"></span>
                    <span v-html="problemSubtitle2" style="grid-row: 2;"></span>
                    <ContestProblemStatusCircle :status="problem.status" style="grid-row: span 2;"></ContestProblemStatusCircle>
                </div>
                <div class="problemViewContent" v-html="problemContent"></div>
                <WaitCover class="problemLoadingCover" text="Loading..." :show="problem.id == 'loading' && route.query.ignore_server === undefined"></WaitCover>
            </TitledCutCornerContainer>
            <DoubleCutCornerContainer>
                <div style="text-align: center;">
                    <h3>Submit</h3>
                    <p style="text-align: center; font-size: var(--font-small);">
                        <b>You are submitting in analysis mode.</b>
                        <br>
                        <i>Java and Python submissions have double the stated time limit.</i>
                    </p>
                </div>
                <br>
                <form class="problemViewSubmitForm" action="javascript:void(0)">
                    <div class="problemViewSubmitFormInner">
                        <span>Source code:</span>
                        <UIFileUpload ref="fileUpload" @input=handleUpload accept=".c,.cpp,.py,.java"></UIFileUpload>
                        <span>Language:</span>
                        <UIDropdown ref="languageDropdown" :items="serverConnection.serverConfig.acceptedLanguages.map((a) => ({ text: a, value: a }))" required></UIDropdown>
                    </div>
                    <UIButton ref="submit" text="Upload Submission" type="submit" width="min-content" @click=submitUpload :disabled="!serverConnection.loggedIn || languageDropdown?.value == undefined || languageDropdown?.value == '' || fileUpload?.files == null || fileUpload?.files?.item(0) == null"></UIButton>
                </form>
                <div style="text-align: center; color: yellow;" v-if="!serverConnection.loggedIn">
                    <i>You must be signed in to submit solutions</i>
                </div>
            </DoubleCutCornerContainer>
            <DoubleCutCornerContainer flipped>
                <h3 class="submissionsHeader">Previous submissions</h3>
                <AnimateInContainer type="fade" v-for="(submission, index) in problem.submissions" :key="submission.time" :delay="index * 50">
                    <div class="submissionContainer">
                        <label class="submissionTitle" :for="'submissionCheckbox' + index">
                            <ContestProblemStatusCircle :status="submission.status"></ContestProblemStatusCircle>
                            <span>{{ completionStateString(submission.status) }} ({{ submission.lang }} - {{ new Date(submission.time).toLocaleString() }})</span>
                        </label>
                        <input type="checkbox" class="submissionCheckbox" :id="'submissionCheckbox' + index">
                        <div class="submissionDetailsWrapper">
                            <div class="submissionDetails">
                                <ContestProblemSubmissionCase v-for="(testCase, index2) in submission.scores" :key="index2" :case="testCase" :number="index2"></ContestProblemSubmissionCase>
                                <div style="text-align: center; font-size: var(--font-tiny);" v-if="submission.scores.length == 0">
                                    <i>Please wait while the grading system runs your submission...</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimateInContainer>
                <div v-if="problem.submissions.length == 0 && serverConnection.loggedIn" style="text-align: center;"><i>You have not submitted any solutions yet.</i></div>
                <div style="text-align: center; color: yellow;" v-if="!serverConnection.loggedIn">
                    <i>You must be signed in to submit solutions</i>
                </div>
            </DoubleCutCornerContainer>
        </div>
    </div>
</template>

<style scoped>
.problemViewPanel {
    display: flex;
    flex-direction: column;
    height: calc(100% - 48px);
    margin-top: 16px;
}

.previousProblemStatusCircle {
    grid-row: 2;
}

.problemStatus {
    grid-column: 2;
    grid-row: 3;
    font-size: 20px;
}

.previousProblemListName {
    grid-column: 2;
    column-width: 10000px;
    grid-row: 1;
    margin: 10%;
    font-size: 20px;
}

.problemViewDouble {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 35vw);
    grid-template-rows: min-content minmax(200px, min-content) minmax(0, 1fr);
    row-gap: 16px;
    column-gap: 16px;
    height: 100%;
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
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: 1fr 1fr;
    box-sizing: border-box;
    width: calc(100% - 16px);
    padding: 8px 12px;
    margin: 8px 8px;
    border-radius: 8px;
    background-color: #333;
    font-weight: normal;
    font-family: 'Source Code Pro', Courier, monospace;
    font-size: var(--font-small);
    align-items: center;
}

.problemViewContent {
    margin: 0px 8px;
    padding-bottom: 8px;
    font-size: var(--font-small);
    text-align: justify;
}

.problemLoadingCover {
    position: sticky;
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

.submissionsHeader {
    position: sticky;
    top: 6px;
    width: 100%;
    padding: 0px 4px;
    text-align: center;
    background-color: black;
    box-shadow: 0px 0px 8px 4px black;
    margin-bottom: 12px;
    transform: translateX(-4px);
    z-index: 1;
}

.submissionsHeader::after {
    content: ' ';
    position: absolute;
    top: -20px;
    left: 0px;
    width: 100%;
    height: 20px;
    background-color: black;
}

.submissionContainer {
    display: flex;
    flex-direction: column;
    background-color: #222;
    border: 2px solid white;
    border-radius: 8px;
    margin-bottom: 8px;
}

.submissionTitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 4px;
    border: 2px solid white;
    margin: -2px -2px;
    border-radius: 8px;
    column-gap: 16px;
    background-color: #333;
    transition: 50ms linear background-color;
    cursor: pointer;
}

.submissionTitle:hover {
    background-color: #444;
}

.submissionCheckbox {
    position: absolute;
    width: 0px;
    height: 0px;
    visibility: hidden;
}

.submissionDetailsWrapper {
    position: relative;
    box-sizing: border-box;
    transition: 200ms ease min-height, 200ms ease max-height;
    min-height: 0px;
    max-height: 0px;
    overflow-x: scroll;
    overflow-y: hidden;
}

.submissionCheckbox:checked~.submissionDetailsWrapper {
    min-height: 76px;
    max-height: 76px;
}

.submissionDetailsWrapper::-webkit-scrollbar {
    height: 0px;
}

.submissionDetails {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 5px 4px;
    min-width: min-content;
    column-gap: 4px;
}
</style>