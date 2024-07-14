<script setup lang="ts">
import Button from 'primevue/button';
import { NavigationCommand } from "~/types/enums";
const store = useGlobalNavigationStore();
const { changeView } = store;
</script>

<template>
Main estimates
  <input type="radio"/>
  <Button label="New Estimate" icon="pi pi-plus" priority="success" @click="changeView(NavigationCommand.NewEstimate)"/>
</template>

<style scoped>

</style>