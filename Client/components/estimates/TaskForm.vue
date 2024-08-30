<script setup lang="ts">
import { type Reactive, watch } from "vue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import SelectButton from "primevue/selectbutton";
import ToggleSwitch from "primevue/toggleswitch";

import { EstimatesRequests } from "~/types/constants";


const { addJobTask } = useEstimateStore();
const { changeView } = useNavigationStore();
const { $api } = useNuxtApp();


enum LengthMeasure {
  Block,
  Feet
}

const importedState: PartialWithUndefined<Installation> = {
  lengthBlocks: undefined,
  lengthFt: undefined,
  heightCourses: 6,
  topFinish: undefined,
  segments: 1223,
  backPoints: 9876,
  blockWidth: 5,
  blockType: undefined,
  blockColor: undefined,
  premixColor: undefined,
  specialBlockWidth: undefined,
  specialBlockType: undefined,
  specialBlockColor: undefined,
  specialLengthBlocks: undefined,
  specialLengthFt: undefined,
  specialBlockCourses: undefined,
  footingType: undefined,
  footingWidthFt: 3,
  footingDepthFt: 4,
  horizontalInFooting: undefined,
  verticalSpacing: undefined,
  horizontalOnWall: undefined,
  embedmentDepth: undefined,
  existingDowels: true
};

import { initialState } from "~/types/constants";

let selected: Reactive<PartialWithUndefined<Installation>>;
const isImported = true;

if (isImported) {
  selected = reactive(importedState);
} else {
  selected = reactive(initialState);
}


const lengthMeasure = ref<LengthMeasure | undefined>();

watch(() => selected.lengthBlocks, (blocks) => {
  if (lengthMeasure.value === LengthMeasure.Feet) return;
  if (blocks && isNumber(blocks)) {
    lengthMeasure.value = LengthMeasure.Block;
    selected.lengthFt = blocks * 4 / 3;
  } else {
    lengthMeasure.value = undefined;
    selected.lengthFt = undefined;
  }
});
watch(() => selected.lengthFt, (feet) => {
  if (lengthMeasure.value === LengthMeasure.Block) return;
  if (feet && isNumber(feet)) {
    lengthMeasure.value = LengthMeasure.Feet;
    selected.lengthBlocks = Math.ceil(feet * 3 / 4);
  } else {
    lengthMeasure.value = undefined;
    selected.lengthBlocks = undefined;
  }
});

function isInputDisabled(measure: LengthMeasure) {
  return lengthMeasure.value !== undefined && lengthMeasure.value !== measure;
}

const heights = ref(Array.from({ length: 12 }, (_, i) => ({
  name: (i + 1).toString(),
  value: i + 1
})));

const topFinishes = ref([
  { name: "Coping", value: "coping" },
  { name: "Nellis", value: "nellis" },
  { name: "Two Inch Cap", value: "two-inch-cap" },
  { name: "None", value: "none" }
]);


type BlockWidthOption = SelectOption & { disabled: boolean };
const blockWidths = ref<BlockWidthOption[]>([
  { name: "6\"", value: 6, disabled: false },
  { name: "8\"", value: 8, disabled: false },
  { name: "10\"", value: 10, disabled: false },
  { name: "12\"", value: 12, disabled: false }
]);
const specialBlockWidths = ref<BlockWidthOption[]>([...blockWidths.value]);

watch(() => selected.blockWidth, (width) => {
  if (!width) {
    specialBlockWidths.value.forEach((specialBlock) => {
      specialBlock.disabled = false;
    });
    return;
  }
  specialBlockWidths.value.forEach((specialBlock) => {
    specialBlock.disabled = specialBlock.value !== width && specialBlock.value !== width + 2;
    if (specialBlock.disabled && specialBlock.value === selected.specialBlockWidth) {
      selected.specialBlockWidth = undefined;
    }
  });
});

const blockTypes = ref<SelectOption[]>([
  { name: "Slump Stone", value: "slump-stone" },
  { name: "Smooth", value: "smooth" },
  { name: "Split Face", value: "split-face" }
]);
const specialBlockTypes = ref<SelectOption[]>([
  { name: "Corner Flute", value: "corner-flute" },
  { name: "Corner Split", value: "corner-split" },
  { name: "Flute", value: "flute" },
  { name: "Nellis", value: "nellis" },
  { name: "Split", value: "split" }
]);

const blockColors = ref<SelectOption[]>([
  { name: "Baja", value: "baja" },
  { name: "Brown", value: "brown" },
  { name: "Chocolate", value: "chocolate" },
  { name: "Cocoa", value: "cocoa" },
  { name: "Gray", value: "gray" },
  { name: "Tan", value: "tan" },
  { name: "White", value: "white" }
]);

function addBlockColor() {
  console.log("addBlockColor");
}

const usesSpecialBlock = ref(true);
const footingType = ref(["Centric", "Excentric"]);

function createJobTask() {
  console.log("createJobTask");
}

function isNumber(value: any) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

</script>

<template>
  <form class="flex flex-col" v-on:submit.prevent="createJobTask">
    <Button label="Back" outlined @click="changeView(EstimatesRequests.NewEstimate)" class="w-40"/>
    <UDivider/>
    <div class="form-section">
      <div class="form-description">
        <p class="text-lg">CMU Wall</p>
        <p class="text-md mt-2 sub-description">
          Enter the dimensions of the wall you would like to estimate.
        </p>
      </div>
      <div class="form-inputs">
        <div class="grid-container">
          <label class="grid-l">Length</label>
          <div class="grid-r">
            <InputGroup class="flex-1">
              <InputNumber inputId="lengthBlock" v-model="selected.lengthBlocks"
                           :prefix="isInputDisabled(LengthMeasure.Block) ? '~ ' : ''"
                           :disabled="isInputDisabled(LengthMeasure.Block)" :min="1" :max="900" fluid/>
              <InputGroupAddon>Blocks</InputGroupAddon>
            </InputGroup>
            <UDivider label="OR" orientation="vertical"/>
            <InputGroup class="flex-1">
              <InputNumber inputId="lengthFeet" v-model="selected.lengthFt"
                           :disabled="isInputDisabled(LengthMeasure.Feet)" :min="32" :max="1200" fluid
                           :maxFractionDigits="2" class="flex-1"/>
              <InputGroupAddon>ft.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Height</label>
          <div class="grid-r">
            <Select v-model="selected.heightCourses" :options="heights" placeholder="# Courses" optionLabel="name" optionValue="value"
                    showClear class="flex-1"/>
          </div>
          <label class="grid-l">Top Finish</label>
          <div class="grid-r">
            <Select v-model="selected.topFinish" :options="topFinishes" optionLabel="name" showClear class="flex-1"/>
          </div>
          <label class="grid-l">Segments</label>
          <div class="grid-r">
            <InputNumber v-model="selected.segments" class="flex-1"/>
          </div>
          <label class="grid-l">Backpoints</label>
          <div class="grid-r">
            <InputNumber v-model="selected.backPoints" class="flex-1"/>
          </div>
        </div>

      </div>
    </div>

    <UDivider/>
    <div class="form-section">
      <div class="form-description">
        <p class="text-lg">Block</p>
        <p class="text-md mt-2 sub-description">
          Enter the specs of the block you would like to estimate.
        </p>
      </div>
      <div class="form-inputs">
        <div class="grid-container">
          <label class="grid-l">Block Width</label>
          <div class="grid-r-center">
            <SelectButton v-model="selected.blockWidth" :options="blockWidths" optionLabel="name" optionValue="value"/>
          </div>
          <label class="grid-l">Block Type</label>
          <div class="grid-r">
            <Select v-model="selected.blockType" :options="blockTypes" optionLabel="name" showClear class="flex-1"/>
          </div>
          <label class="grid-l">Block Color</label>
          <div class="grid-r">
            <CustomSelect v-model="selected.blockColor" defaultOptions :options="blockColors"
                          :newItemAction="addBlockColor" class="flex-1"/>
          </div>
          <label class="grid-l">Premix Color</label>
          <div class="grid-r">
            <Select class="flex-1">
            </Select>
          </div>
          <label class="grid-l">Special Block</label>
          <div class="grid-r">
            <ToggleSwitch v-model="usesSpecialBlock"/>
          </div>
        </div>

      </div>
    </div>

    <UDivider/>
    <Transition name="slide-fade">
      <div v-show="usesSpecialBlock" class="form-section">
        <div class="form-description">
          <p class="text-lg">Special Block</p>
          <p class="text-md mt-2 sub-description">
            Enter the specs of the block you would like to estimate.
          </p>
        </div>
        <div class="form-inputs">
          <div class="grid-container">
            <label class="grid-l">Special Block Width</label>
            <div class="grid-r-center">
              <SelectButton v-model="selected.specialBlockWidth" :options="specialBlockWidths" optionLabel="name"
                            optionValue="value" optionDisabled="disabled"/>
            </div>
            <label class="grid-l">Length</label>
            <div class="grid-r">
              <InputNumber v-model="selected.specialLengthFt" class="flex-1"/>
            </div>
            <label class="grid-l">Special Block Courses</label>
            <div class="grid-r">
              <InputNumber v-model="selected.specialBlockCourses" class="flex-1"/>
            </div>
            <label class="grid-l">Special Block Type</label>
            <div class="grid-r">
              <Select v-model="selected.specialBlockType" :options="specialBlockTypes" optionLabel="name"
                      class="flex-1"/>
            </div>
            <label class="grid-l">Special Block Color</label>
            <div class="grid-r">
              <Select v-model="blockColors" class="flex-1"/>
            </div>
          </div>

        </div>
      </div>
    </Transition>

    <UDivider/>
    <div class="form-section">
      <div class="form-description">
        <p class="text-lg">Rebar</p>
        <p class="text-md mt-2 sub-description">
          Enter the specs of the block you would like to estimate.
        </p>
      </div>
      <div class="form-inputs">
        <div class="grid-container">
          <label class="grid-l">Footing Type</label>
          <div class="grid-r-center">
            <SelectButton v-model="selected.footingType" :options="footingType" aria-labelledby="basic"/>
          </div>
          <label class="grid-l">Footing Width</label>
          <div class="grid-r">
            <InputGroup class="flex-1">
              <InputNumber inputId="footingWidth" v-model="selected.footingWidthFt" :min="1" :max="900" fluid/>
              <InputGroupAddon>ft.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Footing Depth</label>
          <div class="grid-r">
            <InputGroup class="flex-1">
              <InputNumber inputId="footingDepth" v-model="selected.footingDepthFt" :min="1" :max="900" fluid/>
              <InputGroupAddon>ft.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Horizontal in Footing</label>
          <div class="grid-r">
            <Select v-model="selected.horizontalInFooting" class="flex-1"/>
          </div>
          <label class="grid-l">Vertical Spacing</label>
          <div class="grid-r">
            <Select v-model="selected.verticalSpacing" class="flex-1"/>
          </div>
          <label class="grid-l">Horizontal on Wall</label>
          <div class="grid-r">
            <Select v-model="selected.horizontalOnWall" class="flex-1"/>
          </div>
          <label class="grid-l">Embedment Depth</label>
          <div class="grid-r">
            <InputGroup class="flex-1">
              <InputNumber inputId="embedmentDepth" v-model="selected.embedmentDepth" :min="1" :max="900" fluid/>
              <InputGroupAddon>in.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Existing Dowels</label>
          <div class="grid-r">
            <Checkbox v-model="selected.existingDowels" :binary="true"/>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row-reverse gap-4">
      <Button label="Save" icon="pi pi-check" type="Submit"/>
      <Button label="Cancel" outlined @click="changeView(EstimatesRequests.NewEstimate)"/>
    </div>

  </form>
</template>

<style scoped>
.form-section {
  display: flex;
  flex-direction: row;
  margin-top: 32px;
  margin-bottom: 32px;
  justify-content: space-between;

  .form-description {
    min-width: 300px;
    flex-shrink: 0;
    width: 420px;
  }

  .form-inputs {
    flex: 1;
    border: 0px solid green;
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

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(.6, 0, .6, 1), transform 0.4s cubic-bezier(.6, 0, .6, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>