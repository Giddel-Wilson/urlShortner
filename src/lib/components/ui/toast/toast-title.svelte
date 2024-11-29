<!-- toast-title.svelte -->
<script lang="ts">
  import { cn } from "$lib/utils";
  export let className = "";
</script>

<div class={cn("text-sm font-semibold", className)}>
  <slot />
</div>
