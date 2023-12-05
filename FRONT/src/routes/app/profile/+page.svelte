<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import Fa from 'svelte-fa';
	import { faMoneyBill, faSave } from '@fortawesome/free-solid-svg-icons';
	import type { AccountData } from '$lib/domain/account';
	import type { PageData } from './$types';
	import { showError } from '$lib/ui/error-manager';
	import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
	import MyCard from '$lib/ui/my-card.svelte';
	import { DateTime } from 'luxon';
	import { DATETIME_FULL_TS } from '$lib/utils/date-utils';

	export let data: PageData;
	$: profile = data.profile as AccountData;
	$: {
		if (profile) {
			console.log('LLEGA el PROFILE', profile);
			console.log('profileForm??', profileForm);
			const formData = new FormData(profileForm);
			console.log('formData', formData);
			formData.set('fullName', profile.fullName);
			formData.set('email', profile.email);
			formData.set('role', profile.role);
			formData.set('funds', profile.funds+'');
			formData.set('remainingVotes', profile.remainingVotes+'');

			// profileForm.fullName.value = profile.fullName;
			// profileForm.email.value = profile.email;
			// profileForm.role.value = profile.role;
			// profileForm.funds.value = profile.funds;
			// profileForm.remainingVotes.value = ''+profile.remainingVotes;
		}
	}


	let profileForm : HTMLFormElement;
	const load = () => {
		console.log('profileForm:', profileForm);
		console.log('profile:', profile);
	};
	load();

	const saveProfile = async (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const data = {} as Record<string, unknown>;
		if (profile.fullName !== formData.get('fullName')) {
			data.fullName = formData.get('fullName');
		}
		if (formData.get('password')) {
			if (formData.get('password') !== formData.get('password2')) {
				showError('Las contraseñas no coinciden');
				return;
			}
			data.password = formData.get('password');
		}
		if (Object.keys(data).length === 0) {
			showError('No hay cambios que guardar');
			return;
		}
		console.log('saveProfile', data);
		const r = await fetchProxy('/api/profile', {
			method: 'POST',
			payload: data
		});
		if (r.status === 200) {
		}
	};
</script>

<div class="flex flex-row gap-2 justify-between mb-3">
	<h1 class="text-xl font-semibold">Información de la cuenta</h1>
	<div class="flex flex-row gap-2 justify-end">
		<!-- <Button outline={true} size="xs" on:click={initContest} color="primary">
					<Fa icon={faCirclePlay} class="w-5 h-5 mr-1" />
					Iniciar ahora
				</Button> 
			<Button outline={true} size="xs" on:click={addPhoto} class="button-secondary">
				<Fa icon={faPlus} class="w-5 h-5 mr-1" />
				Nueva foto
			</Button>  -->
	</div>
</div>

<form bind:this={profileForm} on:submit|preventDefault={saveProfile}>
	<div class="grid gap-4 mb-4 grid-cols-2 max-w-screen-sm">
		<div class="col-span-2">
			<Label for="fullName" class="mb-2">Nombre completo</Label>
			<Input type="text" id="fullName" name="fullName" placeholder="John Smith" required value={profile.fullName} />
		</div>
		<div>
			<Label for="password" class="mb-2">Password</Label>
			<Input type="password" id="password" name="password" />
		</div>
		<div>
			<Label for="password2" class="mb-2">Confirma password</Label>
			<Input type="password" id="password2" name="password2" />
		</div>
		<div>
			<Label for="email" class="mb-2">Email</Label>
			<Input type="email" id="email" name="email" readonly value={profile.email}/>
		</div>
		<div>
			<Label for="role" class="mb-2">Rol</Label>
			<Input id="role" name="role" readonly value={profile.role}/>
		</div>
		<div class="flex flex-row gap-2 items-end">
			<div>
				<Label for="funds" class="mb-2">Fondos</Label>
				<Input type="number" id="funds" name="funds" readonly value={profile.funds}>
					<span slot="right" class="text-gray-500 text-lg">€</span>
				</Input>
			</div>
			<Button type="button"  outline color="light" size="xs">
				<Fa icon={faMoneyBill} size="lg" />
			</Button>
		</div>
		<div class="flex flex-row gap-2 items-end">
			<div>
				<Label for="remainingVotes" class="mb-2">Votos disponibles</Label>
				<Input type="number" id="remainingVotes" name="remainingVotes" readonly value={profile.remainingVotes} />
			</div>
			<Button type="button" outline color="light" size="xs">
				<Fa icon={faPlusSquare}  size="lg" />
			</Button>
		</div>
		<div class="flex col-span-2">
			<Button type="submit" class="w-52" outline color="primary">
				<Fa icon={faSave} class="w-5 h-5 mr-1" />
				Guardar
			</Button>
		</div>
	</div>
</form>

<h3 class="text-lg">Fotos</h3>
<div class="flex flex-row gap-2 flex-wrap photos mt-3">
	{#each profile.photos as photo}
	<MyCard imgSrc="/api/photo/{photo.photoKey}" horizontal={true} >
			<h5 class="mb-2 text-lg tracking-tight">{photo.title}</h5>
			<ul class="text-text-400 text-sm">
				<li>Token ID: {photo.tokenId}</li>
				<li class="text-ellipsis">TX: {photo.lastTransferTx}</li>
				<li>Tamaño: {photo.size}</li>
				<li>Desde: {DateTime.fromISO(photo.ownerSince).toLocaleString(DATETIME_FULL_TS)}</li>
			</ul>
	</MyCard>
{/each}
</div>
