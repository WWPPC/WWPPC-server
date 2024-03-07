<script setup lang="ts">
import {
  PanelBody,
  PanelHeader,
  PanelMain,
  PanelNavButton,
  PanelNavList,
  PanelRightList,
  PanelView
} from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
import GlowText from "@/components/ui-defaults/GlowText.vue";
import LargeGlitchCenterText from "@/components/LargeGlitchCenterText.vue";
</script>

<template>
  <PanelView name="hackathon">
    <PanelHeader>
      <PanelNavLargeLogo></PanelNavLargeLogo>
      <PanelNavList>
        <PanelNavButton text="Home" for="/home"></PanelNavButton>
        <PanelNavButton text="Other Button" for="/extra"></PanelNavButton>
      </PanelNavList>
      <PanelRightList>
        <UserDisp></UserDisp>
      </PanelRightList>
    </PanelHeader>


    <PanelMain>
      <PanelBody name="default" is-default>
        <div class="centered ">
          <LargeGlitchCenterText text="WWP-HACKS" style="
            font-weight: bold;
            font-size: min(calc(50vh - 30px), calc(100vw / 16));
            text-wrap: nowrap;
            color: green;;
            display:flex;
            flex:.5;
            text-shadow: 0 0 20px green;
            " :steps=1 :delay=20>
          </LargeGlitchCenterText>
        </div>
      </PanelBody>
    </PanelMain>
  </PanelView>
</template>