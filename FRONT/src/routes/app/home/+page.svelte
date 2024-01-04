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
	import { Button } from 'flowbite-svelte';

	let withWallet = writable(existsWallet());
	
	
	const accessWallet = async () => {
		console.log('Connecting to window.ethereum:', (window as any).ethereum);
		wallet.set(connectWallet());
		const account = await getWalletAccount($wallet);
		walletAccount.set(account);
	}
</script>

<div>
	{#if $pendingOperations.length === 0}
	<div class="w-full flex flex-col my-10 items-center gap-5">
		<h3 class="font-semibold text-lg text-center">No tienes operaciones pendientes, puedes visitar los concursos actuales para votar por tus fotos favoritas</h3>
		<Button outline  size="xl" href="/app/contests" color="primary" >Ir a Concursos</Button>
	</div>
	{:else}
	<ListPendingOperations />
	{/if}
	<ListPastOperations executedOperations={$executedOperations} rejectedOperations={$rejectedOperations} />

</div>
