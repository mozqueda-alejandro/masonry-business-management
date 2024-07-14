<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import ToggleSwitch from "primevue/toggleswitch";

const store = useGlobalNavigationStore();
const { changeView } = store;
import { NavigationCommand } from "~/types/enums";


const selectedLayUpChallenges = ref();
const layUpChallenges = [
  { label: "Inaccessible to Lay Up", value: "InaccessibleToLayUp" },
  { label: "In Between Trees", value: "InBetweenTrees" },
  { label: "8 Inch Block", value: "EightInchBlock" },
  { label: "Wall Pattern", value: "WallPattern" },
  { label: "Next to Pipes", value: "NextToPipes" },
  { label: "Insurance Paid", value: "InsurancePaid" }
];

const selectedStockChallenges = ref();
const stockChallenges = [
  { label: "Stock Changes", value: "StockChanges" },
  { label: "Far From Wall", value: "FarFromWall" },
  { label: "Outside Corner Lot", value: "OutsideCornerLot" },
  { label: "Cover Pool", value: "CoverPool" },
  { label: "Cover Landscape", value: "CoverLandscape" },
  { label: "Cover Concrete", value: "CoverConcrete" },
  { label: "Inaccessible to Stock", value: "InaccessibleToStock" }
];

const pumpForFooting = ref(false);
const pumpForGrout = ref(false);
const gateInstallation = ref(false);
const trashRemoval = ref(false);
const stuccoSqFt = ref<number>();
const paintSqFt = ref<number>();
const plasticSqFt = ref<number>();


</script>

<template>

  <UDivider/>
  <div class="flex flex-row">
    <Button label="Back" icon="pi pi-arrow-left" @click="changeView(NavigationCommand.Estimates)"/>
    <Button label="New Job Task" icon="pi pi-arrow-right" @click="changeView(NavigationCommand.NewJobTask)"/>
  </div>
  <div class="flex flex-row gap-4">


    <Card>
      <template #title>Lay Up Challenges</template>
      <template #content>
        <div v-for="challenge in layUpChallenges" :key="challenge.value" class="checkbox-grid">
          <div class="checkbox">
            <Checkbox v-model="selectedLayUpChallenges" :inputId="challenge.value" name="layUpChallenge"
                      :value="challenge.value"/>
          </div>
          <label :for="challenge.value" class="grid-label">{{ challenge.label }}</label>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Stock Challenges</template>
      <template #content>
        <div v-for="challenge in stockChallenges" :key="challenge.value" class="checkbox-grid">
          <div class="checkbox">
            <Checkbox v-model="selectedStockChallenges" :inputId="challenge.value" name="stockChallenge"
                      :value="challenge.value"/>
          </div>
          <label :for="challenge.value" class="grid-label">{{ challenge.label }}</label>
        </div>
      </template>
    </Card>
  </div>

  <UDivider/>
  <p>Special Concessions</p>
  <div class="grid-container">
    <label class="grid-l">Pump for Footing</label>
    <div class="grid-r">
      <ToggleSwitch v-model="pumpForFooting"/>
    </div>
    <label class="grid-l">Pump for Grout</label>
    <div class="grid-r">
      <ToggleSwitch v-model="pumpForGrout"/>
    </div>
    <label class="grid-l">Gate Installation</label>
    <div class="grid-r">
      <ToggleSwitch v-model="gateInstallation"/>
    </div>
    <label class="grid-l">Trash Removal</label>
    <div class="grid-r">
      <ToggleSwitch v-model="trashRemoval"/>
    </div>

    <label class="grid-l">Stucco</label>
    <div class="grid-r">
      <InputGroup class="flex-1">
        <InputNumber v-model="stuccoSqFt"/>
        <InputGroupAddon>ft<sup>2</sup></InputGroupAddon>
      </InputGroup>
    </div>
    <label class="grid-l">Paint</label>
    <div class="grid-r">
      <InputGroup class="flex-1">
        <InputNumber v-model="paintSqFt"/>
        <InputGroupAddon>ft<sup>2</sup></InputGroupAddon>
      </InputGroup>
    </div>
    <label class="grid-l">Plastic</label>
    <div class="grid-r">
      <InputGroup class="flex-1">
        <InputNumber v-model="plasticSqFt"/>
        <InputGroupAddon>ft<sup>2</sup></InputGroupAddon>
      </InputGroup>
    </div>
  </div>

</template>

<style scoped>
.checkbox-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;


  .checkbox {
    display: flex;
    align-items: center;
  }

  .grid-label {
    margin: 4px;
    display: flex;
    align-items: center;
    justify-content: left;
    text-align: left;
    font-size: 16px;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: 140px 1fr;
  grid-auto-rows: 50px;
  column-gap: 8px;
  width: 100%;
  max-width: 600px;

  border: 0px solid blue;

  .grid-l {
    border: 0px solid red;
    margin: 4px;
    display: flex;
    align-items: center;
    justify-content: right;
    text-align: right;
    font-size: 13px;
  }

  .grid-r {
    border: 0px solid red;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 12px;
  }

  .grid-r-center {
    border: 0px solid red;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}

</style>