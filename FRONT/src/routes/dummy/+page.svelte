<svelte:head>
	<title>Dummy page</title>	
</svelte:head>

<script lang="ts">
	import { wallet, walletAccount } from '$lib/store/wallet-store';
	import { connectWallet, existsWallet, getWalletAccount } from '$lib/utils/wallet-utils';
	import { Button } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import { createWalletClient, custom } from 'viem'
	import { mainnet } from 'viem/chains'

	let withWallet = writable(existsWallet());
	// const client = createWalletClient({
	// chain: mainnet,
	// 	transport: custom(window.ethereum)
	// });	
	const accessWallet = async () => {
		console.log('Connecting to window.ethereum:', (window as any).ethereum);
		wallet.set(connectWallet());
		const account = await getWalletAccount($wallet);
		walletAccount.set(account);
	}
</script>

<div>
	<h1 class="text-xl font-bold">Dummy page??</h1>
    {#if $withWallet}
		<Button on:click={accessWallet}>Connect wallet</Button>
    {:else}
		<h1 class="text-error-500">No tenemos wallet en el navegador!!!</h1>
    {/if}
	<ul>
		<li>Wallet: {$wallet?.name}</li>
		<li>Wallet chain: {$wallet?.chain?.name}</li>
		<li>Account: {$walletAccount}</li>
	</ul>
	

</div>
