<script lang="ts">
	import {
		faFileSignature,
		faFileUpload,
		faUpload
	} from '@fortawesome/free-solid-svg-icons';
	import type { Address, Hex } from "viem";

	import type { ForwardRequest, SignedForwardRequest } from '$lib/domain/blockchain';
	import { showError } from '$lib/ui/error-manager';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import { signMessageWithWallet } from '$lib/utils/wallet-utils';
	import { faImage } from '@fortawesome/free-regular-svg-icons';
	import {
		Button,
		Dropzone,
		Img,
		Input,
		Label,
		Modal,

		Select

	} from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import { writable } from 'svelte/store';
	import type { FeesType } from './proxy+page';
	import { currentAccount, userId } from '$lib/store/session-store';
	import type { UserPhotoData } from '$lib/domain/account';
	import { ensureWallet, walletAccount } from '$lib/store/wallet-store';

	const dispatch = createEventDispatcher();

	const loadUserPhotos = async () => {
		
		const r = await fetchProxy(`/api/account/${$userId}`);
		if (r.status === 200) {
			const accountData = await r.json();	
			userFunds = accountData.funds;
			const photos = accountData.photos as UserPhotoData[];
			availableUserPhotos = photos.filter((p) => !p.currentContestId && p.account.toLowerCase() === $currentAccount);
		}
	};

	const _prepareForUpload = () => {
		photoKey.set('');
		buttonIcon = faFileUpload;
		buttonLabel = 'Preparar foto';
		contestFee = fees?.CONTEST_NEW_PHOTO;
		existingPhoto = null;
		titleProps = {}
	};

	const _prepareForSendSignedPhoto = (pkey: string, bLabel = 'Enviar foto y firma') => {
		photoKey.set(pkey);		
		buttonIcon = faFileSignature;
		buttonLabel = bLabel;
	};

	const photoSelected = (e: Event) => {
		const photoId = parseInt((e.target as HTMLSelectElement).value);
		if (!photoId) {
			_prepareForUpload();			
		} else {
			const photo = availableUserPhotos.find((p) => p.id === photoId);
			if (photo) {
				contestFee = fees?.CONTEST;
				existingPhoto = photo;				
				titleProps = {value:  photo.title, readonly: true}
				_prepareForSendSignedPhoto(photo.photoKey, 'Enviar foto');
			} else {
				_prepareForUpload();
			}
		}
	};

	const sendSignature = async (form: HTMLFormElement) => {
		const formdata = new FormData(form);
		const salePrice = Number(formdata.get('salePrice'));
		const data : {salePrice: number, photoKey: string, signedMessage?: SignedForwardRequest} = {
			salePrice,
			photoKey: $photoKey,
		}
		if (!existingPhoto) {
			const signature = await signMessageWithWallet(messageToSign, domain);
			if (!signature) {
				showError('No se ha podido firmar el mensaje');
				return;
			}
			data.signedMessage = {...messageToSign, signature};
		}
		
		const r = await fetchProxy(`/api/contest/${contestId}/addphoto`, {
			method: 'POST',
			payload: data
		});
		if (r.status === 200) {
			photoKey.set('');
			const photoData = await r.json();
			dispatch('close', {});
			dispatch('created', photoData);
			loadUserPhotos();
		}
	};

	const preparePhoto = async (form: HTMLFormElement) => {
		const data = new FormData();
		const formdata = new FormData(form);
		const title = formdata.get('title');
		if (!existingPhoto) {
			const photo = fileToUpload;		
			if (!photo) {
				showError('No se ha incluido la foto');
				return;
			}
			data.append('photo', photo);
		}

		data.append('title', title as string);
		const url = existingPhoto ? `/api/photo/prepare/${existingPhoto.id}` : '/api/photo/prepare';
		const r = await fetchProxy(url, {
			method: 'POST',
			body: data
		});
		if (r.status === 200) {
			const responseData = await r.json();
			messageToSign = responseData.messageToSign as ForwardRequest;
			domain = responseData.domain;
      		_prepareForSendSignedPhoto(responseData.photoKey);
			setTimeout(() => {
				const salePriceInput = document.getElementById('salePrice') as HTMLInputElement;
				salePriceInput?.focus();
			}, 50);
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		if (!$photoKey) {
			await preparePhoto(form);
		} else {
			await sendSignature(form);
		}
	};

	const onClose = async () => {
		if ($photoKey) {
			await fetchProxy(`/api/photo/${$photoKey}`, {
				method: 'DELETE'
			});
		}

		dispatch('close', {});
	};

	export let openModal = false;
	export let contestId: number | null = null;
	export let fees: FeesType;
	$: existingPhoto = null as (UserPhotoData | null);
	$: contestFee = fees?.CONTEST_NEW_PHOTO || 0;
	$: buttonIcon = faFileUpload;
	$: buttonLabel = 'Preparar foto';
	
	const photoKey = writable<string>('');
	let messageToSign: ForwardRequest;
	let domain: object;
	let fileToUpload: File | null = null;
	let availableUserPhotos : UserPhotoData[] = [];
	let userFunds = 0;
	let titleProps = {};
	loadUserPhotos();
	const dropHandle = (e: DragEvent) => {
		e.preventDefault();
		const files = e.dataTransfer?.files;
		if (files?.length) {
			fileToUpload = files[0];
		}
	};

	const handleChange = (e: Event) => {
		e.preventDefault();
		const files = (e.target as HTMLInputElement)?.files;
		if (files?.length) {
			fileToUpload = files[0];
		}
	};
</script>

<Modal title="Subir foto" bind:open={openModal} class="min-w-full" on:close={onClose}>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="grid gap-4 mb-4 grid-cols-1 sm:grid-cols-2">
			<div>
				{#if availableUserPhotos.length > 0}
				<Select id="" name="userPhoto" on:change={photoSelected} class="mb-2" placeholder="">
					<option value="0" selected>Nueva foto</option>
					{#each availableUserPhotos as photo}
						<option value={photo.id}>{photo.title}</option>
					{/each}
				</Select>
				{/if}						
					<Label for="dropzone" class="mb-2">Foto</Label>
					{#if $photoKey}
						<Img src={`/api/photo/${$photoKey}`} class="w-full h-auto" />
					{:else}
					<Dropzone id="dropzone"
						on:drop={dropHandle}
						on:dragover={(e) => {
							e.preventDefault();
						}}
						on:change={handleChange}>
						<Fa icon={faUpload} class="text-3xl text-gray-400 mb-2" />
						<p class="mb-2 text-sm text-gray-500">
							<span class="font-semibold"> Pincha para subir una foto</span> o haz drag&drop
						</p>
						<p class="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
						{#if fileToUpload}
							<div class="border-t-2 h-1 w-full mt-2" />
							<p class="mb-2 text-sm text-gray-600 font-semibold">{fileToUpload.name}</p>
						{/if}
					</Dropzone>
					{/if}
				
			</div>
			<div class="flex flex-col gap-2">
				<div>
					<Label for="title" class="mb-2">Título</Label>
					<Input
						type="text"
						id="title"
						name="title"
						placeholder="Título"
						{...titleProps}
						required
						disabled={!!$photoKey}
					/>
				</div>
				<div>
					<Label for="salePrice" class="mb-2">Precio de venta</Label>
					<Input type="number" id="salePrice" name="salePrice" disabled={!$photoKey}>
						<span slot="right" class="text-gray-500">€</span>
					</Input>
				</div>
				<div class="flex flex-row gap-2">
				 	<div>
						<Label for="funds" class="mb-2">Fondos</Label>
						<Input id="funds" name="funds" value={userFunds} readonly disabled>
							<span slot="right" class="text-gray-500">€</span>
						</Input>
					</div>
					<div>
						<Label for="fee" class="mb-2">Tasa inscripción</Label>
						<Input id="fee" name="fee" value={contestFee} readonly color={userFunds < contestFee ? 'red' : undefined}>
							<span slot="right" class="text-gray-500">€</span>
						</Input>
					</div>
				</div>
			</div>
			<div class="flex justify-end col-span-2">
				<Button type="submit" class="w-52" outline={true} disabled={userFunds < contestFee}>
					<Fa icon={buttonIcon} class="w-5 h-5 mr-1" />
					{buttonLabel}
				</Button>
			</div>
		</div>
	</form>
</Modal>
