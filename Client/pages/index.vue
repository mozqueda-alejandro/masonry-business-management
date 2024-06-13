<script setup lang="ts">
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
</script>

<template>
  <div class="container">
    <Button label="Danger" severity="danger" raised/>
    <div class="card flex justify-center">
      <DatePicker showIcon :showOnFocus="false"/>
    </div>
  </div>

</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 20px;
}
</style>