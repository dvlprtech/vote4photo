<script lang="ts">
	import type { AccountData } from '$lib/domain/account';
	import { userId } from '$lib/store/session-store';
	import { showError } from '$lib/ui/error-manager';
	import MyCard from '$lib/ui/my-card.svelte';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import { ellipsis, getReadableFileSize, localDateTime } from '$lib/utils/format-utils';
	import { faImages, faPlusSquare, faStar as faStarAlt } from '@fortawesome/free-regular-svg-icons';
	import { faMoneyBill1Wave, faMoneyBills, faSave, faStar, faUserAlt } from '@fortawesome/free-solid-svg-icons';
	import { Badge, Button, ButtonGroup, Input, Label, Modal, Select, Spinner, TabItem, Tabs } from 'flowbite-svelte';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { getTokenUrl } from '$lib/store/config-store';

	export let data: PageData;
	$: profile = data.profile as AccountData;
	$: {
		if (profile && profileForm) {
			const formData = new FormData(profileForm);
			formData.set('fullName', profile.fullName);
			formData.set('email', profile.email);
			formData.set('role', profile.role);
			formData.set('funds', profile.funds+'');
			formData.set('remainingVotes', profile.remainingVotes+'');

		}
	}
	let profileForm : HTMLFormElement;

	const saveProfile = async (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const data = {} as Record<string, unknown>;
		if (profile.fullName !== formData.get('fullName') && formData.get('fullName')) {
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
		const r = await fetchProxy(`/api/account/${$userId}`, {
			method: 'PUT',
			payload: data
		});
		if (r.status === 200) {
			// Empty on purpose
		}
	};
	$: modalFundsOpened = false;
	$: transferingFunds = false;
	let fundsToTransfer = 0;
	const transferFunds = async () => {
		if (fundsToTransfer > 0) {
			if (transferingFunds) {
				// transferencia en curso
				return;
			}
			transferingFunds = true;
			// sleep 1 secs
			await new Promise(resolve => setTimeout(resolve, 1000));
			const r = await fetchProxy(`/api/account/funds`, {
				method: 'POST',
				payload: { amount: fundsToTransfer }
			});
			if (r.status === 200) {
				const data = await r.json();
				profile.funds = data.funds;			
			}
			transferingFunds = false;
		}
		modalFundsOpened = false;
		fundsToTransfer = 0;
	};

	$: modalVotesOpened = false;
	$: buyingVotes = false;
	$: votesPrice = 0;
	let votesToBuy = 0;
	$: {
		if (votesToBuy <= 0) {
			votesPrice = 0;
		}
		const pack = data?.votesPricing.filter(p => p.amount <= votesToBuy).pop();
		votesPrice = pack && votesToBuy * (pack!.price/pack!.amount) || 0;
	};
	const buyVotes = async () => {
		if (votesToBuy > 0) {
			if (buyingVotes) {
				// transferencia en curso
				return;
			}
			if (votesPrice > profile.funds) {
				showError('No tienes suficientes fondos para adquirir los votos');
				return;
			}
			buyingVotes = true;
			// sleep 1 secs
			await new Promise(resolve => setTimeout(resolve, 1000));
			const r = await fetchProxy(`/api/account/buyvotes`, {
				method: 'POST',
				payload: { amount: votesToBuy }
			});
			if (r.status === 200) {
				const data = await r.json();
				profile.remainingVotes = data.remainingVotes;
				profile.funds = data.funds;
			}
			buyingVotes = false;
		}
		modalVotesOpened = false;
		votesToBuy = 0;
	};
	const packSelected = (e: Event) => {
		const select = e.target as HTMLSelectElement;
		votesToBuy = parseInt(select.value);
	};

</script>

<Tabs style="underline" contentClass="bg-none p-4">
	<TabItem open>
	  <div slot="title" class="flex items-center gap-2">
		<Fa icon={faUserAlt} class="text-lg" />
		Cuenta
	  </div>
	  <div class="flex flex-col">
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
					<Button type="button"  outline color="red" size="xs" on:click={() => {
						modalFundsOpened = true; 
						fundsToTransfer = 1;}}>
						<Fa icon={faMoneyBills} size="lg" />
					</Button>
				</div>
				<div class="flex flex-row gap-2 items-end">
					<div>
						<Label for="remainingVotes" class="mb-2">Votos disponibles</Label>
						<Input type="number" id="remainingVotes" name="remainingVotes" readonly value={profile.remainingVotes} />
					</div>
					<Button type="button" outline color="yellow" size="xs" on:click={() => {
						modalVotesOpened = true;
						votesToBuy = 1;}}>
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
		


	  </div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2 relative">
		  <Fa icon={faImages} class="text-lg" />
		  <span class="">Fotos</span>
		  {#if profile?.photos.length > 0}
		<Badge rounded class="text-white bg-primary-400 text-xs font-bold">{profile.photos.length}</Badge>
		  {/if}
		</div>

		<div class="flex flex-row gap-2 flex-wrap photos mt-3">
			{#each profile.photos as photo}
				<MyCard imgSrc="/api/photo/{photo.photoKey}" horizontal={true} >
						<h5 class="mb-2 text-lg tracking-tight">{photo.title}</h5>
						<ul class="text-text-400 text-sm">
							<li>Token ID: <a href={getTokenUrl(photo.tokenId)} class="text-blue-600 font-semibold" target="_blank">{photo.tokenId}</a></li>
							<li class="text-ellipsis">Cuenta: <span class="text-text-900">{ellipsis(photo.account, 16)}</span></li>
							<li>Tamaño: <span class="text-text-900">{getReadableFileSize(photo.size)}</span></li>
						    <li>Desde: <span class="text-text-900">{localDateTime(photo.ownerSince)}</span></li>
							{#if photo.currentContestTitle}
							<li>Concurso actual: <span class="text-text-900">{photo.currentContestTitle}</span></li>
							{/if}
						</ul>
				</MyCard>
			{/each}
		</div>
	  </TabItem>
</Tabs>

<Modal title="Transferir fondos" bind:open={modalFundsOpened} class="w-fit max-w-xs" dismissable placement="bottom-center" >
      <div class="flex flex-col gap-2">
		<ButtonGroup class="shadow-none justify-center">
			<Button on:click={() => fundsToTransfer = 1} pill color="light">1 €</Button>
			<Button on:click={() => fundsToTransfer = 5} pill color="green">5 €</Button>
			<Button on:click={() => fundsToTransfer = 10} pill color="yellow">10 €</Button>
			<Button on:click={() => fundsToTransfer = 50} pill color="red">50 €</Button>
		</ButtonGroup>
          <div class="flex flex-row items-baseline gap-2 w-52 self-center">
            <Label class="mb-2 w-full text-right">Cantidad:</Label>
            <Input bind:value={fundsToTransfer} max="1000" type="number" id="funds2transfer" name="funds2transfer" required 
					class="w-full">
				<span slot="right" class="text-gray-500 text-lg">€</span>
			</Input>
          </div>
		  <div class="flex justify-center col-span-2 mt-2">
            <Button type="button" on:click={transferFunds} disabled={transferingFunds}>
				{#if transferingFunds}
					<Spinner class="me-3" size="4" color="white" />
					Transferencia en curso...
				{:else}
					<Fa icon={faMoneyBill1Wave} class="text-md mr-1" />
					Añadir fondos
				{/if}

            </Button>
        </div>
	  </div>
</Modal>


<Modal title="Adquirir votos" bind:open={modalVotesOpened} class="w-fit max-w-xs" dismissable placement="bottom-center" >
	<div class="flex flex-col gap-2">
		<Select items={data.priceList} placeholder="Pack de votos" on:change={packSelected}  />
		<div class="flex flex-row items-baseline gap-2 w-52 self-center">
			<Label class="mb-2 w-full text-right">Precio:</Label>
			<Input value={votesPrice} max="1000" type="number" id="votesPrice" name="votesPrice" readonly
					class="w-full">
				<span slot="right" class="text-gray-500 text-lg">€</span>
			</Input>
		</div>
		<div class="flex flex-row items-baseline gap-2 w-52 self-center">
			<Label class="mb-2 w-full text-right">Votos:</Label>
			<Input bind:value={votesToBuy} type="number" id="votesToBuy" name="votesToBuy" required 
					class="w-full">
				
				<Fa  slot="right" icon={faStarAlt} class="text-xs"  />
			</Input>
		</div>
		<div class="flex justify-center col-span-2 mt-2">
		  <Button type="button" on:click={buyVotes} disabled={buyingVotes}>
			  {#if buyingVotes}
				  <Spinner class="me-3" size="4" color="white" />
				  Transferencia en curso...
			  {:else}
				  <Fa icon={faStar} class="text-md mr-1" />
				  Adquirir votos
			  {/if}

		  </Button>
	  </div>
	</div>
</Modal>



