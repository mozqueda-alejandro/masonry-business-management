<script setup lang="ts">
import { $dt } from "@primeuix/styled";
import type { Component } from "vue"; // STANDARD

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
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Listbox from 'primevue/listbox';
import Menu from "primevue/menu";
import Panel from "primevue/panel";
import ProgressBar from "primevue/progressbar";
import Select from "primevue/select";
import SplitButton from "primevue/splitbutton";
import ToggleButton from 'primevue/togglebutton';
import ToggleSwitch from "primevue/toggleswitch";

import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import { // LOCAL
  IJobScopesAddition,
  IJobScopesDemo,
  IJobScopesInstallation,
  IJobScopesRepair,
  IJobScopesStone,
  IJobScopesTemporaryFence
} from "#components";
import { JobScope } from "~/types/enums";
import { EstimatesRequests } from "~/types/constants";

// region Init

// Unwrapping reactive values from a store
// https://masteringpinia.com/blog/ref-vs-reactive-in-stores
const estimateStore = useEstimateStore();
const { estimate } = estimateStore;
const { getJobTask, removeJobTask } = estimateStore;

const { changeView } = useGlobalNavigationStore();
const businessApi = useBusinessApi();

function getBusinessDetails(): BusinessDetails {
  return businessApi.getBusinessDetails();
}

function getClients(): Client[] {
  return [
    { id: 1, name: "John Doe", email: "johndoe@gmail.com", phone: "123-456-7890", address: "345 Virginia St" },
    { id: 2, name: "Jane Smith", email: "janesmith@example.com", phone: "987-654-3210", address: "678 Roosevelt St" },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@work.com",
      phone: "555-123-4567",
      address: "1234 Washington St"
    },
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
      changeView(EstimatesRequests.Estimates);
    }
  }
];

// endregion

// region BusinessDetails

const estimateName = ref<string>("Job Estimate");
const estimateDescription = ref<string>();
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

const estimateNumber = ref<string>("4");
const estimateDate = ref(new Date());
const validUntilDate = ref<Date | null>(new Date(
    estimateDate.value.getFullYear(),
    estimateDate.value.getMonth(),
    estimateDate.value.getDate() + 30
));
let _validUntilDate = validUntilDate.value;
const usingValidUntilDate = ref(true);

watch(usingValidUntilDate, (value) => {
  if (value) {
    validUntilDate.value = _validUntilDate;
  } else {
    _validUntilDate = validUntilDate.value;
    validUntilDate.value = null;
  }
});

const dateDifference = computed<string>(() => {
  if (!estimateDate.value || !validUntilDate.value) return "No expiration date";

  const diff = validUntilDate.value.getTime() - estimateDate.value.getTime();
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `Within ${ diffDays.toString() } days`;
});

// endregion

// region AddTask

const selectedTask = ref();
// const groupedTasks =

const newTaskModalVisible = ref(false);
const newTaskModal: Record<JobScope, { icon: Component; description: string }> = {
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

async function onScopeSelected(scope: JobScope) {
  newTaskModalVisible.value = false;
  changeView(EstimatesRequests.NewJobTask);
}

const testToggle = ref(false);

// endregion

// region JobTasks

const tasksModel = ref(estimate.tasks);
const selectedTasks = ref();
const selectedTasksAmount = computed(() => {
  const _manualDependency = tasksModel.value;
  if (Array.isArray(selectedTasks.value)) return selectedTasks.value.length;
  return 0;
});

function getTaskGroupTotalPrice(jobScope: JobScope): number | undefined {
  return estimate.tasks
      ?.filter(task => task.scope === jobScope)
      .reduce((acc, task) => acc + (task.price || 0), 0);
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatPhone(value: string) {
  const cleaned = ("" + value).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return value;
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
const items = ref([
  {
    label: "View"
  },
  {
    label: "Edit"
  },
  {
    label: "Copy"
  },
  {
    separator: true
  },
  {
    label: "Remove",
    icon: "pi pi-trash",
    command: async () => {
      if (menuItemSelectedId.value === undefined || menuItemSelectedId.value === null) return;
      const task = estimate.tasks?.find(task => task.id === menuItemSelectedId.value);
      if (!task) return;

      deleteTask(task);
    }
  }
]);

function toggleJobTaskMenuItem(event: any, id: number) {
  menuItemSelectedId.value = id;
  menu.value.toggle(event);
}

//

// region JobTaskDelete

const confirm = useConfirm();
const toast = useToast();
watch(estimate, (newValue) => {
  tasksModel.value = newValue.tasks;
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
      tasksModel.value = estimate.tasks;
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

const selectedConcessions = ref();
const concessions = [
  { label: "Pump for Footing", value: "PumpForFooting" },
  { label: "Pump for Grout", value: "PumpForGrout" },
  { label: "Gate Installation", value: "GateInstallation" },
  { label: "Trash Removal", value: "TrashRemoval" }
];

const stuccoSqFt = ref<number>();
const paintSqFt = ref<number>();
const plasticSqFt = ref<number>();

// endregion

import { initialState } from "~/types/constants";
console.log(initialState);

function calculateCompletionRatio<T>(filledObj: Partial<T>, defaultObj: T = initialState, excludeFields: (keyof T)[] = []): number {
  console.log("running calculateCompletionRatio");
  const keys = Object.keys(defaultObj) as (keyof T)[];
  const relevantKeys = keys.filter(key => !excludeFields.includes(key));
  const totalFields = relevantKeys.length;
  console.log("totalFields", totalFields);
  const completedFields = relevantKeys.filter(key => filledObj[key] !== undefined).length;
  console.log("completedFields", completedFields);
  return completedFields;
}



// :pt="{ rowGroupHeaderCell: (options: any) => ({ class: [''] })}"
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <div class="flex flex-col gap-4">

    <div class="flex flex-row justify-between mb-1">
      <div class="flex flex-row items-center gap-2">
        <p class="text-xl">New Job Estimate</p>
      </div>
      <div class="flex flex-row gap-4">
        <Button icon="pi pi-times" severity="secondary" @click="changeView(EstimatesRequests.Estimates)"/>
        <Button label="Import" icon="pi pi-file-import" severity="secondary"
                @click="importModalVisible = true"/>
        <SplitButton label="Save and continue" :model="saveButtonItems"
                     @click="changeView(EstimatesRequests.NewJobTask)"/>
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
            <Button type="button" label="Cancel" severity="secondary" @click="importModalVisible = false"></Button>
            <Button type="button" label="Save" @click="importModalVisible = false"></Button>
          </div>
        </Dialog>
      </div>
    </div>

    <div>
      <Panel header="Business Details" toggleable>
        <div class="flex flex-row justify-between mt-12 mb-16 mx-4">

          <div class="flex flex-row items-center gap-8">
            <div
                class="flex flex-col justify-center gap-2 border-dashed border-black dark:border-white border-[2px] w-[340px] h-[220px] rounded-lg">
              <i class="pi pi-cloud-upload text-center mb-2" style="font-size: 3rem"></i>
              <p class="text-center">Browse or drop your logo here.</p>
              <p class="sub-description text-center text-sm">
                Maximum 5MB in size.<br>
                JPG, PNG, or GIF formats.<br>
                Recommended size: 300 x 200 pixels.
              </p>
            </div>

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
              <InputText v-model="estimateName" placeholder="Estimate Name" size="large" pt:root:class="text-right"/>
              <InputText v-model="estimateDescription" placeholder="Description or project name (optional)"
                         pt:root:class="text-right"/>
            </div>
            <div class="flex justify-end">
              <Button label="Edit business details" @click="businessDetailsModalVisible = true" text
                      icon="pi pi-pencil"/>
              <Dialog v-model:visible="businessDetailsModalVisible" modal header="Edit Business Profile"
                      :style="{ width: '25rem' }">
                <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your business information.</span>
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
                <InputNumber v-model="estimateNumber" fluid/>
              </div>

              <label class="estimate-l">Date</label>
              <DatePicker v-model="estimateDate" :minDate="new Date()" class="estimate-r"/>

              <label class="estimate-l">Valid until</label>
              <InputGroup>
                <DatePicker v-model="validUntilDate" :minDate="estimateDate" :disabled="!usingValidUntilDate"
                            class="estimate-r"/>
                <InputGroupAddon>
                  <Checkbox v-model="usingValidUntilDate" :binary="true"/>
                </InputGroupAddon>
              </InputGroup>

              <span class="estimate-l"></span>
              <p class="estimate-r sub-description text-sm">{{ dateDifference }}</p>
            </div>
          </div>

          <div class="flex justify-center">
            <DataTable :value="tasksModel" rowGroupMode="subheader" groupRowsBy="scope" sortMode="single"
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
                    <span class="pi pi-info-circle text-zinc-500 dark:text-zinc-400" style="font-size: .875rem"></span>
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
                            :draggable="false" :style="{ width: '35rem' }">
                      <div class="max-w-full px-2 pb-2">
                        <InputText placeholder="Task name" fluid class=""></InputText>
                      </div>
                      <!--                    <span class="block mb-8">Select the scope of the job task to be added to the estimate.</span>-->
                      <div class="grid grid-cols-1 sm:grid-cols-2 ">
                        <div v-for="(jobTask, jobScope) in newTaskModal" :key="jobScope" class="w-full p-2 h-[8rem]">
<!--                          <Listbox v-model="selectedCity" :options="groupedCities" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" class="w-full md:w-56" listStyle="max-height:250px">-->
<!--                            <template #optiongroup="slotProps">-->
<!--                              <div class="flex items-center">-->
<!--                                <img :alt="slotProps.option.name" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`" style="width: 18px" />-->
<!--                                <div>{{ slotProps.option.label }}</div>-->
<!--                              </div>-->
<!--                            </template>-->
<!--                          </Listbox>-->
                          <ToggleButton fluid class="h-full w-full"
                                        @click="" v-model="testToggle"
                                        v-tooltip="{ value: jobTask.description, showDelay: 300, hideDelay: 50 }">
                            <div class="flex flex-col justify-center items-center">
                              <component :is="jobTask.icon" class="text-5xl" filled></component>
                              <span class="">{{ jobScope }}</span>
                            </div>
                          </ToggleButton>
                        </div>
                      </div>
                    </Dialog>
                  </div>
                </div>
              </template>
              <!--    DO NOT REMOVE groupRowsBy column attribute (e.g. scope)-->
              <Column field="scope" header="Scope"/>
              <Column selectionMode="multiple" style="width: 1.5rem"
                      :pt="{ bodyCell: {  }}">
              </Column>
              <Column field="name" header="Name" class="" style="width: 40%">
                <template #body="{ data }">
                  <div class="flex items-center gap-3">
                    <!--                    <i class="pi pi-hammer text-center"/>-->
                    <span>{{ data.name }}</span>
                  </div>
                </template>
                <template #editor="{ data, field }: { data: JobTask, field: string }">
                  <InputText v-model="data[field]" autofocus fluid/>
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
                    <span class="sub-description font-light text-xs">${{ getTaskGroupTotalPrice(data.scope) }}</span>
                  </div>
                </div>
              </template>
            </DataTable>
          </div>
        </template>
      </Card>
    </div>

    <Panel header="Construction Challenges" toggleable>

      <Tabs value="0">
        <TabList>
          <Tab value="0">Lay Up</Tab>
          <Tab value="1">Stock</Tab>
          <Tab value="2">Special Concessions</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0" class="min-h-[16rem]">
            <div class="checkbox-grid">
              <template v-for="challenge in layUpChallenges" :key="challenge.value">
                <div class="checkbox">
                  <Checkbox v-model="selectedLayUpChallenges" :inputId="challenge.value" name="layUpChallenge"
                            :value="challenge.value"/>
                </div>
                <label :for="challenge.value" class="grid-label text-gray-600 dark:text-gray-300">{{
                    challenge.label
                  }}</label>
              </template>
            </div>
          </TabPanel>
          <TabPanel value="1" class="min-h-[16rem]">
            <div class="checkbox-grid">
              <template v-for="challenge in stockChallenges" :key="challenge.value" class="checkbox-grid">
                <div class="checkbox">
                  <Checkbox v-model="selectedStockChallenges" :inputId="challenge.value" name="stockChallenge"
                            :value="challenge.value"/>
                </div>
                <label :for="challenge.value" class="grid-label">{{ challenge.label }}</label>
              </template>
            </div>
          </TabPanel>
          <TabPanel value="2" class="min-h-[16rem]">
            <div class="flex flex-row">
              <div class="checkbox-grid">
                <template v-for="concession in concessions" :key="concession.value" class="checkbox-grid">
                  <div class="checkbox">
                    <Checkbox v-model="selectedConcessions" :inputId="concession.value" name="concession"
                              :value="concession.value"/>
                  </div>
                  <label :for="concession.value" class="grid-label
                  text-gray-600 dark:text-gray-300">{{ concession.label }}</label>
                </template>
              </div>
              <div class="grid-container">
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
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

    </Panel>

    <Panel header="Footer" toggleable :collapsed="true">

    </Panel>


  </div>
</template>

<style scoped>

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
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 12px;
  row-gap: 4px;

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
  grid-template-columns: 140px 1fr;
  grid-auto-rows: 50px;
  column-gap: 8px;
  width: 100%;
  max-width: 600px;


  .grid-l {
    margin: 4px;
    display: flex;
    align-items: center;
    justify-content: right;
    text-align: right;
    font-size: 13px;
  }

  .grid-r {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 12px;
  }

  .grid-r-center {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
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