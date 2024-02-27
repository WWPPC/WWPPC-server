<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal } from '@/components/ui-defaults/UIDefaults';
import SuperSecretFeature from '@/components/ui-defaults/SuperSecretFeature.vue';
import ContestTimer from '@/components/ContestTimer.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const modal = ref<InstanceType<typeof FullscreenModal>>();
</script>
<script lang="ts">
import { ModalMode } from '@/components/ui-defaults/UIDefaults';
import { useServerConnectionStore } from '@/scripts/ServerConnection';
import { watch } from 'vue';
export default {
    mounted() {
        const serverConnection = useServerConnectionStore();
        watch(() => ({ conn: serverConnection.connected, err: serverConnection.connectError }), ({ conn, err }) => {
            if (!conn || err) modal.value?.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
        });
    }
}
</script>

<template>
    <PanelView>
        <PanelHeader>
            <LargeLogo></LargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Contest" for="/contest/info" :is-default=true></PanelNavButton>
                <PanelNavButton text="Problems" for="/contest/problemList"></PanelNavButton>
                <PanelNavButton text="Leaderboards" for="/contest/leaderboard"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="info" :is-default=true>
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                Your registration doesn't exist so there's no registration info to display.
            </PanelBody>
            <PanelBody name="problemList">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                This is where I would put my problem list. IF I HAD ONE.
            </PanelBody>
            <PanelBody name="problemView">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                Problem screen (programmatically loaded from problem list)
            </PanelBody>
            <PanelBody name="leaderboard">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                1. the-real-tianmu - 573736472056375629219566527959683966273843 xp
                <br>
                2. sp - 2057277575 xp
                <br>
                e. Sampleprovider(sp) - 882646562 xp
                <br>
                &pi;. SampIeprovider(sp) - -5 xp
            </PanelBody>
        </PanelMain>
    </PanelView>
    <FullscreenModal ref="modal"></FullscreenModal>
    <SuperSecretFeature :show="false"></SuperSecretFeature>
</template>