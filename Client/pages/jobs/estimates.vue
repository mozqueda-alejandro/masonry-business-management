<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useScroll } from "@vueuse/core";


definePageMeta({
  middleware: [
    "global-navigation"
  ]
});

const store = useGlobalNavigationStore();
const { currentComponent, keepAliveComponents } = storeToRefs(store);

const el: any = ref(null);
const smooth = ref(true);
const behavior = computed(() => smooth.value ? "smooth" : "auto");

onMounted(() => {
  const { x, y } = useScroll(el, { behavior });
  watch(currentComponent, async () => {
    await nextTick();
    console.log(y.value);
    setTimeout(() => {
      y.value = 0;
    }, 0);
  });
});

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Estimates">
      </UDashboardNavbar>
      <div class="p-4 px-32 flex-1 flex flex-col overflow-y-auto" ref="el">
        <KeepAlive :include="keepAliveComponents">
          <component :is="currentComponent"/>
        </KeepAlive>
      </div>


    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>
.scroll-container {
  width: 100%;
  height: 200px; /* Adjust the height as needed */
  overflow-y: auto; /* Enables vertical scrolling */
  border: 1px solid #ccc;
}

.scrollable {
  overflow-y: auto;
}

.scrollable-content {
  padding: 10px;
}
</style>