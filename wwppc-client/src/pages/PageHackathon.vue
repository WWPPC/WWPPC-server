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
import { HeaderedTable } from '@/components/ui-defaults/UIContainers';
</script>

<template>
  <PanelView name="hackathon" title="WWPHacks">
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
      <PanelBody name="default" title="Home" is-default>
        <div class="centered column">
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

          <LargeGlitchCenterText text="In Person At: TBD" style="
          font-weight: bold;
            font-size: min(calc(50vh - 30px), calc(100vw / 16));
            text-wrap: nowrap;
            color: red;;
            display:flex;
            flex:.5;
            text-shadow: 0 0 20px red;
            " :steps=1 :delay=20>
            ">
          </LargeGlitchCenterText>


          <!-- Schedule Table -->
          <div class = "schedule">
            <h1>Schedule</h1>
            <HeaderedTable width="50%" :content="{
              headers: [''],
              data: [
                  ['asdf'],
                  ['march']
              ]
            }">

            </HeaderedTable>
          </div>



        </div>

      </PanelBody>
    </PanelMain>
  </PanelView>
</template>

<style>
.row {
  display:flex;
  flex-flow: row wrap;
  flex-direction: row;
  justify-items: stretch;
  justify-content: space-evenly;
  row-gap: 20px;
}

.schedule>h1 {
  margin-top:6vh;
}
.column {
  display:flex;
  flex-direction: column;
}
</style>
