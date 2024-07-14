<script setup lang="ts">
import NewJobTask from "~/components/estimates/NewJobTask.vue";
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Clients">
      </UDashboardNavbar>

      <UDashboardPanelContent>
        <NewJobTask/>
      </UDashboardPanelContent>

    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>

</style>