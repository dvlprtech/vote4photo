<script lang="ts">	
  import '../../app.postcss';
  import Header from "./header.svelte";
  import Footer from "./footer.svelte";

  import { page } from "$app/stores";
  import ErrorToast from '$lib/ui/error-toast.svelte';
	import ErrorModal from '$lib/ui/error-modal.svelte';
	import { onMount } from 'svelte';
	import { firstConnect, walletAccount } from '$lib/store/wallet-store';

  onMount(async () => {
    if (!$walletAccount) {
      // Necesario si se refresca la página con F5
      await firstConnect();
    }
  });

</script>

<div class="h-screen flex flex-col">
  <Header />
  <div class="flex flex-1 flex-col overflow-y-auto py-3 px-4 bg-white dark:bg-slate-600 h-full">
    <slot />
  </div>
  <Footer />  
</div>
<ErrorModal />

