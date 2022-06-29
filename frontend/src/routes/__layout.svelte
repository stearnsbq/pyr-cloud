<script lang="ts">
  import "carbon-components-svelte/css/g80.css";
  import { goto } from "$app/navigation";
  import { isLoggedIn } from "../services/auth.svelte";
  import { browser } from "$app/env";
import { onMount } from "svelte";
  

  onMount(async () => {
    if (browser && isLoggedIn()) {
      await goto("/console/dashboard");
    }
  })




</script>


<slot></slot>