import type { Ref } from "vue";

export function useBaseRepository<T>() {

    async function get(endpoint: string, params: object = {}) {
        const { data, error } = await useFetch(`${ endpoint }`, {
            params,
            method: "GET"
        });

        if (error.value) {
            throw new Error(error.value.message);
        }

        return { data: data as Ref<T>, error };
    }

    async function post(endpoint: string, body: object = {}) {
        const { data, error } = await useFetch(`${ endpoint }`, {
            body,
            method: "POST"
        });

        if (error.value) {
            throw new Error(error.value.message);
        }

        return { data: data as Ref<T>, error };
    }

    async function put(endpoint: string, body: object = {}) {
        const { data, error } = await useFetch(`${ endpoint }`, {
            body,
            method: "PUT"
        });

        if (error.value) {
            throw new Error(error.value.message);
        }

        return { data: data as Ref<T>, error };
    }

    async function remove(endpoint: string) {
        const { data, error } = await useFetch(`${ endpoint }`, {
            method: "DELETE"
        });

        if (error.value) {
            throw new Error(error.value.message);
        }

        return { data: data as Ref<T>, error };
    }

    return { get, post, put, remove };
}