<svelte:head>
	<title>Vote4Photo - dApp</title>	
</svelte:head>

<script lang="ts">
	import { executedOperations, pendingOperations, refreshOperations, rejectedOperations } from '$lib/store/operations-store';
		
	import { Alert, Button, TabItem, Tabs } from 'flowbite-svelte';
	import ListPastOperations from '../operations/list-past-operations.svelte';
	import ListPendingOperations from '../operations/list-pending-operations.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Page } from '@sveltejs/kit';
	import type { Unsubscriber } from 'svelte/store';
	import { loadProfile, userProfile } from '$lib/store/profile-store';
	
	onMount(() => {
		refreshOperations();
		loadProfile();
	});
</script>

{#if $userProfile?.funds === 0}
<Alert color="yellow" border class="mx-10">
	<span class="font-medium">No dispones de fondos en tu cuenta!</span>
	<span>Añadelos desde tu perfil para poder participar en concursos o conseguir votos.</span>
	<a href="/app/profile" class="underline underline-offset-2 hover:font-semibold">Ir al Perfil</a>
  </Alert>
{/if}
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

