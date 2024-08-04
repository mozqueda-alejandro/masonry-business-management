<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from "primevue/inputtext";
import Tag from 'primevue/tag';
import { FilterMatchMode } from '@primevue/core/api';


import { EstimatesRequests } from "~/types/constants";
const { changeView } = useGlobalNavigationStore();

enum EstimateStatus {
  Approved = 'Approved',
  Draft = 'Draft',
  Saved = 'Saved',
  Sent = 'Sent',
  Viewed = 'Viewed'
}

const estimates = ref([
  { status: EstimateStatus.Approved, date: '2021-10-10', id: 1, customer: "John Doe", amount: 1000 },
  { status: EstimateStatus.Draft, date: '2021-10-10', id: 2, customer: "Jane Doe", amount: 2000 },
  { status: EstimateStatus.Saved, date: '2021-10-10', id: 3, customer: "John Doe", amount: 3000 },
  { status: EstimateStatus.Sent, date: '2021-10-10', id: 4, customer: "Jane Doe", amount: 4000 },
  { status: EstimateStatus.Viewed, date: '2021-10-10', id: 5, customer: "John Doe", amount: 5000 }
]);

type TagSeverity = "secondary" | "info" | "success" | "warn" | "danger" | "contrast" | undefined;

function getSeverity(status: EstimateStatus): TagSeverity {
  switch (status) {
    case EstimateStatus.Draft:
      return 'danger';

    case EstimateStatus.Approved:
      return undefined;

    case EstimateStatus.Sent:
      return 'info';

    case EstimateStatus.Saved:
      return 'warn';

    case EstimateStatus.Viewed:
      return 'success';

    default:
      return undefined;
  }
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});

</script>

<template>
  <div class="flex justify-between">
    <div>

    </div>
    <div>
      <Button label="New Estimate" icon="pi pi-plus" priority="success" @click="changeView(EstimatesRequests.NewEstimate)"/>
    </div>
  </div>

  <Card>
    <template #content>
      <DataTable v-model:filters="filters" :value="estimates" tableStyle="min-width: 50rem">
        <template #header>
          <div class="flex justify-between">
            <span class="flex">Estimates</span>
            <div class="flex">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search all" />
              </IconField>
            </div>
          </div>

        </template>
        <template #empty> No customers found. </template>
        <Column field="status" header="Status">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
          </template>
        </Column>
        <Column field="date" header="Date"></Column>
        <Column field="id" header="Number"></Column>
        <Column field="customer" header="Customer"></Column>
        <Column field="amount" header="Amount"></Column>
      </DataTable>
    </template>
  </Card>
</template>

<style scoped>

</style>