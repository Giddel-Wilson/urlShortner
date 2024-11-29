<!-- toast-description.svelte -->
<script lang="ts">
  import { cn } from "$lib/utils";
  export let className = "";
</script>

<div class={cn("text-sm opacity-90", className)}>
  <slot />
</div>
