<script lang="ts">	
  	
	import { page } from "$app/stores";
	import { goto } from '$app/navigation';
	import { Button, Card } from "flowbite-svelte";
	import Fa from "svelte-fa";
	import { faImages, faPlus, faRefresh } from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import type { ContestListing } from "$lib/domain/contests";
	import { fetchProxy } from "$lib/utils/fetch-utils";
	import NewContest from "./new-contest.svelte";
	import { DateTime } from "luxon";
	import { isAdminUser } from "$lib/store/session-store";
	import { DATETIME_FULL_TS } from "$lib/utils/date-utils";

	const openModal = writable(false);
	const contests = writable<ContestListing[]>([]);
	const refresh = async () => {
		const r = await fetchProxy('/api/contest');
		if (r.status === 200) {
			contests.set(await r.json());
		}
	}
	onMount(refresh);
	const openNewContest = async () => {
		openModal.set(true);
	}
	const newContestCreated = async (data: unknown) => {	
		console.log('newContestCreated', data);
		refresh();
	}
	const closedNewContestDialog = async () => {
		console.log('closedNewContestDialog');
		$openModal = false;
	}
	const shadowCard = (status: string) => {
		switch (status) {
			case 'active':
				return 'shadow-green-100';
			case 'pending':
				return 'shadow-blue-100';
			default:
				return 'shadow-gray-100';
		}
	}
	
</script>

<div class="w-full flex items-center justify-between">
	<h1 class="text-xl font-semibold">Concursos</h1>
	<div class="flex gap-1">
		{#if $isAdminUser}
			<Button outline={true} size="xs" on:click={openNewContest} class="button-secondary">
				<Fa icon={faPlus} class="w-5 h-5 mr-1" />
				Nuevo
			</Button> 
		{/if}
		<Button color="alternative" outline={true} size="xs" on:click={refresh}>
			<Fa icon={faRefresh} class="w-5 h-5 mr-1" />
			Actualizar
		</Button>
	</div>
</div>

<div class="flex flex-row gap-2 flex-wrap mt-5">
	{#each $contests as c}
	<Card class="{shadowCard(c.status)}">				
		<a href="/app/contests/{c.id}" class="flex flex-col">
			<div class="flex flex-row gap-1 items-baseline">
				<Fa icon={faImages} size="lg" class="mr-1" />
				<span>({c.totalPhotos})</span>
				<h3 class="text-lg font-semibold tracking-tight mb-2">{c.title}</h3>
			</div>
		  
		  <p class="mb-3 font-normal">{c.description}</p>
		  <p class="text-sm text-gray-500">Inicio: {DateTime.fromISO(c.initTimestamp).toLocaleString(DATETIME_FULL_TS)}</p>
		  <p class="text-sm text-gray-500">Fin: {DateTime.fromISO(c.endTimestamp).toLocaleString(DATETIME_FULL_TS)}</p>
		</a>
	</Card>
{/each}
</div>

<NewContest openModal={$openModal} on:created={newContestCreated} on:close={closedNewContestDialog} />




