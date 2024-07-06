<script setup lang="ts">
const route = useRoute();
const { isHelpSlideoverOpen } = useDashboard();

const newLink = [{
  id: 'new',
  label: 'New',
  icon: 'i-heroicons-plus'
}]

const links = computed(() => [{
  id: 'home',
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: 'Home',
    shortcuts: ['G', 'H']
  }
}, {
  id: "jobs",
  label: "Job Management",
  icon: "i-heroicons-building-office",
  defaultOpen: route.path.startsWith('/jobs'),
  children: [{
    label: "Jobs",
    to: "/jobs",
    click: () => {
      console.log('clicked job');
    }
  }, {
    label: "Estimates",
    to: "/jobs/estimates"
  }, {
    label: "Invoices",
    to: "/jobs/invoices"
  }, {
    label: "Clients",
    to: "/jobs/clients"
  }]
}, {
  id: "purchases",
  label: "Purchases",
  icon: "i-heroicons-currency-dollar",
  defaultOpen: route.path.startsWith('/purchases'),
  children: [{
    label: "Bills",
    to: "/purchases/bills"
  }, {
    label: "Vendors",
    to: "/purchases/vendors"
  }]
}, {
  id: 'payroll',
  label: 'Payroll',
  icon: 'i-heroicons-user-group',
  defaultOpen: route.path.startsWith('/payroll'),
  children: [{
    label: 'Employees',
    to: '/payroll/employees'
  }, {
    label: 'Timesheets',
    to: '/payroll/timesheets'
  }],
  tooltip: {
    text: 'Payroll',
    shortcuts: ['G', 'P']
  }
}, {
  id: "reports",
  label: "Reports",
  to: "/reports",
  icon: "i-heroicons-chart-pie",
  tooltip: {
    text: 'Reports',
    shortcuts: ['G', 'R']
  }
}]);

const footerLinks = [{
  label: 'Material Library',
  icon: 'i-heroicons-book-open',
  to: '/materials'
}, {
  label: 'Settings',
  icon: 'i-heroicons-cog-8-tooth',
  to: '/settings'
}];

const groups = [{
  key: 'links',
  label: 'Go to',
  commands: links.value.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, {
  key: 'code',
  label: 'Code',
  commands: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github'
  }]
}];

</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <CompanyDropdown/>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton hide-color-mode/>
        </template>

<!--        <UDashboardSidebarLinks :links="newLink"/>-->

        <UDivider/>
        <UDashboardSidebarLinks :links="links"/>

        <div class="flex-1"/>

        <UDashboardSidebarLinks :links="footerLinks"/>

        <UDivider class="sticky bottom-0"/>

        <template #footer>
          <UserDropdown/>
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot/>

    <HelpSlideover/>
    <NotificationsSlideover/>

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups"/>
    </ClientOnly>
  </UDashboardLayout>
</template>
