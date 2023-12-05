<script lang="ts">	
  	
	import { page } from "$app/stores";
	import { fetchProxy } from "$lib/utils/fetch-utils";
	import { getStatusName, type ContestDetail, getStatusColor } from "$lib/domain/contests";
	import { onMount } from "svelte";
	import { Button, Card } from "flowbite-svelte";
	import Fa from "svelte-fa";
	import { faCirclePlay, faImages, faPlusSquare, faStar } from "@fortawesome/free-regular-svg-icons";
	import { faCircle, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
	import MyCard from "$lib/ui/my-card.svelte";
	import { DATETIME_FULL_TS } from "$lib/utils/date-utils";
	import { DateTime } from "luxon";
	import { isAdminUser } from "$lib/store/session-store";
	import type { PageData } from "./$types";
	import NewPhoto from "./new-photo.svelte";

	export let data: PageData;

	$: contestId = parseInt($page.url.pathname.split('/').pop()!);
	$: contestData = data.contestData as ContestDetail;
	$: photos = contestData.photos || [];
	$: openModalPhoto = false;


	const addPhoto = async () => {
		openModalPhoto = true;

	}
	const initContest = async () => {
		const r = await fetchProxy(`/api/contest/${contestId}/init`, { method: 'POST' });
		if (r.status === 200) {
			contestData = {...contestData, ...(await r.json())};
		}
	}
	const photoCreated = async () => {
	
		closedPhotoDialog();
	}
	const closedPhotoDialog = async () => {
		openModalPhoto = false;
	}

</script>

<div class="flex flex-col gap-2  shadow-md rounded-sm p-2 bg-surface-200">
	<div class="flex flex-row gap-2 justify-between">
		<h1 class="text-xl font-semibold">Concurso: {contestData.title}</h1>
		<div class="flex flex-row gap-2 justify-end">
			
				{#if $isAdminUser && contestData.status === 'pending'}
					<Button outline={true} size="xs" on:click={initContest} color="primary">
						<Fa icon={faCirclePlay} class="w-5 h-5 mr-1" />
						Iniciar ahora
					</Button> 
				{/if}
				{#if contestData.status !== 'finished'}
				<Button outline={true} size="xs" on:click={addPhoto} class="button-secondary">
					<Fa icon={faPlus} class="w-5 h-5 mr-1" />
					Nueva foto
				</Button> 
			{/if}
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<pre class="text-xs font-sans">{contestData.description}</pre>
		<span class="text-sm flex">Estado: 
			<Fa icon={faCircle} class="w-5 h-5 mt-1 text-{getStatusColor(contestData.status)}-600" />
			<strong class="">{getStatusName(contestData.status)}</strong></span>
		<span class="text-sm">Fecha de inicio: <strong>{DateTime.fromISO(contestData.initTimestamp).toLocaleString(DATETIME_FULL_TS)}</strong></span>
		<span class="text-sm">Fecha de fin: <strong>{DateTime.fromISO(contestData.endTimestamp).toLocaleString(DATETIME_FULL_TS)}</strong></span>
	</div>
</div>
<div class="flex flex-row gap-2 flex-wrap photos mt-3">
	{#each photos as photo}
	<MyCard imgSrc="/api/photo/{photo.photoKey}" >
			<h5 class="mb-2 text-lg font-semibold tracking-tight">{photo.title}</h5>
			{#if photo.price}
				<p class="text-sm">Precio de venta: <strong>{photo.price} €</strong></p>
				{:else}
				<p class="text-sm">&nbsp;</p>
			{/if}
			
			<div class="flex justify-end mt-2">
				<Button color="light" size="xs">
					<Fa icon={faStar} class="w-5 h-5 mr-1" /> Vota
				</Button>
			</div>
	</MyCard>
{/each}
</div>
{#if photos.length === 0}
	<div class="flex flex-col items-center w-full h-full">	
		<span class="text-gray-400 mb-3 mt-10">No hay fotos en este concurso, añade la primera</span>
		<Button type="button" color="light" class="button-secondary" on:click={addPhoto}> 
			<Fa icon={faUpload} class="text-xl mr-2" />    
			Subir foto
		</Button>
	</div>
{/if}
<NewPhoto {contestId} openModal={openModalPhoto} on:created={photoCreated} on:close={closedPhotoDialog} />


<style>
	div.photos > div {
		background-color: blueviolet;
		max-width: 300px;
		height: 300px;
	}

</style>