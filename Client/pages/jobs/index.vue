<script setup lang="ts">
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Jobs">
      </UDashboardNavbar>

      <UDashboardPanelContent>
        Jobs
        <button @click="navigateTo('/jobs/invoices')">navigateTo</button>
      </UDashboardPanelContent>

    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>

</style>