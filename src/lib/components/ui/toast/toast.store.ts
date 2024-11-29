import { writable } from "svelte/store";
import type { ToastProps } from "./toast.types";

export type ToasterStore = ToastProps[];

function createToastStore() {
  const { subscribe, update } = writable<ToasterStore>([]);

  function add(toast: ToastProps) {
    const id = crypto.randomUUID();
    update((toasts) => [...toasts, { ...toast, id }]);
    return id;
  }

  function remove(id: string) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  return {
    subscribe,
    add,
    remove,
  };
}

export const toast = createToastStore();
