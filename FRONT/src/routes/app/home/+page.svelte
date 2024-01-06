<svelte:head>
	<title>Vote4Photo - dApp</title>	
</svelte:head>

<script lang="ts">
	import { executedOperations, pendingOperations, rejectedOperations } from '$lib/store/operations-store';
	import { wallet, walletAccount } from '$lib/store/wallet-store';
	
	import { connectWallet, existsWallet, getWalletAccount } from '$lib/utils/wallet-utils';
	import { writable } from 'svelte/store';
	import ListPastOperations from '../operations/list-past-operations.svelte';
	import ListPendingOperations from '../operations/list-pending-operations.svelte';
	import { Button, TabItem, Tabs } from 'flowbite-svelte';

</script>

<Tabs style="underline" contentClass="bg-none p-4">
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			Operaciones pendientes
		  </div>
		{#if $pendingOperations.length === 0}
	<div class="w-full flex flex-col my-10 items-center gap-5">
		<h3 class="font-semibold text-lg text-center">No tienes operaciones pendientes, puedes visitar los concursos actuales para votar por tus fotos favoritas</h3>
		<Button outline  size="xl" href="/app/contests" color="primary" >Ir a Concursos</Button>
	</div>
	{:else}
	<ListPendingOperations />
	{/if}
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			Ejecutadas
		  </div>
		<ListPastOperations executedOperations={$executedOperations} />
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			Rechazadas
		  </div>
		<ListPastOperations rejectedOperations={$rejectedOperations} />
	</TabItem>
</Tabs>

