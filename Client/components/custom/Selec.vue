<script setup lang="ts">
import Button from "primevue/button";
import Select from "primevue/select";
import { defineModel } from "vue";


const modelValue = defineModel();
const attrs = useAttrs();

interface Props {
  defaultOptions?: boolean;
  newItemLabel?: string;
  newItemAction: Function;
}

const props = withDefaults(defineProps<Props>(), {
  newItemLabel: "New"
});

const optionLabel = computed(() => props.defaultOptions ? "name" : null);
const optionValue = computed(() => props.defaultOptions ? "value" : null);

// https://vuejs.org/guide/essentials/template-refs.html
const pSelect = ref<InstanceType<typeof Select>>();

function createNewItem() {
  props.newItemAction();
  if (pSelect.value) {
    pSelect.value.hide(true);
  }
}

const sortedOptions = computed(() => {
  // sort attrs["options"] by the string attribute "name"
  const options = attrs["options"] as { name: string }[];
  return options.sort((a, b) => a.name.localeCompare(b.name));
});

const lastHoveredOption = ref();
function onNewItemMouseEnter() {
  const list = document.querySelector(".p-select-list-container");
  const listOptions = list?.querySelectorAll("li");
  if (list && listOptions) {
    lastHoveredOption.value = Array.from(listOptions).find((option) => option.classList.contains("p-focus"));
    lastHoveredOption.value?.classList.remove("p-focus");
  }
}
function onNewItemMouseLeave() {
  if (lastHoveredOption.value) {
    lastHoveredOption.value.classList.add("p-focus");
  }
}
</script>

<template>
  <Select v-model="sortedOptions" v-bind="$attrs" ref="pSelect" :optionLabel="optionLabel" :optionValue="optionValue">
    <template #header>
      <div class="flex items-center">
        <Button @click="createNewItem" severity="success" text fluid
                class="font-normal m-1 h-10 border-2 border-amber-200" @mouseenter="onNewItemMouseEnter" @mouseleave="onNewItemMouseLeave">
          <div class="flex flex-1 items-center gap-2">
            <i class="pi pi-plus"></i>
            <p class="">{{ newItemLabel }}</p>
          </div>
        </Button>
      </div>
    </template>
  </Select>
</template>

<style scoped>
</style>