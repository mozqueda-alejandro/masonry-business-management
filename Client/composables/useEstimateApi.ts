export function useEstimateApi() {

    const estimateRepository = useBaseRepository<Estimate>();
    const taskRepository = useBaseRepository<JobTask>();

    function createEstimate() {
        // ...
    }

    async function getEstimate(estimateId: number) {
        return await estimateRepository.get(`estimates/${ estimateId }`);
    }

    async function updateEstimate(estimate: Estimate) {
        return await estimateRepository.put(`estimates/${ estimate.id }`, estimate);
    }

    async function addJobTask(estimateId: number, task: JobTask) {
        const { data, error } = await useApi<JobTask>(
            "",
            { method: "POST", body: { estimateId, task } }
        );
        return { data, error };
    }

    async function editJobTask(task: JobTask) {
        return await taskRepository.put(`jobTasks/${ task.id }`, task);
    }

    async function removeJobTask(taskId: number) {
        return await taskRepository.remove(`jobTasks/${ taskId }`);
    }

    return { createEstimate, getEstimate, updateEstimate, addJobTask, editJobTask, removeJobTask };
}