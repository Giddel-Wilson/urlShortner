<!-- toast-viewport.svelte -->
<script lang="ts">
  import { cn } from "$lib/utils";
  import { toast } from "./toast.store";
  import Toast from "./toast.svelte";
  import type { ToastProps } from "./toast.types";

  export let className = "";

  $: validToasts = $toast.filter((t): t is Required<Pick<ToastProps, 'id'>> & ToastProps => typeof t.id === 'string');
</script>

<div
  class={cn(
    "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
    className
  )}
>
  {#each validToasts as t (t.id)}
    <Toast {...t} />
  {/each}
</div>
