<script lang="ts">
	import type { AccountData } from '$lib/domain/account';
	import type { ContestPhoto } from '$lib/domain/contests';
	import { userId } from '$lib/store/session-store';
	import { showError } from '$lib/ui/error-manager';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import {
		faArrowsDownToLine,
		faPlus,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import {
		Badge,
		Button,
		Checkbox,
		Helper,
		Img,
		Label,
		Modal,
		NumberInput,
		Spinner
	} from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { writable } from 'svelte/store';

	const dispatch = createEventDispatcher();

	const profile = writable<AccountData>();
	const refresh = async () => {
		const r = await fetchProxy(`/api/account/${$userId}`);
		if (r.status === 200) {
			console.log('Refresh contest data...');
			profile.set(await r.json());
		}
	};
	onMount(refresh);
	export let openModal: boolean = false;
	export let contestId: number | null;
	export let selectedPhoto: ContestPhoto | undefined;
	let votes = 1;
	let wantBuy = false;
	$: voting = false;
	$: isPhotoOwner = $profile?.photos?.some((p) => p.photoKey === selectedPhoto?.photoKey);
	$: enoughVotes = $profile?.remainingVotes > votes;
	$: photoUrl = `/api/photo/${selectedPhoto?.photoKey}`;
	$: contestPhotoId = selectedPhoto?.contestPhotoId;

	const vote4Photo = async () => {
		if (voting) return;
		if (votes <= 0) {
			showError('Debe ingresar una cantidad de votos válida');
			return;
		}
		if (votes > $profile?.remainingVotes) {
			showError('No tienes suficientes votos para realizar esta acción');
			return;
		}
		voting = true;
		const r = await fetchProxy(`/api/contest/${contestId}/vote`, {
			method: 'POST',
			payload: {
				contestPhotoId,
				wantBuy,
				votes
			}
		});
		if (r.status === 200) {
			const data = await r.json();
			dispatch('voted', {
				contestPhotoId: data.contestPhotoId,
				votes: data.votes
			});
			$profile.remainingVotes = data.remainingVotes;
			openModal = false;
		}
		voting = false;
	};
	const onClose = () => {
		openModal = false;
		dispatch('close');
	};
</script>

<Modal
	title="Votar por foto"
	bind:open={openModal}
	class="w-96"
	dismissable
	placement="bottom-center"
	on:close={onClose}
>
	<div class="flex flex-col gap-2">
		<Img class="h-56 w-auto rounded m-auto" src={photoUrl} />
		<div class="flex flex-row items-baseline gap-2 w-52 self-center">
			<Label for="votes" class="mb-2 w-full text-right">Votos:</Label>
			<NumberInput bind:value={votes} id="votes" required class="w-full" min="1" />
			<Button
				type="button"
				outline
				color="light"
				size="xs"
				on:click={() => {
					votes += 5;
				}}
			>
				<Fa icon={faPlus} size="md" /><span class="text-md">5</span>
			</Button>
			<Button
				type="button"
				outline
				color="light"
				size="xs"
				on:click={() => {
					votes = 1;
				}}
			>
				<Fa icon={faArrowsDownToLine} size="md" />
				<div class="h-4" />
			</Button>
		</div>
		{#if !isPhotoOwner}
			<div class="sm:col-span-2">
				<Checkbox bind:checked={wantBuy} color="primary" aria-describedby="helper-wantbuy">
					Deseo comprar la foto
				</Checkbox>
				<Helper id="helper-wantbuy" class="ps-6">
					Se sortea entre los votantes interesados el derecho a compra
				</Helper>
			</div>
		{/if}
		<Helper class="text-sm self-center">
			Votos disponibles: <Badge color="primary" class="text-sm">{$profile?.remainingVotes}</Badge>
		</Helper>
		<div class="flex justify-center col-span-2 mt-2">
			<Button type="button" on:click={vote4Photo} disabled={!enoughVotes}>
				{#if voting}
					<Spinner class="me-3" size="4" color="white" />
					Votación en curso...
				{:else}
					<Fa icon={faStar} class="text-md mr-1" />
					Votar
				{/if}
			</Button>
		</div>
	</div>
</Modal>
