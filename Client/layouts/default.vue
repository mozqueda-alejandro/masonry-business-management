<script setup lang="ts">
const route = useRoute();
const appConfig = useAppConfig();
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
  id: 'inbox',
  label: 'Inbox',
  icon: 'i-heroicons-inbox',
  to: '/inbox',
  badge: '4',
  tooltip: {
    text: 'Inbox',
    shortcuts: ['G', 'I']
  }
}, {
  id: "jobs",
  label: "Job Management",
  icon: "i-heroicons-building-office",
  to: "/jobs",
  defaultOpen: route.path.startsWith('/jobs'),
  children: [{
    label: "Jobs",
    to: "/jobs",
  }, {
    label: "Estimates",
    to: "/jobs/estimates"
  }, {
    label: "Invoices",
    to: "/jobs/invoices"
  }, {
    label: "Clients",
    to: "/jobs/clients"
  }, {
    label: "Inventory",
    to: "/jobs/inventory"
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
  }, {
    label: 'Tax Forms',
    to: '/payroll/taxforms'
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
  to: '/settings',

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
    icon: 'i-simple-icons-github',
    click: () => {
      window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${ route.path === '/' ? '/index' : route.path }.vue`, '_blank');
    }
  }]
}];

</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
        :width="250"
        :resizable="{ min: 200, max: 300 }"
        collapsible
    >
      <UDashboardNavbar
          class="!border-transparent"
          :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <CompanyDropdown/>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton/>
        </template>

        <UDashboardSidebarLinks :links="newLink"/>
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
