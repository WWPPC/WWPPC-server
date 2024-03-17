<script setup lang="ts">
import { setTitlePanel } from '@/scripts/title';
import { DoubleCutCornerContainer, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { UIButton, UIDropdown, UIFileUpload, UIIconButton } from '@/components/ui-defaults/UIDefaults';
import { ContestProblemCompletionState, type ContestProblem } from '@/scripts/ContestManager';
import { ref, watch, type Ref } from 'vue';
import katex from 'katex';

// load problem information from server
const problem: Ref<ContestProblem> = ref({
    id: 'buh',
    division: 0,
    round: 0,
    number: 0,
    name: 'Problem Name',
    author: '<img src="" onerror="alert(`buh`)"/>',
    content: `<b>Lorem ipsum dolor sit amet</b>, <a href="https://wwppc.tech">c</a>onsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. $\\sum_{i=0}^{\\infty}$ Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    constraints: { memory: 1, time: -1 },
    status: ContestProblemCompletionState.ERROR
});

const statusToDescription = (status: ContestProblemCompletionState) => {
    return status == ContestProblemCompletionState.NOT_UPLOADED ? 'Not uploaded' :
        status == ContestProblemCompletionState.UPLOADED ? 'Uploaded' :
            status == ContestProblemCompletionState.SUBMITTED ? 'Submitted' :
                status == ContestProblemCompletionState.GRADED_PASS ? 'Accepted' :
                    status == ContestProblemCompletionState.GRADED_FAIL ? 'Failed' :
                        status == ContestProblemCompletionState.GRADED_PARTIAL ? 'Partially accepted' : 'Error fetching status'
}

const latexify = (str: string) => {
    //math rendering errors are handled by katex itself since throwOnError=false
    return str.replace(/\$\$.+\$\$/gm, (match) => {
        try {
            return katex.renderToString(match.substring(2, match.length-2).trim(), {throwOnError: false});
        } catch (e) {
            console.error(e);
            return "<span style='color: red'>Math error</span>";
        }
    }).replace(/\$.+\$/gm, (match) => {
        try {
            return katex.renderToString(match.substring(1, match.length-1).trim(), {throwOnError: false});
        } catch (e) {
            console.error(e);
            return "<span style='color: red'>Math error</span>";
        }
    });
}

watch(() => problem.value.name, () => {
    setTitlePanel(problem.value.name);
});

// uploads
const fileUpload = ref<InstanceType<typeof UIFileUpload>>();
const languageDropdown = ref<InstanceType<typeof UIDropdown>>();
// typescript kept complaining about "var" and semicolons
const sanitizeUpload = () => {
    const file: File | undefined | null = fileUpload.value?.files?.item(0);
    if (fileUpload.value == undefined || file == undefined) return;
    if (file.size > 10240) {
        fileUpload.value.files;
        //show an error idk
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
}
</script>

<template>
    <div style="margin-left: -4px;">
        <UIIconButton text="Back to Problem List" img="/assets/arrow-left.svg" @click="$router.push('/contest/problemList')" color="lime"></UIIconButton>
    </div>
    <div class="problemViewPanel">
        <div class="problemViewDouble">
            <TitledCutCornerContainer :title="problem.name" vertical-flipped>
                <div class="problemViewSubtitle">
                    <span>Problem {{ problem.round }}-{{ problem.number }}; by {{ problem.author }}</span>
                    <span>{{ problem.constraints.memory }}MB, {{ problem.constraints.time }}ms</span>
                    <span>{{ statusToDescription(problem.status) }}</span>
                </div>
                <div class="problemViewContent" v-html="latexify(problem.content)"></div>
            </TitledCutCornerContainer>
            <div>
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
                            <UIFileUpload ref="fileUpload" @input=sanitizeUpload accept=".c,.cpp,.py,.java"></UIFileUpload>
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
            </div>
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
    grid-template-columns: 1fr min-content;
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
    font-size: 18px;
}

.problemViewContent {
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