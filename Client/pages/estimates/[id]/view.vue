<script setup lang="ts">
const route = useRoute()
const estimateId = Number(route.params.id)
</script>

<template>
  <EstimateForm :id="estimateId" />
</template>

<style scoped>

</style>