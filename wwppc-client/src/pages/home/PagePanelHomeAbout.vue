<script setup lang="ts">
import ContactFooter from '@/components/ContactFooter.vue';
import HomeAboutCreditsCard from '@/components/home/about/HomeAboutCreditsCard.vue';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock">
        <a name="pageAboutScrollTo"></a>
        <div class="centered">
            <GlitchText text="WWPPC Team" font-size="var(--font-title)" color="lime" glow shadow random :steps=1></GlitchText>
        </div>
        <br>
        <br>
        <div class="aboutCreditsTable">
            <HomeAboutCreditsCard name="Rishikesh Anabathula" roles="Project Lead<br>Lead Problem Setter<br>Backend Developer" img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARxSURBVHhe7dy9SiRZAAXgdkeMzHwHAw0EQzNfREQwEVEMDAQfrp/DSBNB0MA2M3C3Zy1mZZ3rtP1TXXXP9yXFNavmnu5zEgcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAPG1vb29tbTUHiLKzs/P09DQajTY3N5s/QYjx7b+7u/v7X+MM+B0gyN7e3s3Nzfvtf3d/fy8DRBj3/sfHx+bif/D8/CwDVO699zdX/hN7gJp97P0l9gB1+tz7S+wBalPq/SX2APX4uveX2APUYJLeX2IP0G+T9/4Se4C++m7vL7EH6J/pen+JPUCfzNL7S+wB+mH23l9iD9B18+r9JfYA3TXf3l9iD9BFi+j9JfYA3bK43l9iD9AVi+79JfYAy9dO7y+xB1imNnt/iT3AcrTf+0vsAdq2rN5fYg/QnuX2/hJ7gDZ0ofeX2AMsVnd6f4k9wKJ0rfeX2APMXzd7f4k9wDx1ufeX2APMR/d7f4k9wKz60vtL7AGm16/eX2IPMI0+9v4Se4Dv6W/vL7EHmFTfe3+JPcCf1dH7S+wBvlJT7y+xB/i9+np/iT3A/9Xa+0vsAf5Td+8vsQf4KaH3l9gD6XJ6f4k9kCut95eE74GV5hlmfX399vZ2Y2OjOWcb/w7s7u4+PDw05yQ/mmeY19fXtbW1/f39lZXQr4Bfxj8CV1dXw+GwOZPj9PT0vQbEent7u7y8bD4OAh0fHzd3Ic/Ly8vR0dHq6mrzWZDp4OBg/EXYXIoYo9Ho7OzM7een6+vrqAyMX/bk5KR5eRjL2QN6P7+XsAf0fr5S9x7Q+/mzWveA3s+k6tsDej/fU9Me0PuZRh17QO9nen3fA3o/s+rvHtD7mY8+7gG9n3nq1x7Q+5m/vuwBvZ9F6f4e0PtZrC7vAb2fNnRzD+j9tKdre0Dvp23d2QN6P8vRhT2g97NMy90Dej/Lt6w9oPfTFe3vAb2fbmlzD+j9dFE7e0Dvp7sWvQf0frpucXtA76cfFrEH9H76ZL57QO+nf+a1B/R++mr2PaD302+z7AG9nxpMtwf0furx3T2g91ObyfeA3k+dJtkDej81+3oP6P3Ur7QH9H5SfN4Dej9ZPu4BvZ9E73tA7yfXeA/o/QAAAAAAAAAAAAAAAAAAAAAAAAAAsVaaJ4PB4eHh+fl5c6jXxcXFcDhsDvDLOADNPyyv2vg1mxdmMPireUIkASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBsMPgHSaq6IM8BzA4AAAAASUVORK5CYII=" codeforces="CutSandstone" github="CutSandstone" discord="559131662143979534"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Jie Gao" roles="Lead Frontend Developer<br>Lead Backend Developer" img="/img/jie-gao.jpg" github="spsquared" discord="587770060462882854" youtube="@sp-squared"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Erik Ji" roles="Frontend Developer<br>Backend Developer<br>Problem Setter" img="/img/erik-ji.jpg" codeforces="passwordisa" github="erikji" discord="688018118492291080"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Suvanth Erranki" roles="Problem Setter<br>Backend Developer" img="/img/suvanth-erranki.jpg" codeforces="susvant" github="Suvanth-Erranki" discord="812014506724556820"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Vikram Karamsetty" roles="Frontend Developer" img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARxSURBVHhe7dy9SiRZAAXgdkeMzHwHAw0EQzNfREQwEVEMDAQfrp/DSBNB0MA2M3C3Zy1mZZ3rtP1TXXXP9yXFNavmnu5zEgcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAPG1vb29tbTUHiLKzs/P09DQajTY3N5s/QYjx7b+7u/v7X+MM+B0gyN7e3s3Nzfvtf3d/fy8DRBj3/sfHx+bif/D8/CwDVO699zdX/hN7gJp97P0l9gB1+tz7S+wBalPq/SX2APX4uveX2APUYJLeX2IP0G+T9/4Se4C++m7vL7EH6J/pen+JPUCfzNL7S+wB+mH23l9iD9B18+r9JfYA3TXf3l9iD9BFi+j9JfYA3bK43l9iD9AVi+79JfYAy9dO7y+xB1imNnt/iT3AcrTf+0vsAdq2rN5fYg/QnuX2/hJ7gDZ0ofeX2AMsVnd6f4k9wKJ0rfeX2APMXzd7f4k9wDx1ufeX2APMR/d7f4k9wKz60vtL7AGm16/eX2IPMI0+9v4Se4Dv6W/vL7EHmFTfe3+JPcCf1dH7S+wBvlJT7y+xB/i9+np/iT3A/9Xa+0vsAf5Td+8vsQf4KaH3l9gD6XJ6f4k9kCut95eE74GV5hlmfX399vZ2Y2OjOWcb/w7s7u4+PDw05yQ/mmeY19fXtbW1/f39lZXQr4Bfxj8CV1dXw+GwOZPj9PT0vQbEent7u7y8bD4OAh0fHzd3Ic/Ly8vR0dHq6mrzWZDp4OBg/EXYXIoYo9Ho7OzM7een6+vrqAyMX/bk5KR5eRjL2QN6P7+XsAf0fr5S9x7Q+/mzWveA3s+k6tsDej/fU9Me0PuZRh17QO9nen3fA3o/s+rvHtD7mY8+7gG9n3nq1x7Q+5m/vuwBvZ9F6f4e0PtZrC7vAb2fNnRzD+j9tKdre0Dvp23d2QN6P8vRhT2g97NMy90Dej/Lt6w9oPfTFe3vAb2fbmlzD+j9dFE7e0Dvp7sWvQf0frpucXtA76cfFrEH9H76ZL57QO+nf+a1B/R++mr2PaD302+z7AG9nxpMtwf0furx3T2g91ObyfeA3k+dJtkDej81+3oP6P3Ur7QH9H5SfN4Dej9ZPu4BvZ9E73tA7yfXeA/o/QAAAAAAAAAAAAAAAAAAAAAAAAAAsVaaJ4PB4eHh+fl5c6jXxcXFcDhsDvDLOADNPyyv2vg1mxdmMPireUIkASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBsMPgHSaq6IM8BzA4AAAAASUVORK5CYII=" github="VikramKaramsetty" discord="660497297074814976"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Maitian Sha" roles="Problem Setter" img="/img/not-jie-gao.jpeg" codeforces="spuh" github="SampleProvider" discord="706967946198777867" youtube="watch?v=dQw4w9WgXcQ"></HomeAboutCreditsCard>
        </div>
        <ContactFooter></ContactFooter>
    </div>
</template>

<style scoped>
.aboutCreditsTable {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    width: 100%;
    justify-items: center;
    row-gap: 16px;
    column-gap: 16px;
}
</style>