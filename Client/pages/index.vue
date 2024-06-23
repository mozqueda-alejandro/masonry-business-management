<script setup lang="ts">
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DatePicker from "primevue/datepicker";
import { useDarkModeStore } from "~/stores/darkModeStore";
import { storeToRefs } from 'pinia'


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

// Dark Mode
const store = useDarkModeStore();
const { isDark } = storeToRefs(store);

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton color="gray" variant="ghost" square @click="isNotificationsSlideoverOpen = true">
              <UChip color="red" inset>
                <UIcon name="i-heroicons-bell" class="w-5 h-5"/>
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdown :items="items">
            <UButton icon="i-heroicons-plus" size="md" class="ml-1.5 rounded-full"/>
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent>
        <DataTable scrollable scrollHeight="200px" tableStyle="min-width: 60rem" :value=state.products>
          <Column field="code" header="Code"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column field="quantity" header="Quantity"></Column>
        </DataTable>

        <Button label="Toggle theme" rounded @click="isDark = !isDark"/>
        <Button label="Link" link />

        <DatePicker></DatePicker>

      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style>

</style>