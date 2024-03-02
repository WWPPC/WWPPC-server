<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelView } from '@/components/panels/PanelManager';
import { UIButton, UITextBox } from '@/components/ui-defaults/UIDefaults';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';

</script>

<template>
    <PanelView name="login">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="login" :isDefault="true">
                <!-- matrix rain? that's overdone -->
                <!-- some other cool effect in the background -->
                <!-- line of glitches following the mouse? -->
                <div class="centered">
                    <div class="loginFlow">
                        <img src="/logo.svg" class="loginLogoFloater">
                        <form class="loginForm" onsubmit="return false;">
                            <UITextBox placeholder="Username" style="margin-bottom: 8px;" width="208px" title="Username" autocomplete="username"></UITextBox>
                            <UITextBox placeholder="Password" type="password" style="margin-bottom: 8px;" width="208px" title="Password" autocomplete="current-password"></UITextBox>
                            <span>
                                <UIButton text="Log In" type="submit" width="100px" :glitchOnMount=true></UIButton>
                                <UIButton text="Sign Up" type="button" width="100px" :glitchOnMount=true></UIButton>
                            </span>
                        </form>
                    </div>
                </div>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style>
.loginLogoFloater {
    display: block;
    height: 40vh;
    animation: bob 10000ms cubic-bezier(0.7, 0, 0.3, 1) infinite;
}

.loginFlow, .loginForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 40vw;
}

@keyframes bob {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-2vh);
    }

    100% {
        transform: translateY(0);
    }
}
</style>