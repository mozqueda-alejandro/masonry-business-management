<script setup lang="ts">
import type { Component } from "vue";

import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import DatePicker from "primevue/datepicker";
import Dialog from "primevue/dialog";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import Panel from "primevue/panel";
import Select from "primevue/select";
import ToggleSwitch from "primevue/toggleswitch";


import {
  IJobScopesAddition,
  IJobScopesDemo,
  IJobScopesInstallation,
  IJobScopesRepair,
  IJobScopesStone,
  IJobScopesTemporaryFence
} from "#components";


import { JobScope } from "~/types/enums";
import { EstimatesRequests } from "~/types/constants";

const { changeView } = useGlobalNavigationStore();

interface Location {
  id?: number;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface BusinessDetails {
  name: string;
  location: Location;
  phone: string;
  email: string;
  website: string;
  license: string;
}

interface Client {
  id?: number;
  name: string;
  address: string;
  // lastName: string;
  email: string;
  phone: string;
}

function getBusinessDetails(): BusinessDetails {
  return {
    name: "Masonry Contractor",
    location: { address: "1234 Virginia St", city: "Las Vegas", state: "NV", zip: "89000" },
    phone: "123-456-7890",
    email: "contractor@gmail.com",
    website: "contractor.com",
    license: "#0000001"
  };
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

const estimateName = ref<string>("Job Estimate");
const estimateDescription = ref<string>();
const businessDetails = ref<BusinessDetails>(getBusinessDetails());
const selectedClient = ref<Client>();
const clients = ref<Client[]>(getClients());

const pSelect = ref<InstanceType<typeof Select>>();
const businessDetailsModalVisible = ref(false);

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

const _jobTasks = ref([
  { id: 1, scope: JobScope.Installation, name: "Dig Footing", price: 1000 },
  { id: 2, scope: JobScope.Installation, name: "Pour Footing", price: 2000 },
  { id: 3, scope: JobScope.Installation, name: "Lay Block", price: 3000 },
  { id: 4, scope: JobScope.Addition, name: "Grout", price: 4000 },
  { id: 5, scope: JobScope.Addition, name: "Stucco", price: 5000 },
  { id: 6, scope: JobScope.Stone, name: "Stone wall", price: 6000 },
  { id: 7, scope: JobScope.Demo, name: "Knock down retaining", price: 7000 }
]);
const jobTasks = computed({
  get: () => _jobTasks.value,
  set(newValue) {
    _jobTasks.value = newValue;
  }
});

const newTaskModalVisible = ref(false);

interface TaskElement {
  icon: Component;
  description: string;

}

const newTaskModal: Record<JobScope, TaskElement> = {
  [JobScope.Installation]: { icon: IJobScopesInstallation, description: "New installation of CMU wall, with no pre-existing structures." },
  [JobScope.Addition]: { icon: IJobScopesAddition, description: "Wall-on-top or extra courses installed on pre-existing wall." },
  [JobScope.Repair]: { icon: IJobScopesRepair, description: "Reparation of CMU wall." },
  [JobScope.Demo]: { icon: IJobScopesDemo, description: "Masonry unit demolition." },
  [JobScope.TemporaryFence]: { icon: IJobScopesTemporaryFence, description: "Temporary fencing installation for exposed areas." },
  [JobScope.Stone]: { icon: IJobScopesStone, description: "Stone installation or repair." }
};

async function onScopeSelected(scope: JobScope) {
  newTaskModalVisible.value = false;
  changeView(EstimatesRequests.NewJobTask);
}


const menu = ref();
const items = ref([
  {
    label: "View",
    icon: "pi pi-eye"
  },
  {
    label: "Edit",
    icon: "pi pi-pencil"
  },
  {
    label: "Remove",
    icon: "pi pi-trash"
  }
]);

const toggleJobTaskMenuItem = (event: any) => {
  menu.value.toggle(event);
};

// :pt="{ rowGroupHeaderCell: (options: any) => ({ class: [''] })}"

</script>

<template>
  <div class="flex flex-col gap-4">

    <div class="flex flex-row justify-between mb-1">
      <div class="flex flex-row items-center gap-2">
        <p class="text-xl">New Job Estimate</p>
      </div>
      <div class="flex flex-row gap-4">
        <Button severity="secondary" icon="pi pi-times" @click="changeView(EstimatesRequests.Estimates)"/>
        <Button label="Import Inspection" severity="secondary" @click="changeView(EstimatesRequests.Estimates)"/>
        <Button label="Continue" iconPos="right" icon="pi pi-arrow-right" @click="changeView(EstimatesRequests.NewJobTask)"/>
      </div>
    </div>

    <div>
      <Panel header="Business Details" toggleable>
        <div class="flex flex-row justify-between my-6">

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
            <DataTable :value="jobTasks" rowGroupMode="subheader" groupRowsBy="scope" sortMode="single"
                       sortField="scope" :sortOrder="1" scrollHeight="600px" editMode="cell" style="width: 95%"
                       :pt="{ column: { bodycell: ({ state }) => ({
                                    class: [{ '!pt-0 !pb-0': state['d_editing'] }]
                                })}}">
              <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="text-xl font-bold">Job Tasks</span>
                  <Button label="Add task" icon="pi pi-plus" @click="newTaskModalVisible = true"/>
                  <Dialog v-model:visible="newTaskModalVisible" modal header="Job Scopes"
                          :draggable="false" :style="{ width: '35rem' }">
                    <span class="block mb-8">Select the scope of the job task to be added to the estimate.</span>
                    <div class="grid grid-cols-1 sm:grid-cols-2 ">
                      <div v-for="(value, key) in newTaskModal" :key="key" class="w-full p-2 h-[8rem]">
                        <Button severity="primary" outlined fluid class="h-full"
                                @click="onScopeSelected(key)"
                                v-tooltip="{ value: value.description, showDelay: 300, hideDelay: 50 }">
                          <div class="flex flex-col justify-center items-center">
                            <component :is="value.icon" class="text-5xl" filled></component>
                            <span>{{ key }}</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </Dialog>
                </div>
              </template>
              <!--    DO NOT REMOVE groupRowsBy column attribute (e.g. scope)-->
              <Column field="scope" header="Scope"/>
              <Column field="name" header="Name" style="min-width: 400px">
                <template #body="{ data }">
                  <div class="flex items-center m-1 gap-3">
                    <i class="pi pi-hammer text-center"/>
                    <span>{{ data.name }}</span>
                  </div>
                </template>
                <template #editor="{ data, field }">
                  <InputText v-model="data[field]" autofocus fluid/>
                </template>
              </Column>
              <Column field="price" header="Price" style="min-width: 200px">
                <template #body="{ data }">
                  {{ formatCurrency(data.price) }}
                </template>
              </Column>
              <Column header="Status">
                <template #body="{ data }">

                </template>
              </Column>
              <Column style="width: 100px">
                <template #body>
                  <Button icon="pi pi-ellipsis-v" @click="toggleJobTaskMenuItem($event)" text rounded/>
                  <Menu :model="items" ref="menu" popup/>
                </template>
              </Column>
              <template #groupheader="{ data }">
                <div class="flex items-center gap-2">
<!--                  <i class="pi pi-hammer"/>-->
                  <span class="font-bold">{{ data.scope }}</span>
                </div>
              </template>
              <template #groupfooter="slotProps">
                <div class="flex justify-end font-bold w-full">Total Customers: {{ 5 }}</div>
              </template>
            </DataTable>
          </div>
        </template>
      </Card>
    </div>

    <Panel header="Business Details" toggleable>

      <div class="flex justify-around">
        <div>
          <span class="text-lg">Lay Up Challenges</span>
          <div v-for="challenge in layUpChallenges" :key="challenge.value" class="checkbox-grid">
            <div class="checkbox">
              <Checkbox v-model="selectedLayUpChallenges" :inputId="challenge.value" name="layUpChallenge"
                        :value="challenge.value"/>
            </div>
            <label :for="challenge.value" class="grid-label">{{ challenge.label }}</label>
          </div>

          <span class="text-lg">Stock Challenges</span>
          <div v-for="challenge in stockChallenges" :key="challenge.value" class="checkbox-grid">
            <div class="checkbox">
              <Checkbox v-model="selectedStockChallenges" :inputId="challenge.value" name="stockChallenge"
                        :value="challenge.value"/>
            </div>
            <label :for="challenge.value" class="grid-label">{{ challenge.label }}</label>
          </div>
        </div>

        <div>
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
        </div>
      </div>
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

</style>