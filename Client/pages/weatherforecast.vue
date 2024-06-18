<script setup lang="ts">
import { FetchError } from "ofetch";
import DatePicker from "primevue/datepicker";
import Column from "primevue/column";
import Button from "primevue/button";
import DataTable from "primevue/datatable";

const { $api } = useNuxtApp();

type Forecasts = Array<{
  date: string
  temperatureC: number
  temperatureF: number
  summary: string
}>

const data = ref<Forecasts>([]);
const pending = ref<boolean>(true);
const error = ref<string | null>(null);

const props = defineProps<{
  cities?: string[]
}>();

try {
  data.value = await $api<Forecasts>("/weatherforecast");
  pending.value = false;
} catch (e) {
  if (e instanceof FetchError) {
    error.value = e.message;
  }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardPanelContent>
        <h2>Weather forecast</h2>
        <p>This component demonstrates fetching data from the server.</p>
        <div v-if="error != null">The backend is not running or there is an error in the API call.</div>
        <div v-else-if="pending">Loading data from the API...</div>
        <div v-else>
          <table>
            <thead>
            <tr>
              <th>Date</th>
              <th>Temp. (C)</th>
              <th>Temp. (F)</th>
              <th>Summary</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="forecast in data as Forecasts" :key="forecast.date">
              <td>{{ forecast.date }}</td>
              <td>{{ forecast.temperatureC }}</td>
              <td>{{ forecast.temperatureF }}</td>
              <td>{{ forecast.summary }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>

</template>
