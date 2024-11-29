<!-- toast.svelte -->
<script lang="ts">
  import { cn } from "$lib/utils";
  import { fly } from "svelte/transition";
  import { toast } from "./toast.store";
  import type { ToastProps } from "./toast.types";

  export let id: string;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let action: ToastProps["action"] | undefined = undefined;
  export let variant: ToastProps["variant"] = "default";
  export let duration = 5000;
  export let className = "";

  let timer: ReturnType<typeof setTimeout>;

  $: {
    if (duration) {
      timer = setTimeout(() => {
        toast.remove(id);
      }, duration);
    }
  }

  function handleClose() {
    clearTimeout(timer);
    toast.remove(id);
  }
</script>

<div
  class={cn(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
    variant === "default" && "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700",
    variant === "destructive" &&
      "destructive group border-red-500 bg-red-500 text-white dark:border-red-900 dark:bg-red-900",
    className
  )}
  transition:fly={{ x: 300, duration: 300 }}
>
  <div class="grid gap-1">
    {#if title}
      <div class="text-sm font-semibold">
        <slot name="title">{title}</slot>
      </div>
    {/if}
    {#if description}
      <div class="text-sm opacity-90">
        <slot name="description">{description}</slot>
      </div>
    {/if}
  </div>
  {#if action}
    <button
      on:click={action.onClick}
      class={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-gray-100/40 group-[.destructive]:hover:border-red-800/30 group-[.destructive]:hover:bg-red-800 group-[.destructive]:hover:text-gray-50 group-[.destructive]:focus:ring-red-300",
        "dark:ring-offset-gray-950 dark:focus:ring-gray-800 dark:group-[.destructive]:border-gray-800/40 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-gray-50 dark:group-[.destructive]:focus:ring-red-900"
      )}
    >
      {action.label}
    </button>
  {/if}
  <button
    on:click={handleClose}
    class={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      "dark:text-gray-400 dark:hover:text-gray-50",
      variant === "destructive" && "text-red-300 hover:text-red-50"
    )}
  >
    <span class="sr-only">Close</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
</div>
