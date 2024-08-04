import { defineStore } from "pinia";
import type { Reactive } from "vue";

export const useNewEstimateStore = defineStore("newEstimate", () => {

    // type JobTaskType = InstallationType | AdditionType | RepairType | StoneType | DemoType | TemporaryFenceType;
    //
    // interface:
    //
    // const newEstimate: Reactive<InstallationType>;
    //
    // saveEstimate(estimate: Installation) {
    //
    // return {  }
});


interface IFormModel {
    import(model: JSON): boolean;
    export(): JSON;
    getRatioComplete(): [complete: number, total: number];
    reset(): void;
}




/*
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