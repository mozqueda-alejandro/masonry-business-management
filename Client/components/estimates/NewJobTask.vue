<script setup lang="ts">
import { watch } from "vue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select"
import SelectButton from 'primevue/selectbutton';
import ToggleSwitch from "primevue/toggleswitch";

import { EstimatesRequests } from "~/types/constants";
const { changeView } = useGlobalNavigationStore();
const { $api } = useNuxtApp();


enum LengthMeasure {
  Block,
  Feet
}

const lengthMeasure = ref<LengthMeasure>();
const lengthBlocks = ref<number>();
const lengthFt = ref<number>();

watch(lengthBlocks, (blocks) => {
  if (lengthMeasure.value === LengthMeasure.Feet) return;
  if (blocks && isNumber(blocks)) {
    lengthMeasure.value = LengthMeasure.Block;
    lengthFt.value = blocks * 4 / 3;
  } else {
    lengthMeasure.value = undefined;
    lengthFt.value = undefined;
  }
});
watch(lengthFt, (feet) => {
  if (lengthMeasure.value === LengthMeasure.Block) return;
  if (feet && isNumber(feet)) {
    lengthMeasure.value = LengthMeasure.Feet;
    lengthBlocks.value = Math.ceil(feet * 3 / 4);
  } else {
    lengthMeasure.value = undefined;
    lengthBlocks.value = undefined;
  }
});

function isInputDisabled(measure: LengthMeasure) {
  return lengthMeasure.value !== undefined && lengthMeasure.value !== measure;
}

const selectedHeightCourses = ref<number>();
const heights = ref(Array.from({ length: 12 }, (_, i) => ({
  name: (i + 1).toString(),
  value: i + 1
})));

const selectedTopFinish = ref<string>();
const topFinishes = ref([
  { name: "Coping", value: "coping" },
  { name: "Nellis", value: "nellis" },
  { name: "Two Inch Cap", value: "two-inch-cap" },
  { name: "None", value: "none" }
]);

const segments = ref<number>();
const backpoints = ref<number>();

type BlockWidthOption = SelectOption & { disabled: boolean };
const selectedBlockWidth = ref<number>();
const blockWidths = ref<BlockWidthOption[]>([
  { name: "6\"", value: 6, disabled: false },
  { name: "8\"", value: 8, disabled: false },
  { name: "10\"", value: 10, disabled: false },
  { name: "12\"", value: 12, disabled: false }
]);
const selectedSpecialBlockWidth = ref<number>();
const specialBlockWidths = ref<BlockWidthOption[]>([...blockWidths.value]);

watch(selectedBlockWidth, (width) => {
  if (!width) {
    specialBlockWidths.value.forEach((specialBlock) => {
      specialBlock.disabled = false;
    });
    return;
  }
  specialBlockWidths.value.forEach((specialBlock) => {
    specialBlock.disabled = specialBlock.value !== width && specialBlock.value !== width + 2;
    if (specialBlock.disabled && specialBlock.value === selectedSpecialBlockWidth.value) {
      selectedSpecialBlockWidth.value = undefined;
    }
  });
});

const selectedBlockType = ref<string>();
const selectedSpecialBlockType = ref<string>();
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

const selectedBlockColor = ref<string>();
const selectedSpecialBlockColor = ref<string>();
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
  console.log('addBlockColor');
}

const usesSpecialBlock = ref(true);

const selectedFootingType = ref<string>();
const footingType = ref(["Centric", "Excentric"]);
const footingWidth = ref<number>();
const footingDepth = ref<number>();
const horizontalInFooting = ref<number>();
const verticalSpacing = ref<number>();
const horizontalOnWall = ref<number>();
const embedmentDepth = ref<number>();
const existingDowels = ref<boolean>();

const value = ref();

function createJobTask() {
  console.log('createJobTask');
}

function isNumber(value: any) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

const initialState: PartialWithUndefined<InstallationType> = {
  lengthBlocks: undefined,
  lengthFt: undefined,
  heightCourses: undefined,
  topFinish: undefined,
  segments: undefined,
  backPoints: undefined,
  blockWidth: undefined,
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
  footingWidthFt: undefined,
  footingDepthFt: undefined,
  horizontalInFooting: undefined,
  verticalSpacing: undefined,
  horizontalOnWall: undefined,
  embedmentDepth: undefined,
  existingDowels: undefined,
};

let selected = reactive(initialState);

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
              <InputNumber inputId="lengthBlock" v-model="lengthBlocks" :prefix="isInputDisabled(LengthMeasure.Block) ? '~ ' : ''"
                           :disabled="isInputDisabled(LengthMeasure.Block)" :min="1" :max="900" fluid/>
              <InputGroupAddon>Blocks</InputGroupAddon>
            </InputGroup>
            <UDivider label="OR" orientation="vertical"/>
            <InputGroup class="flex-1">
              <InputNumber inputId="lengthFeet" v-model="lengthFt"
                           :disabled="isInputDisabled(LengthMeasure.Feet)" :min="32" :max="1200" fluid
                           :maxFractionDigits="2" class="flex-1"/>
              <InputGroupAddon>ft.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Height</label>
          <div class="grid-r">
            <Select v-model="selectedHeightCourses" :options="heights" placeholder="# Courses" optionLabel="name" showClear class="flex-1"/>
          </div>
          <label class="grid-l">Top Finish</label>
          <div class="grid-r">
            <Select v-model="selectedTopFinish" :options="topFinishes" optionLabel="name" showClear class="flex-1"/>
          </div>
          <label class="grid-l">Segments</label>
          <div class="grid-r">
            <InputNumber v-model="segments" class="flex-1"/>
          </div>
          <label class="grid-l">Backpoints</label>
          <div class="grid-r">
            <InputNumber v-model="backpoints" class="flex-1"/>
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
            <SelectButton v-model="selectedBlockWidth" :options="blockWidths" optionLabel="name" optionValue="value"/>
          </div>
          <label class="grid-l">Block Type</label>
          <div class="grid-r">
            <Select v-model="selectedBlockType" :options="blockTypes" optionLabel="name" showClear class="flex-1"/>
          </div>
          <label class="grid-l">Block Color</label>
          <div class="grid-r">
            <CustomSelect v-model="selectedBlockColor" defaultOptions :options="blockColors" :newItemAction="addBlockColor" class="flex-1" />
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
              <SelectButton v-model="selectedSpecialBlockWidth" :options="specialBlockWidths" optionLabel="name" optionValue="value" optionDisabled="disabled"/>
            </div>
            <label class="grid-l">Length</label>
            <div class="grid-r">
              <InputNumber v-model="value" class="flex-1"/>
            </div>
            <label class="grid-l">Special Block Courses</label>
            <div class="grid-r">
              <InputNumber v-model="value" class="flex-1"/>
            </div>
            <label class="grid-l">Special Block Type</label>
            <div class="grid-r">
              <Select v-model="selectedSpecialBlockType" :options="specialBlockTypes" optionLabel="name" class="flex-1"/>
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
            <SelectButton v-model="selectedFootingType" :options="footingType" aria-labelledby="basic" />
          </div>
          <label class="grid-l">Footing Width</label>
          <div class="grid-r">
            <InputGroup class="flex-1">
              <InputNumber inputId="footingWidth" v-model="footingWidth" :min="1" :max="900" fluid/>
              <InputGroupAddon>ft.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Footing Depth</label>
          <div class="grid-r">
            <InputGroup class="flex-1">
              <InputNumber inputId="footingDepth" v-model="footingDepth" :min="1" :max="900" fluid/>
              <InputGroupAddon>ft.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Horizontal in Footing</label>
          <div class="grid-r">
            <Select v-model="horizontalInFooting" class="flex-1"/>
          </div>
          <label class="grid-l">Vertical Spacing</label>
          <div class="grid-r">
            <Select v-model="verticalSpacing" class="flex-1"/>
          </div>
          <label class="grid-l">Horizontal on Wall</label>
          <div class="grid-r">
            <Select v-model="horizontalOnWall" class="flex-1"/>
          </div>
          <label class="grid-l">Embedment Depth</label>
          <div class="grid-r">
            <InputGroup class="flex-1">
              <InputNumber inputId="embedmentDepth" v-model="embedmentDepth" :min="1" :max="900" fluid/>
              <InputGroupAddon>in.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Existing Dowels</label>
          <div class="grid-r">
            <Checkbox v-model="existingDowels" :binary="true"/>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row-reverse gap-4">
      <Button label="Save" icon="pi pi-check" type="Submit" />
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
  transition: opacity 0.4s cubic-bezier(.6,0,.6,1), transform 0.4s cubic-bezier(.6,0,.6,1);
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