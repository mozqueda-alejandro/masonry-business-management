<script setup lang="ts">
const links = [[{
  label: 'General',
  icon: 'i-heroicons-user-circle',
  to: '/settings',
  exact: true
}, {
  label: 'Members',
  icon: 'i-heroicons-user-group',
}, {
  label: 'Notifications',
  icon: 'i-heroicons-bell',
}], [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open',
  target: '_blank'
}, {
  label: 'Buy now',
  icon: 'i-heroicons-credit-card',
  target: '_blank'
}]]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Settings" />

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
