<!-- toast-action.svelte -->
<script lang="ts">
  import { cn } from "$lib/utils";
  export let className = "";
</script>

<button
  on:click
  class={cn(
    "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-gray-100/40 group-[.destructive]:hover:border-red-800/30 group-[.destructive]:hover:bg-red-800 group-[.destructive]:hover:text-gray-50 group-[.destructive]:focus:ring-red-300",
    "dark:ring-offset-gray-950 dark:focus:ring-gray-800 dark:group-[.destructive]:border-gray-800/40 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-gray-50 dark:group-[.destructive]:focus:ring-red-900",
    className
  )}
>
  <slot />
</button>
