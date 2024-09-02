import { defineStore } from "pinia";
import { JobScope } from "~/types/enums";
import { initialState, initialEstimate, estimateTestData } from "~/types/constants";



export const useEstimateStore = defineStore("estimate", () => {

    const estimateApi = useEstimateApi();
    const tempId = ref(0);
    let estimate = ref<Partial<Estimate>>({
        tasks: []
    });

    function loadEstimate(estimateId: number): Partial<Estimate> | undefined {
        if (estimateId === estimate.value.id) return;

        // return item from estimateTestData that matches estimateId
        const response = estimateTestData.find((estimate) => estimate.id === estimateId);
        if (!response) throw new Error("Failed to set estimate");

        console.log("Loaded estimate", response);
        Object.assign(estimate.value, response);
        return estimate.value;
    }

    function resetEstimate() {
        estimate.value = initialEstimate;
        return estimate.value;
    }

    function addJobTask(jobTask: JobTask): boolean {
        const response: JobTask = { ...jobTask, id: tempId.value++ } // API call
        if (!response) {
            console.error("Failed to add task");
            return false;
        }

        estimate.value.tasks?.push(response);
        return true;
    }

    function getJobTask(jobTaskId: number): PartialWithUndefined<JobTask> | null {
        if (!estimate.value.tasks || estimate.value.tasks.length === 0) return null;
        const task = estimate.value.tasks.find((task) => task.id === jobTaskId);
        if (!task) return null;

        return { ...task };
    }

    function editJobTask(jobTask: JobTask) {
        if (estimate.value.tasks?.find((task) => task.name === jobTask.name && task.id !== jobTask.id)) {
            throw new Error("Task name must be unique");
        }

        const response: JobTask = { ...jobTask }; // API call
        const index = estimate.value.tasks?.findIndex((task) => task.id === response.id);
        if (index == undefined || index === -1) throw new Error("Task not found");

        estimate.value.tasks?.splice(index, 1, response);
    }

    function removeJobTask(jobTaskId: number) {
        if (!estimate.value.tasks || estimate.value.tasks.length === 0) throw new Error("No tasks to remove");

        const response = true; // API call
        if (!response) throw new Error("Failed to remove task");

        estimate.value.tasks = estimate.value.tasks.filter((task) => task.id !== jobTaskId);
    }

    function removeJobTasks(jobTaskIds: number[]) {
        if (!estimate.value.tasks || estimate.value.tasks.length === 0) throw new Error("No tasks to remove");
        if (jobTaskIds.length === 0 || jobTaskIds.length > estimate.value.tasks.length) return;

        const response = true; // API call
        if (!response) throw new Error("Failed to remove tasks");

        estimate.value.tasks = estimate.value.tasks.filter((task) => !jobTaskIds.includes(<number>task.id));
    }

    estimate.value.tasks = [
        { id: 1, scope: JobScope.Installation, name: "Dig Footing", price: 1000, blockWidth: 8, backPoints: 2, footingDepthFt: 2, lengthBlocks: 10, heightCourses: 3, verticalSpacing: 2 },
        { id: 2, scope: JobScope.Installation, name: "Pour Footing", price: 2000 },
        { id: 3, scope: JobScope.Installation, name: "Lay Block", price: 3000 },
        { id: 4, scope: JobScope.Addition, name: "Grout", price: 4000, blockWidth: 6, lengthBlocks: 10, heightCourses: 3 },
        { id: 5, scope: JobScope.Addition, name: "Stucco", price: 5000 },
        { id: 6, scope: JobScope.Stone, name: "Stone wall", price: 6000 },
        { id: 7, scope: JobScope.Demo, name: "Knock down retaining", price: 7000 }
    ];
    estimate.value.tasks.forEach((task) => task.modifiedPrice = task.price);



    return { estimate, tempId, loadEstimate, resetEstimate, addJobTask, getJobTask, removeJobTask };
});




/*
interface IFormModel {
    import(model: JSON): boolean;
    export(): JSON;
    getRatioComplete(): [complete: number, total: number];
    reset(): void;
}
class FormModel<T extends object> implements IFormModel {
    public selected: Reactive<T>;
    private readonly initialState: T;

    constructor(private _initalState: T) {
        this.selected = reactive({ ..._initalState });
        this.initialState = _initalState;
    }

    import(data: JSON): boolean {
        try {
            Object.assign(this.selected, data);
        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }

    export(): JSON {
        return JSON.parse(JSON.stringify(this.selected));
    }

    getRatioComplete(): [number, number] {
        const total = Object.keys(this.selected).length;
        const complete = Object.values(this.selected).filter((value) => value !== undefined).length;
        return [complete, total];
    }

    reset() {
        Object.assign(this.selected, this.initialState);
    }
}
*/