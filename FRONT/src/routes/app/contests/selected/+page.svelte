<script lang="ts">
	import {
		getStatusColor,
		getStatusName,
		type ContestDetail,
		type ContestPhoto,
		type FeesType
	} from '$lib/domain/contests';
	import { currentContestId } from '$lib/store/contest-store';
	import { isAdminUser } from '$lib/store/session-store';
	import MyCard from '$lib/ui/my-card.svelte';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import { DATETIME_FULL_TS } from '$lib/utils/format-utils';
	import { faCirclePlay, faEdit, faStar } from '@fortawesome/free-regular-svg-icons';
	import { faCircle, faCoins, faPlus, faTrophy, faUpload } from '@fortawesome/free-solid-svg-icons';
	import { Button, Img, Tooltip } from 'flowbite-svelte';
	import { DateTime } from 'luxon';
	import Fa from 'svelte-fa';
	import FormContest from '../form-contest.svelte';
	import NewPhoto from './new-photo.svelte';
	import VotePhoto from './vote-photo.svelte';

	export let data: { contestData: ContestDetail; fees: FeesType };

	$: contestId = $currentContestId;
	$: contestData = data.contestData as ContestDetail;
	$: winnerPhoto =
		contestData.status === 'finished' ? contestData.photos?.find((p) => p.winner) : undefined;
	$: photos = contestData.photos || [];
	$: openModalPhoto = false;
	$: openModalVote = false;
	$: openModalContest = false;
	$: photoToBeVoted = undefined as ContestPhoto | undefined;
	$: clickedButton = undefined as HTMLButtonElement | undefined;

	const contestUpdated = async (evt: CustomEvent<ContestDetail>) => {
		contestData = { ...contestData, ...evt.detail };
	};
	const addPhoto = async () => {
		openModalPhoto = true;
	};
	const initContest = async () => {
		const r = await fetchProxy(`/api/contest/${contestId}/init`, { method: 'POST' });
		if (r.status === 200) {
			contestData = { ...contestData, ...(await r.json()) };
		}
	};

	const photoCreated = async (photoData: CustomEvent<ContestPhoto>) => {
		contestData = { ...contestData, photos: [...contestData.photos, photoData.detail] };
		closedPhotoDialog();
	};
	const closedPhotoDialog = async () => {
		openModalPhoto = false;
	};
	const closedContestDialog = async () => {
		openModalContest = false;
	};
	const photoVoted = async (event: CustomEvent<{ contestPhotoId: number; votes: number }>) => {
		const { contestPhotoId, votes } = event.detail;
		const photo = photos.find((p) => p.contestPhotoId === contestPhotoId);
		if (photo) {
			photo.ownVotes = (photo.ownVotes || 0) + votes;
			photoToBeVoted = undefined;
			clickedButton = undefined;
			photos = [...photos];
		}
	};
	const openVotePhotoDialog = async (photo: ContestPhoto, button: EventTarget | null) => {
		photoToBeVoted = photo;
		openModalVote = true;
		clickedButton = button as HTMLButtonElement;
	};
	const modifyContest = async () => {
		openModalContest = true;
	};
</script>

	<div class="flex flex-col gap-2 shadow-md rounded-sm p-2 bg-surface-200">
		<div class="flex flex-row gap-2 justify-between">
			<h1 class="text-xl font-semibold">Concurso: {contestData.title}</h1>
			<div class="flex flex-row gap-2 justify-end">
				{#if $isAdminUser && contestData.status === 'pending'}
					<Button outline={true} size="xs" on:click={initContest} color="primary">
						<Fa icon={faCirclePlay} class="w-5 h-5 mr-1" />
						Iniciar ahora
					</Button>
					<Button outline={true} size="xs" on:click={modifyContest} color="primary">
						<Fa icon={faEdit} class="w-5 h-5 mr-1" />
						Modificar
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
		<div class="flex flex-row gap-2 justify-between">
			{#if winnerPhoto}
		<Img src="/api/photo/{winnerPhoto.photoKey}" imgClass="max-h-56 w-auto" />
		<Tooltip>Foto ganadora</Tooltip>
	{/if}
	
	<div class="flex flex-col gap-2 grow">
		<pre class="text-xs font-sans">{contestData.description}</pre>
		{#if winnerPhoto}
		<div class="text-lg text-gray-900 flex flex-row gap-2 items-center font-semibold"><Fa icon={faTrophy} size="lg" class="mr-1 " color="orange" />
			 <span>{winnerPhoto?.title}</span></div>
			<span class="text-md flex gap-1">Premio:
			<Fa icon={faCoins} class="w-5 h-5 mt-1" color="green" />
			<strong class="">{contestData.totalPrize?.toFixed(2) || 0} €</strong></span
		>			
		{/if}
		<span class="text-sm flex"
			>Estado:
			<Fa icon={faCircle} class="w-5 h-5 mt-1 text-{getStatusColor(contestData.status)}-600" />
			<strong class="">{getStatusName(contestData.status)}</strong></span
		>
		<span class="text-sm flex gap-1">Total de fotos:			
			<strong>{contestData.photos?.length || 0}</strong></span
		>
		<span class="text-sm"
			>Fecha de inicio: <strong
				>{DateTime.fromISO(contestData.initTimestamp).toLocaleString(DATETIME_FULL_TS)}</strong
			></span
		>
		<span class="text-sm"
			>Fecha de fin: <strong
				>{DateTime.fromISO(contestData.endTimestamp).toLocaleString(DATETIME_FULL_TS)}</strong
			></span
		>
	</div>
</div>
</div>
<div class="flex flex-row gap-2 flex-wrap photos mt-3">
	{#each photos as photo}
	{#if !photo.winner}
		<MyCard imgSrc="/api/photo/{photo.photoKey}" badgeContent={photo.ownVotes ?? null}>
			<h5 class="mb-2 text-lg font-semibold tracking-tight">{photo.title}</h5>
			{#if photo.price}
				<p class="text-sm">Precio de venta: <strong>{photo.price} €</strong></p>
			{:else}
				<p class="text-sm">&nbsp;</p>
			{/if}

			{#if contestData.status !== 'finished'}
				<div class="flex justify-end mt-2">
					<Button color="light" size="xs" on:click={(e) => openVotePhotoDialog(photo, e.target)}>
						<Fa icon={faStar} class="w-5 h-5 mr-1" /> Vota
					</Button>
				</div>
			{/if}
		</MyCard>
		{/if}
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
<NewPhoto
	{contestId}
	fees={data.fees}
	openModal={openModalPhoto}
	on:created={photoCreated}
	on:close={closedPhotoDialog}
/>

<VotePhoto
	{contestId}
	selectedPhoto={photoToBeVoted}
	openModal={openModalVote}
	on:voted={photoVoted}
	on:close={() => (openModalVote = false)}
/>

<FormContest
	{contestData}
	openModal={openModalContest}
	on:updated={contestUpdated}
	on:close={closedContestDialog}
/>

<style>
	div.photos > div {
		background-color: blueviolet;
		max-width: 300px;
		height: 300px;
	}
</style>
