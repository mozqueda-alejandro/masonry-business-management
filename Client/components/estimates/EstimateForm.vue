<script setup lang="ts">
import type { Component, Ref } from "vue"; // STANDARD

import Badge from "primevue/badge"; // LIBRARY
import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import DataTable from "primevue/datatable";
import DatePicker from "primevue/datepicker";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Listbox from "primevue/listbox";
import Menu from "primevue/menu";
import Panel from "primevue/panel";
import ProgressBar from "primevue/progressbar";
import Select from "primevue/select";
import SplitButton from "primevue/splitbutton";
import Textarea from "primevue/textarea";


import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { Client } from "~/types/business";

import { // LOCAL
  IJobScopesAddition,
  IJobScopesDemo,
  IJobScopesInstallation,
  IJobScopesRepair,
  IJobScopesStone,
  IJobScopesTemporaryFence
} from "#components";
import { JobScope } from "~/types/enums";
import { formatCurrency, formatPhone } from "~/utils/formatting";

// region Init

const estimateEdit = ref<Partial<Estimate>>({});

// Unwrapping reactive values from a store
// https://masteringpinia.com/blog/ref-vs-reactive-in-stores
const estimateStore = useEstimateStore();
const { loadEstimate, resetEstimate, getJobTask, removeJobTask } = estimateStore;

const businessApi = useBusinessApi();

const props = defineProps<{
  id?: number
}>();

if (props.id) {
  const loadResult = loadEstimate(props.id);
  if (loadResult) {
    estimateEdit.value = loadResult;
  }
} else {
  estimateEdit.value = resetEstimate();
}

console.log(estimateEdit.value);

function getBusinessDetails(): BusinessDetails {
  return businessApi.getBusinessDetails();
}

function getClients(): Client[] {
  return [
    { id: 1, name: "John Doe", email: "johndoe@gmail.com", phone: "123-456-7890", address: "345 Virginia St" },
    { id: 2, name: "Jane Smith", email: "janesmith@example.com", phone: "987-654-3210", address: "678 Roosevelt St" },
    { id: 3, name: "Michael Brown", email: "michael.brown@work.com", phone: "555-123-4567", address: "1234 Wash St" },
    { id: 4, name: "Sarah Jones", email: "sarahjones@hotmail.com", phone: "866-543-2109", address: "5678 Lincoln St" },
    { id: 5, name: "David Miller", email: "davidmiller@yahoo.com", phone: "702-987-6543", address: "9876 Jefferson St" }
  ];
}

// endregion


// region Save-Import

const importModalVisible = ref(false);
const saveButtonItems = [
  {
    label: "Save as Draft",
    command: () => {
      console.log("Save as Draft");
      navigateTo("/estimates");
    }
  }
];

// endregion

// region BusinessDetails

const businessDetails = ref<BusinessDetails>(getBusinessDetails());
const businessDetailsModalVisible = ref(false);

// endregion

// region Client-EstimateData

const selectedClient = ref<Client>();
const clients = ref<Client[]>(getClients());
const pSelect = ref<InstanceType<typeof Select>>();

async function onChangeClient() {
  selectedClient.value = undefined;
  await nextTick();
  if (pSelect.value) {
    pSelect.value.show(true);
  }
}

if (!estimateEdit.value.date) {
  estimateEdit.value.date = new Date();
}

const tempDate = estimateEdit.value.date;
if (estimateEdit.value.usingValidUntil) {
  estimateEdit.value.validUntil = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth(),
      tempDate.getDate() + 30);
}
let _cachedValidUntil = estimateEdit.value.validUntil;

watch(() => estimateEdit.value.usingValidUntil, (newValue) => {
  if (newValue) {
    estimateEdit.value.validUntil = _cachedValidUntil;
  } else {
    _cachedValidUntil = estimateEdit.value.validUntil ?? new Date();
    estimateEdit.value.validUntil = undefined;
  }
});


const dateDifference = computed(() => {
  if (!estimateEdit.value.usingValidUntil || !estimateEdit.value.validUntil || !estimateEdit.value.date) {
    return "No expiration date";
  }

  const diff = estimateEdit.value.validUntil.getTime() - estimateEdit.value.date.getTime();
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "By today";
  if (diffDays === 1) return "Within 1 day";
  return `Within ${ diffDays.toString() } days`;
});

// endregion

// region JobTasks

const selectedTasks = ref();
const selectedTasksAmount = computed(() => {
  const _manualDependency = estimateEdit.value.tasks;
  if (Array.isArray(selectedTasks.value)) return selectedTasks.value.length;
  return 0;
});

function getTaskGroupTotalPrice(jobScope: JobScope): number | undefined {
  return estimateEdit.value.tasks
      ?.filter(task => task.scope === jobScope)
      .reduce((acc, task) => acc + (task.price || 0), 0);
}

function onEditJobTaskCell(event: any) {
  let { data, newValue, field } = event;

  switch (field) {
    case "name":
      if (newValue.trim().length > 0) data[field] = newValue;
      else event.preventDefault();
      break;
    case "price":
      // is a number
      if (!isNaN(newValue)) data[field] = newValue;
      else event.preventDefault();
      break;
    default:
      console.log("ERROR - onEditJobTaskCell");
      break;
  }
}

// endregion

// region JobTaskMenu

const menu = ref();
const menuItemSelectedId = ref();
watch(menuItemSelectedId, (newValue) => {
  console.log("menuItemSelectedId ->", newValue);
});
const items = ref([
  { label: "View" },
  { label: "Edit" },
  { label: "Copy" },
  { separator: true },
  {
    label: "Remove",
    icon: "pi pi-trash",
    command: async () => {
      if (menuItemSelectedId.value === undefined || menuItemSelectedId.value === null) return;
      const task = estimateEdit.value.tasks?.find(task => task.id === menuItemSelectedId.value);
      if (!task) return;

      deleteTask(task);
    }
  }
]);

function toggleJobTaskMenuItem(event: any, id: number) {
  menuItemSelectedId.value = id;
  menu.value.toggle(event);
}

// endregion

// region JobTaskAdd

const selectedNewTaskScope = ref<JobScope>();
const newTaskName = ref<string>();

const newTaskModalVisible = ref(false);
const addTaskModal: Record<JobScope, { icon: Component; description: string }> = {
  [JobScope.Installation]: {
    icon: IJobScopesInstallation,
    description: "New installation of CMU wall, with no pre-existing structures."
  },
  [JobScope.Addition]: {
    icon: IJobScopesAddition,
    description: "Wall-on-top or extra courses installed on pre-existing wall."
  },
  [JobScope.Repair]: {
    icon: IJobScopesRepair,
    description: "Reparation of CMU wall."
  },
  [JobScope.Demo]: {
    icon: IJobScopesDemo,
    description: "Masonry unit demolition."
  },
  [JobScope.TemporaryFence]: {
    icon: IJobScopesTemporaryFence,
    description: "Temporary fencing installation for exposed areas."
  },
  [JobScope.Stone]: {
    icon: IJobScopesStone,
    description: "Stone installation or repair."
  }
};

const canAddNewTask = computed(() => {
  const isValidName = newTaskName.value !== undefined && newTaskName.value.trim().length > 0;
  const isValidScope = selectedNewTaskScope.value !== undefined;
  return isValidScope && isValidName;
});

async function onAddTaskContinue(scope: JobScope, estimateId?: number) {
  newTaskModalVisible.value = false;
  let newTaskRoute: string;
  if (estimateId !== undefined) {
    newTaskRoute = `/estimates/${ estimateId }/new-task`;
  } else {
    newTaskRoute = "/estimates/new-task";
  }

  navigateTo(newTaskRoute);
}

// endregion

// region JobTaskDelete

const confirm = useConfirm();
const toast = useToast();
watch(() => estimateEdit.value.tasks, (newValue) => {
  estimateEdit.value.tasks = newValue;
});

const deleteTask = (task: PartialWithUndefined<JobTask>) => {
  confirm.require({
    message: "Do you want to delete this record permanently?",
    header: task.name || "Untitled Task",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true
    },
    acceptProps: {
      label: "Delete",
      severity: "danger"
    },
    accept: () => {
      if (typeof task.id !== "number") {
        console.error("ERROR - deleteTask");
        return;
      }

      removeJobTask(task.id);
      toast.add({ severity: "info", summary: "Confirmed", detail: "Record deleted", life: 3000 });
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "Delete canceled", life: 3000 });
    }
  });
};

const canDeleteSelection = computed(() => {
  return selectedTasksAmount.value !== 0;
});

function deleteSelected() {
  console.log("deleteSelected", selectedTasks.value);
  if (!selectedTasks.value) {
    console.error("ERROR - deleteSelected");
    return;
  }

  //deleteTask(selectedTasks.value);
}


// endregion

// region ConstructionChallenges

enum ChallengeType {
  LayUp,
  Stock,
  Concession,
  Custom
}

interface Challenge {
  id: number;
  label: string;
  type: ChallengeType;
  price: number;
}

interface ChallengeToggle extends Challenge {
  isToggled: boolean;
}

interface ChallengeMaterial extends Challenge {
  unitAmount: number;
  unit: string;
}

interface ChallengeSelection {
  toggles: ChallengeToggle[];
  materials: ChallengeMaterial[];
}

interface ChallengeTab {
  id: string;
  label: string;
  selection: Ref<ChallengeSelection>;
}

const initSelectedChallenges = (): ChallengeSelection => ({ toggles: [], materials: [] });
const selectedLayUp = ref<ChallengeSelection>(initSelectedChallenges());
const selectedStock = ref<ChallengeSelection>(initSelectedChallenges());
const selectedConcessions = ref<ChallengeSelection>(initSelectedChallenges());
const selectedCustom = ref<ChallengeSelection>(initSelectedChallenges());

const challengeTabs: Record<ChallengeType, ChallengeTab> = {
  [ChallengeType.LayUp]: {
    id: "0",
    label: "Lay up",
    selection: selectedLayUp
  },
  [ChallengeType.Stock]: {
    id: "1",
    label: "Stock",
    selection: selectedStock
  },
  [ChallengeType.Concession]: {
    id: "2",
    label: "Concessions",
    selection: selectedConcessions
  },
  [ChallengeType.Custom]: {
    id: "3",
    label: "Custom",
    selection: selectedCustom
  }
};
const getChallengeTabs

function fetchChallengeToggles(): ChallengeToggle[] {
  return [
    { id: 1, label: "Inaccessible to lay up", value: false, price: 60, type: ChallengeType.LayUp },
    { id: 2, label: "In between trees", value: false, price: 30, type: ChallengeType.LayUp },
    { id: 3, label: "8\" block", value: false, price: 50, type: ChallengeType.LayUp },
    { id: 4, label: "Wall pattern", value: false, price: 40, type: ChallengeType.LayUp },
    { id: 5, label: "Next to pipes", value: false, price: 20, type: ChallengeType.LayUp },
    { id: 6, label: "Insurance paid", value: false, price: 150, type: ChallengeType.LayUp },
    { id: 7, label: "Stock changes", value: false, price: 60, type: ChallengeType.Stock },
    { id: 8, label: "Far from wall", value: true, price: 30, type: ChallengeType.Stock },
    { id: 9, label: "Outside corner lot", value: false, price: 50, type: ChallengeType.Stock },
    { id: 10, label: "Cover pool", value: false, price: 40, type: ChallengeType.Stock },
    { id: 11, label: "Cover landscape", value: false, price: 20, type: ChallengeType.Stock },
    { id: 12, label: "Cover concrete", value: false, price: 150, type: ChallengeType.Stock },
    { id: 13, label: "Pump for footing", value: false, price: 60, type: ChallengeType.Concession },
    { id: 14, label: "Pump for grout", value: false, price: 30, type: ChallengeType.Concession },
    { id: 15, label: "Gate installation", value: true, price: 50, type: ChallengeType.Concession },
    { id: 16, label: "Trash removal", value: false, price: 4, type: ChallengeType.Concession }
  ];
}

function fetchChallengeMaterials(): ChallengeMaterial[] {
  return [
    { id: 1, label: "Stucco sq ft", value: 0, price: 60, type: ChallengeType.Custom, unit: "sq ft" },
    { id: 2, label: "Paint sq ft", value: 0, price: 30, type: ChallengeType.Custom, unit: "sq ft" },
    { id: 3, label: "Plastic sq ft", value: 0, price: 50, type: ChallengeType.Custom, unit: "sq ft" }
  ];
}

function getChallengeToggles(type: ChallengeType): ChallengeToggle[] {
  return fetchChallengeToggles().filter(challenge => challenge.type === type);
}

function getChallengeMaterials(type: ChallengeType): ChallengeMaterial[] {
  return fetchChallengeMaterials().filter(challenge => challenge.type === type);
}


// for each element in above lists, add id to selectedChallenges if challenge value is true
// do it once, it should not be reactive


const stuccoSqFt = ref<number>();
const paintSqFt = ref<number>();
const plasticSqFt = ref<number>();

const selectedConcessionsAmount = computed<number>(() => {
  let amount = 0;
  if (selectedConcessions) {
    amount = selectedConcessions.length;
  }
  if (stuccoSqFt.value) amount++;
  if (paintSqFt.value) amount++;
  if (plasticSqFt.value) amount++;

  return amount;
});

const challengeTabValue = ref("0");
const tabList = ref<InstanceType<typeof TabList>>();

async function triggerTabUpdate() {
  await nextTick();
  tabList.value?.updateInkBar();
}

// endregion

// region Notes

const notes = ref("");

// endregion

import { initialState } from "~/types/constants";

function calculateCompletionRatio<T>(filledObj: Partial<T>, defaultObj: T = initialState, excludeFields: (keyof T)[] = []): number {
  const keys = Object.keys(defaultObj) as (keyof T)[];
  const relevantKeys = keys.filter(key => !excludeFields.includes(key));
  const totalFields = relevantKeys.length;
  const completedFields = relevantKeys.filter(key => filledObj[key] !== undefined).length;
  return completedFields;
}

const selectedCity = ref();
const groupedCities = ref([
  {
    label: "Germany",
    code: "DE",
    items: [
      { label: "Berlin", value: "Berlin" },
      { label: "Frankfurt", value: "Frankfurt" },
      { label: "Hamburg", value: "Hamburg" },
      { label: "Munich", value: "Munich" }
    ]
  },
  {
    label: "USA",
    code: "US",
    items: [
      { label: "Chicago", value: "Chicago" },
      { label: "Los Angeles", value: "Los Angeles" },
      { label: "New York", value: "New York" },
      { label: "San Francisco", value: "San Francisco" }
    ]
  },
  {
    label: "Japan",
    code: "JP",
    items: [
      { label: "Kyoto", value: "Kyoto" },
      { label: "Osaka", value: "Osaka" },
      { label: "Tokyo", value: "Tokyo" },
      { label: "Yokohama", value: "Yokohama" }
    ]
  }
]);


// :pt="{ rowGroupHeaderCell: (options: any) => ({ class: [''] })}"
</script>

<template>
  <ConfirmDialog></ConfirmDialog>

  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="">
      </UDashboardNavbar>

      <UDashboardPanelContent>

        <div class="flex flex-col gap-4">

          <div class="flex flex-row justify-between mb-1">
            <div class="flex flex-row items-center gap-2">
              <p class="text-xl">New Job Estimate</p>
            </div>
            <div class="flex flex-row gap-4">
              <Button label="Discard" outlined @click="navigateTo('/estimates')"/>
              <Button label="Import" icon="pi pi-file-import" outlined
                      @click="importModalVisible = true"/>
              <SplitButton label="Save and continue" :model="saveButtonItems"
                           @click="navigateTo('/estimates/new-task')"/>
              <Dialog v-model:visible="importModalVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
                <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
                <div class="flex items-center gap-4 mb-4">
                  <label for="username" class="font-semibold w-24">Username</label>
                  <InputText id="username" class="flex-auto" autocomplete="off"/>
                </div>
                <div class="flex items-center gap-4 mb-8">
                  <label for="email" class="font-semibold w-24">Email</label>
                  <InputText id="email" class="flex-auto" autocomplete="off"/>
                </div>
                <div class="flex justify-end gap-2">
                  <Button type="button" label="Cancel" severity="secondary"
                          @click="importModalVisible = false"></Button>
                  <Button type="button" label="Save" @click="importModalVisible = false"></Button>
                </div>
              </Dialog>
            </div>
          </div>

          <div>
            <Panel header="Business Details" toggleable :collapsed="true">
              <div class="flex flex-row justify-between mt-12 mb-16 mx-4">

                <div class="flex flex-row items-center gap-8">
                  <Button outlined>
                    <div class="flex flex-col justify-center gap-2 w-[340px] h-[220px] rounded-lg">
                      <i class="pi pi-cloud-upload text-center mb-2" style="font-size: 2.5rem"></i>
                      <p class="text-center">Browse or drop your logo here.</p>
                      <p class="sub-description text-center text-sm">
                        Maximum 5MB in size.<br>
                        JPG, PNG, or GIF formats.<br>
                        Recommended size: 300 x 200 pixels.
                      </p>
                    </div>
                  </Button>

                  <div class="flex flex-col gap-3">
                    <p class="business-details">
                      <b class="text-lg">{{ businessDetails.name }}</b><br>
                      LIC: {{ businessDetails.license }}
                    </p>
                    <p class="business-details">
                      {{ businessDetails.location.address }}<br>
                      {{
                        `${ businessDetails.location.city }, ${ businessDetails.location.state } ${ businessDetails.location.zip }`
                      }}<br>
                    </p>
                    <p class="business-details">
                      {{ formatPhone(businessDetails.phone) }}<br>
                      {{ businessDetails.email }}<br>
                      {{ businessDetails.website }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-col justify-between input-width">
                  <div class="flex flex-col input-gap">
                    <InputText v-model="estimateEdit.name" placeholder="Estimate Name" size="large"
                               pt:root:class="text-right"/>
                    <InputText v-model="estimateEdit.description" placeholder="Description or project name (optional)"
                               pt:root:class="text-right"/>
                  </div>
                  <div class="flex justify-end">
                    <Button label="Edit business details" @click="businessDetailsModalVisible = true" text
                            icon="pi pi-pencil"/>
                    <Dialog v-model:visible="businessDetailsModalVisible" modal header="Edit Business Profile"
                            :style="{ width: '25rem' }">
                    <span
                        class="text-surface-500 dark:text-surface-400 block mb-8">Update your business information.</span>
                      <div class="flex items-center gap-4 mb-4">
                        <label for="business-name" class="font-semibold w-24">Business Name</label>
                        <InputText id="business-name" class="flex-auto" autocomplete="off"/>
                      </div>

                      <div class="flex justify-end gap-2">
                        <Button type="button" label="Cancel" severity="secondary"
                                @click="businessDetailsModalVisible = false"></Button>
                        <Button type="button" label="Save" @click="businessDetailsModalVisible = false"></Button>
                      </div>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <div class="estimate-details">
            <Card>
              <template #content>
                <div class="flex flex-row justify-between mt-4 mb-8">
                  <div v-if="!selectedClient">
                    <Select v-model="selectedClient" :options="clients" optionLabel="name" placeholder="Add client"
                            class="items-center w-[340px] h-[150px]" pt:dropdown:class="!w-0" ref="pSelect">
                      <template #value="slotProps" class="">
                        <div v-if="slotProps.value" class="flex items-center">
                          <div>{{ slotProps.value.name }}</div>
                        </div>
                        <div v-else class="flex flex-row justify-center items-center gap-4 h-[160px]">
                          <i class="pi pi-user-plus" style="font-size: 1.25rem"/>
                          <span class="text-xl">{{ slotProps.placeholder }}</span>
                        </div>
                      </template>
                    </Select>
                  </div>
                  <div v-else class="flex flex-col justify-between">
                    <div class="flex flex-col gap-2 ml-3">
                      <p class="text-sm sub-description">Bill to</p>
                      <p>
                        <b>{{ selectedClient.name }}</b><br>
                        {{ selectedClient.address }}
                      </p>
                      <p>
                        {{ formatPhone(selectedClient.phone) }}<br>
                        {{ selectedClient.email }}
                      </p>
                    </div>
                    <ButtonGroup>
                      <Button label="Edit client" @click="" text severity="secondary"/>
                      <Button label="Choose another client" @click="onChangeClient" text severity="secondary"/>
                    </ButtonGroup>
                  </div>

                  <div class="estimate-grid input-gap">
                    <label class="estimate-l">Estimate number</label>
                    <div class="estimate-r">
                      <InputNumber v-model="estimateEdit.number" fluid/>
                    </div>

                    <label class="estimate-l">Date</label>
                    <DatePicker v-model="estimateEdit.date" :minDate="new Date()" class="estimate-r"/>

                    <label class="estimate-l">Valid until</label>
                    <InputGroup>
                      <DatePicker v-model="estimateEdit.validUntil" :minDate="estimateEdit.date"
                                  :disabled="!estimateEdit.usingValidUntil"
                                  class="estimate-r"/>
                      <InputGroupAddon>
                        <Checkbox v-model="estimateEdit.usingValidUntil" :binary="true"/>
                      </InputGroupAddon>
                    </InputGroup>

                    <span class="estimate-l"></span>
                    <p class="estimate-r sub-description text-sm">{{ dateDifference }}</p>
                  </div>
                </div>
                <div class="flex justify-center">
                  <DataTable :value="estimateEdit.tasks" rowGroupMode="subheader" groupRowsBy="scope" sortMode="single"
                             sortField="scope" :sortOrder="1" editMode="cell" size="small"
                             @cell-edit-complete="onEditJobTaskCell" removableSort v-model:selection="selectedTasks"
                             style="width: 100%"
                             :pt="{ column: { bodycell: ({ state }) => ({
                                    class: [{ '!pt-0 !pb-0': state['d_editing'] }, '!border-0']
                                })},
                                rowGroupHeaderCell: (options: any) => ({ class: ['!border-y-[1px]'] }),
                                rowGroupFooterCell: (options: any) => ({ class: ['!border-y-[1px]'] })}">
                    <template #header>
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div class="flex flex-row items-center gap-2">
                          <span class="text-xl font-bold">Job Tasks</span>
                          <span class="pi pi-info-circle sub-description"
                                style="font-size: .875rem"></span>
                        </div>
                        <div class="flex flex-row items-center gap-4">
                          <Transition>
                            <div v-if="selectedTasksAmount" class="flex flex-row items-center gap-2">
                              <Badge :value="selectedTasksAmount"></Badge>
                              <span>Selected</span>
                            </div>
                          </Transition>
                          <Button label="Delete" severity="secondary" :disabled="!canDeleteSelection"
                                  @click="deleteSelected"/>
                          <Button label="Add task" icon="pi pi-plus" @click="newTaskModalVisible = true"/>
                          <Dialog v-model:visible="newTaskModalVisible" modal header="New job task"
                                  :draggable="false" :style="{ width: '40rem', height: '28rem'}">
                            <div class="flex flex-row">
                              <Listbox v-model="selectedCity" :options="groupedCities" optionLabel="label"
                                       optionGroupLabel="label" optionGroupChildren="items"
                                       class="w-full h-full md:w-56">
                                <template #optiongroup="slotProps">
                                  <div class="flex items-center">
                                    <img :alt="slotProps.option.name"
                                         src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                                         :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`"
                                         style="width: 18px"/>
                                    <div>{{ slotProps.option.label }}</div>
                                  </div>
                                </template>
                              </Listbox>

                              <div class="flex flex-col">
                                <span>Task name</span>
                                <InputText v-model="newTaskName"></InputText>
                              </div>

                            </div>
                          </Dialog>
                        </div>
                      </div>
                    </template>
                    <!--    DO NOT REMOVE groupRowsBy column attribute (e.g. scope)-->
                    <Column field="scope" header="Scope"/>
                    <Column selectionMode="multiple" style="width: 1.5rem"/>
                    <Column field="name" header="Name" class="" style="width: 40%">
                      <template #body="{ data }">
                        <div class="flex items-center gap-3">
                          <!--                    <i class="pi pi-hammer text-center"/>-->
                          <span>{{ data.name }}</span>
                        </div>
                      </template>
                      <template #editor="{ data }: { data: JobTask }">
                        <InputText v-model="data.name" autofocus fluid/>
                      </template>
                    </Column>
                    <Column field="price" sortable style="width: 35%">
                      <template #body="{ data }">
                        <div class="flex">
                          <div class="flex flex-col">
                            <span>{{ `\$3,510.00` }}</span>
                            <span class="sub-description font-light text-xs">{{ formatCurrency(data.price) }}</span>
                          </div>
                        </div>
                      </template>
                      <template #editor="{ data }">
                        <InputNumber v-model="data.price" fluid autofocus/>
                      </template>
                      <template #header>
                        <div class="flex flex-col mr-2">
                          <span class="font-semibold">Price</span>
                          <span class="font-light text-xs">Generated Price</span>
                        </div>
                      </template>
                    </Column>
                    <Column header="Status">
                      <template #body="{ data }">
                        <div v-if="calculateCompletionRatio(data) === 1" class="flex justify-center">
                          <span class="pi pi-check"></span>
                        </div>
                        <ProgressBar v-else :value="calculateCompletionRatio(data)" :showValue="false"
                                     pt:root:style="height: 0.25rem"/>

                      </template>
                    </Column>
                    <Column style="width: 4rem">
                      <template #body="{ data }: { data: JobTask }">
                        <div class="flex">
                          <Button icon="pi pi-ellipsis-v" @click="toggleJobTaskMenuItem($event, data.id)" text rounded/>
                          <Menu :id="data.id" :model="items" ref="menu" popup>
                            <template #item="{ item, props }">
                              <a v-ripple class="flex items-center" v-bind="props.action">
                                <span v-if="item.icon" :class="item.icon"/>
                                <span v-else style="height: 1rem; width: 1rem;"/>
                                <span class="" style="max-height: 1rem; display: inline-flex; align-items: center;">{{
                                    item.label
                                  }}</span>
                              </a>
                            </template>
                          </Menu>
                        </div>

                      </template>
                    </Column>
                    <template #groupheader="{ data }: { data: JobTask }">
                      <div class="flex items-center ml-0 gap-2">
                        <span class="pi pi-box text-zinc-500 dark:text-zinc-400"></span>
                        <span class="font-bold text-zinc-500 dark:text-zinc-400">{{ data.scope }}</span>
                      </div>
                    </template>
                    <template #groupfooter="{ data }: { data: JobTask }">
                      <div class="flex flex-row justify-end items-center w-full">
                        <span class="font-normal sub-description mr-8">Subtotal</span>
                        <div class="flex flex-col justify-end mr-[3rem]">
                          <span class="font-bold">${{ getTaskGroupTotalPrice(data.scope) }}</span>
                          <span class="sub-description font-light text-xs">${{
                              getTaskGroupTotalPrice(data.scope)
                            }}</span>
                        </div>
                      </div>
                    </template>
                    <template #empty>
                      <div class="flex flex-col items-center justify-center gap-2 h-48">
                        <i style="font-size: 1.5rem" class="pi pi-database sub-description"/>
                        <span class="sub-description">No tasks added</span>
                      </div>
                    </template>
                  </DataTable>
                </div>
              </template>
            </Card>
          </div>

          <Card class="flex-1">
            <template #content>
              <div class="flex flex-row justify-between items-stretch gap-4">
                <div class="flex flex-col flex-1">
                  <div class="card-header">
                    <span class="text">Construction Challenges</span>
                  </div>
                  <Tabs v-model:value="challengeTabValue">
                    <TabList ref="tabList">
                      <Tab v-for="tab in challengeTabs" :value="tab.id">
                        <div class="tab">
                          <span>{{ tab.label }}</span>
                          <Transition @before-enter="triggerTabUpdate" @after-leave="triggerTabUpdate">
                          <span v-if="tab.selection.value.length" class="badge"
                                :class="{ 'badge-inactive': challengeTabValue !== tab.id }">
                            {{ tab.selection.value.length }}
                          </span>
                          </Transition>
                        </div>
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel v-for="([challengeType, tab]) in Object.entries(challengeTabs)"
                                :value="tab.id" class="min-h-[16rem]">
                        <div class="flex flex-col">
                          <div class="checkbox-grid">
                            <template v-for="toggleChallenge in getChallengeToggles(ChallengeType.Concession)"
                                      :key="String(concession.id)" class="checkbox-grid">
                              <div class="checkbox">
                                <Checkbox v-model="selectedConcessions" :inputId="concession.id"
                                          name="concession" :value="concession.id"/>
                              </div>
                              <label :for="String(concession.id)" class="checkbox-label"
                                     :class="{ 'checkbox-label-selected': selectedConcessions.includes(concession.id) }">
                                {{ concession.label }}
                              </label>
                              <span class="subtitle">+ {{ formatCurrency(concession.price) }}</span>
                            </template>
                          </div>
                          <Divider/>
                          <div class="grid-container">
                            <label class="grid-l subtitle">Stucco</label>
                            <div class="grid-r">
                              <InputGroup>
                                <InputNumber v-model="stuccoSqFt"/>
                                <InputGroupAddon>ft<sup>2</sup></InputGroupAddon>
                              </InputGroup>
                            </div>
                            <span class="subtitle">+ {{ formatCurrency(49) }}</span>
                            <label class="grid-l subtitle">Paint service</label>
                            <div class="grid-r">
                              <InputNumber v-model="paintSqFt" fluid/>
                            </div>
                            <span class="subtitle">+ {{ formatCurrency(49) }}</span>
                            <label class="grid-l subtitle">Paint</label>
                            <div class="grid-r">
                              <InputGroup>
                                <InputNumber v-model="paintSqFt"/>
                                <InputGroupAddon>ft<sup>2</sup></InputGroupAddon>
                              </InputGroup>
                            </div>
                            <span class="subtitle">+ {{ formatCurrency(49) }}</span>
                            <label class="grid-l subtitle">Plastic</label>
                            <div class="grid-r">
                              <InputGroup>
                                <InputNumber v-model="plasticSqFt"/>
                                <InputGroupAddon>ft<sup>2</sup></InputGroupAddon>
                              </InputGroup>
                            </div>
                            <span class="subtitle">+ {{ formatCurrency(49) }}</span>
                          </div>
                        </div>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </div>

                <div class="flex flex-col flex-1">
                  <div class="card-header">
                    <span class="text">Cost Breakdown</span>
                  </div>

                </div>
              </div>
            </template>
          </Card>

          <Panel header="Footer" toggleable :collapsed="true">
          </Panel>

        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>
root {
  --challenges-price-length: 5rem;
}

.input-width {
  width: 400px;
}

.input-gap {
  gap: 24px;
  grid-column-gap: 12px;
}

.estimate-grid > *:nth-last-child(2),
.estimate-grid > *:nth-last-child(1) {
  margin-top: -18px;
}

.business-details:not(:has(b)) {
  font-weight: 300;
  color: #d0d0d0;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: auto 1fr 5rem;
  align-items: center;
  column-gap: 12px;
  row-gap: 4px;

  .checkbox {
    display: flex;
    align-items: center;
  }

  .checkbox-label {
    min-width: 10rem;
    margin: 4px;
    display: flex;
    align-items: center;
    justify-content: left;
    text-align: left;
    font-size: 16px;
    color: var(--p-text-muted-color);
  }

  .checkbox-label-selected {
    color: var(--p-text-color);
  }
}

.estimate-grid {
  display: grid;
  align-content: flex-start;
  grid-template-columns: 1fr 400px;

  .estimate-l {
    display: flex;
    align-items: center;
    justify-content: right;
    text-align: right;
    font-size: 16px;
  }

  .estimate-r {
    display: flex;
    align-items: center;
    justify-content: start;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: 4.5rem 1fr 5rem;
  grid-auto-rows: 50px;
  column-gap: 8px;
  width: 100%;
  max-width: 600px;
  align-items: center;

  .grid-l {
    margin: 4px;
    display: flex;
    justify-content: right;
    text-align: right;
    font-size: 0.875rem;
  }

  .grid-r {
    padding: 4px;
    display: flex;
    justify-content: left;
    gap: 12px;
  }
}

.tab {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 1.5rem;
}

.badge {
  display: inline-flex;
  background-color: var(--p-surface-800);
  color: var(--p-text-color);
  height: 1.5rem;
  width: 1.5rem;
  border-radius: .75rem;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
}

.badge-inactive {
  background-color: var(--p-surface-700);
  color: var(--p-text-muted-color);
}


.card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  .text {
    font-weight: 600;
  }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.v-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

</style>