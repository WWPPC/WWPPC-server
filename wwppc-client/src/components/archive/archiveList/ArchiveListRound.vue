<script setup lang="ts">
import { autoGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import { AnimateInContainer, TitledCollapsible } from '@/components/ui-defaults/UIContainers';
import { useUpsolveManager, type UpsolveProblem, type UpsolveRound, type UpsolveSubmission } from '@/scripts/UpsolveManager';
import ContestProblemListProblem from '@/components/contest/problemList/ContestProblemListProblem.vue';
import { onMounted, ref, watch } from 'vue';
import { type ContestProblem, ContestProblemCompletionState } from '@/scripts/ContestManager';
import { globalModal, UILoadingBar } from '@/components/ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';

const props = defineProps<{
    data: UpsolveRound
    minimized?: boolean
}>();

const modal = globalModal();
const serverConnection = useServerConnection();
const upsolveManager = useUpsolveManager();

const titleText = autoGlitchTextTransition(() => 'Round ' + (props.data.number + 1), 40, 1, 10, 2);
const problems = ref<ContestProblem[] | null>(null);
let loaded = false;
const load = async () => {
    if (loaded) return;
    problems.value = await Promise.all(props.data.problems.map(async (id, i): Promise<ContestProblem> => {
        const problem: UpsolveProblem | Error = await upsolveManager.getProblemData(props.data.contest, props.data.number, i);
        if (problem instanceof Error) {
            modal.showModal({ title: problem.message, content: `Problem could not be fetched: ${props.data.contest} ${props.data.number}-${i}` })
            return {
                id: '',
                contest: '',
                round: 0,
                number: 0,
                name: 'Error',
                author: '',
                content: 'An error occured and the problem could not be loaded',
                constraints: { time: 0, memory: 0 },
                submissions: [],
                status: ContestProblemCompletionState.ERROR
            };
        }
        const submissions: UpsolveSubmission[] = (await upsolveManager.getSubmissions(id)) ?? [];
        return {
            ...problem,
            submissions: submissions,
            status: submissions[0]?.status ?? ContestProblemCompletionState.NOT_UPLOADED
        };
    }));
    loaded = true;
};
onMounted(async () => {
    if (!props.minimized) load();
});
if (!props.minimized) {
    serverConnection.onconnect(load);
    watch(() => serverConnection.loggedIn, load);
}
</script>

<template>
    <TitledCollapsible :title="titleText" class="archiveListRoundDropdown" :start-collapsed="$props.minimized" @open="load()">
        <AnimateInContainer type="fade" v-for="(problem, index) of problems" :key="index" :delay="index * 50">
            <ContestProblemListProblem :data="problem" archive></ContestProblemListProblem>
        </AnimateInContainer>
        <div class="centered" v-if="problems == null" style="margin: 8px 0px;">
            <UILoadingBar width="max(50%, 100px)" height="16px"></UILoadingBar>
        </div>
    </TitledCollapsible>
</template>

<style scoped>
.archiveListRoundDropdown {
    margin: -4px -4px;
}
</style>