<script lang="ts">	
  	
	import type { ContestListing } from "$lib/domain/contests";
	import { isAdminUser } from "$lib/store/session-store";
	import { fetchProxy } from "$lib/utils/fetch-utils";
	import { DATETIME_FULL_TS } from "$lib/utils/format-utils";
	import { faImages, faPlus, faRefresh } from "@fortawesome/free-solid-svg-icons";
	import { Badge, Button, Card } from "flowbite-svelte";
	import { DateTime } from "luxon";
	import { onMount } from "svelte";
	import Fa from "svelte-fa";
	import { writable } from "svelte/store";
	import FormContest from "./form-contest.svelte";
	import { currentContest } from "$lib/store/contest-store";
	import { goto } from "$app/navigation";

	const openModal = writable(false);
	const contests = writable<ContestListing[]>([]);
	const refresh = async () => {
		const r = await fetchProxy('/api/contest');
		if (r.status === 200) {
			console.log('Refresh contest data...' );
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
	const colorByStatus = (status: string) => {
		switch (status) {
			case 'active':
				return 'green';
			case 'pending':
				return 'blue';
			default:
				return 'gray';
		}
	}

	const shadowCard = (status: string) => {
		return `shadow-${colorByStatus(status)}-100`;
	}

	const goToDetail = (idContest: number) => {
		currentContest.set(idContest);
		goto(`/app/contests/selected`);
		//page.set(`/app/contests/${id}`);
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
	{#each $contests as c, i}
	<Card class="{shadowCard(c.status)}">				
		<div role="link" tabindex={i} on:click={() => goToDetail(c.id)} on:keypress={null} class="flex flex-col cursor-pointer">
			<div class="flex flex-row gap-2 items-center">
				<Fa icon={faImages} size="lg" class="mr-1 " color={colorByStatus(c.status)} />				
				<h3 class="text-lg font-semibold tracking-tight">{c.title}</h3>
				{#if c.totalPhotos}
				<Badge rounded class="text-white bg-surface-900 text-xs font-bold">{c.totalPhotos}</Badge>
				  {/if}		
			</div>
		  
		  <p class="mb-3 font-normal">{c.description}</p>
		  <p class="text-sm text-gray-500">Inicio: {DateTime.fromISO(c.initTimestamp).toLocaleString(DATETIME_FULL_TS)}</p>
		  <p class="text-sm text-gray-500">Fin: {DateTime.fromISO(c.endTimestamp).toLocaleString(DATETIME_FULL_TS)}</p>
		</div>
	</Card>
{/each}
</div>

<FormContest openModal={$openModal} on:created={newContestCreated} on:close={closedNewContestDialog} />







