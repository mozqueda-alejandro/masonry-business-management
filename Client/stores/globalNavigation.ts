import { defineStore } from "pinia";
import Estimates from "../components/estimates/Main.vue";
import NewEstimate from "../components/estimates/New.vue";

import { Screen } from "~/types";

// interface View {
//     path: string,
//     component: any
// }
//
// interface PageViews {
//     path: string,
//     defaultComponent: any,
//
// }
//
// const views: Record<Screen, View> = {
//     [Screen.Estimates]: { path: "/estimates", component: Estimates },
//     [Screen.NewEstimate]: { path: "/estimates", component: NewEstimate }
// };

export const useGlobalNavigationStore = defineStore("globalNavigation", () => {
    const route = useRoute();
    const currentView = ref();

    function changeView() {

    }
    return { changeView, currentView };
});