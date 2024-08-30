<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import { FilterMatchMode } from '@primevue/core/api';

import { EstimateStatus } from "~/types/businessEnums"
import { formatDate } from "~/utils/formatting";

const selectedEstimate = ref<EstimateSummary>();
watch(selectedEstimate, (newValue) => {
  if(newValue) {
    navigateTo(`/estimates/${ newValue.id }/view`)
  }
})

import { estimateTestData } from "~/types/constants";
const estimates = ref(
    estimateTestData
);

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
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="">
      </UDashboardNavbar>
      <div class="p-4 px-12 flex-1 flex flex-col overflow-y-auto" ref="el">
        <div class="flex justify-between">
          <div>

          </div>
          <div>
            <Button label="New Estimate" icon="pi pi-plus" priority="success" @click="navigateTo('/estimates/new')"/>
          </div>
        </div>

        <Card>
          <template #content>
            <DataTable v-model:selection="selectedEstimate" selectionMode="single" v-model:filters="filters" :value="estimates" paginator :rows="5" tableStyle="min-width: 50rem">
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
              <Column header="Date">
                <template #body="{ data }: { data: EstimateSummary }">
                  {{ formatDate(data.date) }}
                </template>
              </Column>
              <Column field="id" header="Number"></Column>
              <Column field="client" header="Client"></Column>
              <Column field="price" header="Price"></Column>
            </DataTable>
          </template>
        </Card>
      </div>


    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>
</style>
