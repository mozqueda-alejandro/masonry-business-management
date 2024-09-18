<script setup lang="ts">
import { useTemplateRef } from 'vue';

import Button from "primevue/button";
import { Bar } from "vue-chartjs";
import { Line } from 'vue-chartjs'

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

// Dark Mode
const store = useDarkModeStore();
const { isDark } = storeToRefs(store);

watch(isDark, (value) => {

});

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      data: [40, 39, 10, 40, 39, 80, 40],
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false
}

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
          <Line :data="data" :options="options"/>

          <Button label="Toggle Theme" @click="isDark = !isDark"/>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style>

</style>