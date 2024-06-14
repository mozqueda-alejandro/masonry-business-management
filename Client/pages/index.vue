<script setup lang="ts">
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Select from "primevue/select";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import DatePicker from "primevue/datepicker";
import SplitButton from 'primevue/splitbutton';
import ToggleButton from 'primevue/togglebutton';


const { isNotificationsSlideoverOpen } = useDashboard()

const items = [[{
  label: 'New mail',
  icon: 'i-heroicons-paper-airplane',
  to: '/inbox'
}, {
  label: 'New user',
  icon: 'i-heroicons-user-plus',
  to: '/users'
}]]

let state = {
  displayBasic: true,
  products: [
    { name: "toto" },
    { name: "toto" },
    { name: "toto" },
    { name: "toto" },
    { name: "toto" },
    { name: "toto" },
    { name: "toto" },
    { name: "toto" },
    { name: "toto" },
    { name: "toto" },
    { name: "toto" }
  ]
};

const cities = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
  { name: 'Barcelona', code: 'BCN' },
  { name: 'Berlin', code: 'BLN' },
  { name: 'Brasilia', code: 'BSB' },
  { name: 'Budapest', code: 'BUD' },
  { name: 'Buenos Aires', code: 'BUE' },
  { name: 'Prague', code: 'PRG' },
  { name: 'Warsaw', code: 'WAW' },
  { name: 'Los Angeles', code: 'LAX' },
  { name: 'Tokyo', code: 'TYO' },
  { name: 'Vienna', code: 'VIE' }
];

let selectedCity = ref('');

import { useDarkModeStore } from "~/stores/darkModeStore";
const { toggleTheme } = useDarkModeStore();

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <UTooltip
              text="Notifications"
              :shortcuts="['N']"
          >
            <UButton
                color="gray"
                variant="ghost"
                square
                @click="isNotificationsSlideoverOpen = true"
            >
              <UChip
                  color="red"
                  inset
              >
                <UIcon
                    name="i-heroicons-bell"
                    class="w-5 h-5"
                />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdown :items="items">
            <UButton
                icon="i-heroicons-plus"
                size="md"
                class="ml-1.5 rounded-full"
            />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent>
        <DataTable
            scrollable
            scrollHeight="200px"
            tableStyle="min-width: 60rem"
            :value=state.products
        >
          <Column field="code" header="Code"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column field="quantity" header="Quantity"></Column>
        </DataTable>

        <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City"  :highlightOnSelect="false"/>

        <Button label="Button1" rounded @click="toggleTheme">Button</Button>
        <Button label="Link" link />
        <SplitButton label="Save"></SplitButton>
        <ToggleButton onLabel="On" offLabel="Off" />

        <InputText type="text" >45345</InputText>
        <DatePicker></DatePicker>

      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style>

</style>