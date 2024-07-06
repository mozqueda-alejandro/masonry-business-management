<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import ToggleSwitch from "primevue/toggleswitch";


const darkModeStore = useDarkModeStore();
const { $api } = useNuxtApp();

type NullableNumber = number | null;

enum LengthMeasure {
  Block,
  Feet
}

const lengthMeasure = ref<LengthMeasure | null>(null);

function lengthMeasureIsSet() {
  return lengthMeasure.value !== null;
}

const _lengthInBlock = ref<number>();
const _lengthInFeet = ref<number>();

const lengthInBlock = computed<number | undefined>({
  get() {
    return _lengthInBlock.value;
  },
  set(value) {
    if (isNumber(value) && value) {
      if (!lengthMeasureIsSet()) {
        lengthMeasure.value = LengthMeasure.Block;
      }
      lengthInFeet.value = value * 4 / 3;
    } else if (!isNumber(value) && lengthMeasure.value === LengthMeasure.Block) {
      lengthMeasure.value = null;
      lengthInFeet.value = undefined;
    }
    _lengthInBlock.value = value;
  }
});
const lengthInFeet = computed<number | undefined>({
  get() {
    return _lengthInFeet.value;
  },
  set(value) {
    if (isNumber(value) && !lengthMeasureIsSet()) {
      lengthMeasure.value = LengthMeasure.Feet;
    } else if (!isNumber(value) && lengthMeasure.value === LengthMeasure.Feet) {
      lengthMeasure.value = null;
      lengthInBlock.value = undefined;
    }
    _lengthInFeet.value = value;
  }
});

function isInputDisabled(measure: LengthMeasure) {
  return lengthMeasureIsSet() && lengthMeasure.value !== measure;
}

const height = ref<number>();
const value = ref();
const usesSpecialBlock = ref(true);
const existingDowels = ref(true);

function isNumber(value: any) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

</script>

<template>
  <div class="flex flex-col">

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
              <InputNumber inputId="lengthBlock" v-model="lengthInBlock" :prefix="isInputDisabled(LengthMeasure.Block) ? '~ ' : ''"
                           :disabled="isInputDisabled(LengthMeasure.Block)" min="1" max="900" fluid/>
              <InputGroupAddon>Blocks</InputGroupAddon>
            </InputGroup>
            <UDivider label="OR" orientation="vertical"/>
            <InputGroup class="flex-1">
              <InputNumber inputId="lengthFeet" v-model="lengthInFeet"
                           :disabled="isInputDisabled(LengthMeasure.Feet)" min="32" max="1200" fluid
                           :maxFractionDigits="2" class="flex-1"/>
              <InputGroupAddon>ft.</InputGroupAddon>
            </InputGroup>
          </div>
          <label class="grid-l">Height (Courses)</label>
          <div class="grid-r">
            <InputNumber v-model="height" class="flex-1"/>
          </div>
          <label class="grid-l">Top Finish</label>
          <div class="grid-r">
            <Select class="flex-1">

            </Select>
          </div>
          <label class="grid-l">Segments</label>
          <div class="grid-r">
            <InputNumber v-model="value" class="flex-1"/>
          </div>
          <label class="grid-l">Backpoints</label>
          <div class="grid-r">
            <InputNumber v-model="value" class="flex-1"/>
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
          <label class="grid-l">Block Type</label>
          <div class="grid-r">
            <Select class="flex-1"/>
          </div>
          <label class="grid-l">Block Width</label>
          <div class="grid-r">
            <Select class="flex-1"/>
          </div>
          <label class="grid-l">Block Color</label>
          <div class="grid-r">
            <Select class="flex-1"/>
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
              <Select class="flex-1"/>
            </div>
            <label class="grid-l">Special Block Width</label>
            <div class="grid-r">
              <Select class="flex-1"/>
            </div>
            <label class="grid-l">Special Block Color</label>
            <div class="grid-r">
              <Select class="flex-1"/>
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
          <label class="grid-l">Footing Width</label>
          <div class="grid-r">
            <InputNumber v-model="value" class="flex-1"/>
          </div>
          <label class="grid-l">Footing Depth</label>
          <div class="grid-r">
            <InputNumber v-model="value" class="flex-1"/>
          </div>
          <label class="grid-l">Horizontal in Footing</label>
          <div class="grid-r">
            <Select class="flex-1"/>
          </div>
          <label class="grid-l">Vertical Spacing</label>
          <div class="grid-r">
            <Select class="flex-1"/>
          </div>
          <label class="grid-l">Horizontal on Wall</label>
          <div class="grid-r">
            <Select class="flex-1"/>
          </div>
          <label class="grid-l">Embedment Depth</label>
          <div class="grid-r">
            <InputNumber v-model="value" class="flex-1"/>
          </div>
          <label class="grid-l">Existing Dowels</label>
          <div class="grid-r">
            <Checkbox v-model="existingDowels" :binary="true"/>
          </div>
        </div>
      </div>
    </div>

    <UDivider/>


  </div>
</template>

<style scoped>
.form-section {
  display: flex;
  flex-direction: row;
  margin-top: 32px;
  margin-bottom: 32px;
  justify-content: space-between;

  .form-description {
    width: 400px;
    flex-shrink: 0;
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
}

.sub-description {
  color: var(--p-zinc-600);
}

.dark-mode .sub-description {
  color: var(--p-zinc-400);
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
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