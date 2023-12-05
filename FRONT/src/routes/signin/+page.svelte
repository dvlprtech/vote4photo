<svelte:head>
	<title>Vote4Photo - Acceso</title>	
</svelte:head>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentToken } from '$lib/store/session-store';
	import { chain, firstConnect, wallet, walletAccount } from '$lib/store/wallet-store';
	import { showError } from '$lib/ui/error-manager';
	import ErrorModal from '$lib/ui/error-modal.svelte';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import { faAddressBook, faEnvelope, faPlayCircle } from '@fortawesome/free-regular-svg-icons';
	import { faGlobe, faKey } from '@fortawesome/free-solid-svg-icons';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { get } from 'svelte/store';
	import Footer from '../app/footer.svelte';

	const token = get(currentToken);
	console.log(`TOKEN stored: ${token}`);

	const onSubmit = async (e: SubmitEvent) => {
		console.log('Signing in...');
		const formData = new FormData(e.target as HTMLFormElement);
		if (!$walletAccount) {
			showError('Es necesario conectar con una wallet para poder acceder');
			return;
		}
		const r : Response = await fetchProxy('/api/account/signin', {
			method: 'POST',
			payload: {
				email: formData.get('email'),
				password: formData.get('password'),
				chainId: $chain?.id,
				account: $walletAccount
			}
		});
		if (r.status === 200) {
			console.log('Login correcto');
			const loginData = await r.json();
			currentToken.set(loginData.token);
			goto('/app/home');
		}
	}

	onMount(async () => {
	});
</script>

<section class="bg-gray-50 min-h-full">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<a href="/" class="flex items-center mb-6 font-semibold text-gray-600 dark:text-white text-4xl">
			<img class="w-20 h-20 mr-2" src="/images/logo.svg" alt="Logo Vote4Photo">
			Vote4Photo    
		</a>
		<div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-2xl font-semibold leading-tight tracking-tight text-gray-700 ">
					Accede con tu cuenta
				</h1>
				<form class="space-y-4 md:space-y-6" on:submit|preventDefault={onSubmit} >
					<div>
						<Label for="email" class="text-gray-500" >Email</Label>
						<Input type="email" name="email" id="email" class="" placeholder="name@example.com" required="true" size="lg" >
							<Fa icon={faEnvelope} slot="left" />    
						</Input>
					</div>
					<div>
						<Label for="password" class="text-gray-500">Password</Label>
						<Input type="password" name="password" id="password" class="" required="true" size="lg">
							<Fa icon={faKey} slot="left" />    
						</Input>
					</div>
					{#if $walletAccount === undefined}
						<Button on:click={firstConnect} type="button" class="w-full" color="alternative"> <!-- text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center -->
							<Fa icon={faGlobe} class="text-xl mr-2" />    
							Conecta tu wallet
						</Button>
					{:else}
					<div>
						<Label for="walletaccount" class="text-gray-500">Cuenta conectada</Label>
						<Input type="text" id="walletaccount" size="lg" value={`${$chain?.name}: ${$walletAccount}`} readonly>
							<Fa icon={faAddressBook} slot="left" />    
						</Input>
					</div>
					{/if}
					<Button type="submit" class="w-full" disabled='{!$walletAccount}'> 
						<Fa icon={faPlayCircle} color="white" class="text-xl mr-2" />    
						Entrar
					</Button>
					<p class="text-sm font-light text-gray-500 dark:text-gray-400">
						¿Aun no tienes una cuenta? <a href="/signup" class="font-medium text-primary-600 hover:underline ">Registrate</a>
					</p>
				</form>
			</div>
		</div>
	</div>
  </section>
  <Footer />
  <ErrorModal />