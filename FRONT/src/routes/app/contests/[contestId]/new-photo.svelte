<script lang="ts">
	import {
		faFileSignature,
		faFileUpload,
		faUpload
	} from '@fortawesome/free-solid-svg-icons';

	import type { ForwardRequest } from '$lib/domain/blockchain';
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
		Modal
	} from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import { writable } from 'svelte/store';
	import type { FeesType } from './proxy+page';

	const dispatch = createEventDispatcher();

	const sendSignature = async (form: HTMLFormElement) => {
		const formdata = new FormData(form);
		const salePrice = formdata.get('salePrice');
		const signature = await signMessageWithWallet(messageToSign, domain);
		if (!signature) {
			showError('No se ha podido firmar el mensaje');
			return;
		}
		const data = {
			salePrice,
			photoKey: $photoKey,
      signedMessage: {
        ...messageToSign,
        signature}
			
		};
		const r = await fetchProxy(`/api/contest/${contestId}/signedphoto`, {
			method: 'POST',
			payload: data
		});
		if (r.status === 200) {
			photoKey.set('');
			const photoData = await r.json();
			dispatch('close', {});
			dispatch('created', photoData);
		}
	};

	const preparePhoto = async (form: HTMLFormElement) => {
		const formdata = new FormData(form);
		const photo = fileToUpload;
		const title = formdata.get('title');
		if (!photo) {
			showError('No se ha incluido la foto');
			return;
		}

		const data = new FormData();
		data.append('photo', photo);
		data.append('title', title as string);

		const r = await fetchProxy(`/api/contest/${contestId}/preparephoto`, {
			method: 'POST',
			body: data
		});
		if (r.status === 200) {
			const responseData = await r.json();
			messageToSign = responseData.messageToSign as ForwardRequest;
			domain = responseData.domain;
      photoKey.set(responseData.photoKey);
			buttonIcon = faFileSignature;
			buttonLabel = 'Enviar foto y firma';
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
	$: buttonIcon = faFileUpload;
	$: buttonLabel = 'Preparar foto';
	const photoKey = writable<string>('');
	let messageToSign: ForwardRequest;
	let domain: object;
	let fileToUpload: File | null = null;

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
				{#if $photoKey}
					<Img src={`/api/photo/${$photoKey}`} class="w-full h-auto" />
				{:else}
					<Label for="dropzone" class="mb-2">Foto</Label>

					<Dropzone
						id="dropzone"
						on:drop={dropHandle}
						on:dragover={(e) => {
							e.preventDefault();
						}}
						on:change={handleChange}
					>
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
				<div>
					<Label for="comission" class="mb-2">Tasa inscripción</Label>
					<Input id="comission" name="comission" value={$contestFee} readonly>
						<span slot="right" class="text-gray-500">€</span>
					</Input>
				</div>
			</div>
			<div class="flex justify-end col-span-2">
				<Button type="submit" class="w-52" outline={true}>
					<Fa icon={buttonIcon} class="w-5 h-5 mr-1" />
					{buttonLabel}
				</Button>
			</div>
		</div>
	</form>
</Modal>
