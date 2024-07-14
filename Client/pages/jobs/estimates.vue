<script setup lang="ts">
import { toRaw } from "vue";
import { storeToRefs } from "pinia";


const store = useGlobalNavigationStore();
const { currentComponent, keepAliveComponents } = storeToRefs(store);

// delay 3 seconds
setTimeout(() => {
  console.log("Keep alive components: ", keepAliveComponents.value);
}, 1000);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Estimates">
      </UDashboardNavbar>

      <UDashboardPanelContent>
        <KeepAlive :include="keepAliveComponents">
          <component :is="currentComponent"/>
        </KeepAlive>
      </UDashboardPanelContent>

    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>

</style>