<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentToken } from '$lib/store/session-store';
	import { chain, firstConnect, wallet, walletAccount } from '$lib/store/wallet-store';
	import { showError } from '$lib/ui/error-manager';
	import ErrorModal from '$lib/ui/error-modal.svelte';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import {
		faAddressBook,
		faEnvelope,
		faPlayCircle,
		faUser
	} from '@fortawesome/free-regular-svg-icons';
	import { faGlobe, faKey, faUserAlt } from '@fortawesome/free-solid-svg-icons';
	import { Button, Checkbox, Input, Label, Popover } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { get } from 'svelte/store';
	import Footer from '../app/footer.svelte';
	import { createChallenge } from '$lib/utils/crypto-utils';

	const token = get(currentToken);

	const onSubmit = async (e: SubmitEvent) => {
		const formData = new FormData(e.target as HTMLFormElement);
		if (!$walletAccount) {
			showError('Es necesario conectar con una wallet para poder acceder');
			return;
		}
		if (formData.get('password') !== formData.get('password2')) {
			showError('Las contraseñas no coinciden');
			return;
		}
		const r: Response = await fetchProxy('/api/account/signup', {
			method: 'POST',
			headers: {
				'x-v4p-challenge': await createChallenge(formData.get('email') as string)
			},
			payload: {
				fullName: formData.get('fullName'),
				email: formData.get('email'),
				password: formData.get('password'),
				terms: formData.get('terms'),
				chainId: $chain?.id,
				account: $walletAccount
			}
		});
		if (r.status === 200) {
			console.log('Cuenta creada correctamente');
			const loginData = await r.json();
			currentToken.set(loginData.jwt);
			goto('/app/home');
		}
	};

	onMount(async () => {});
	const terms = `
	La presente aplicación es una PoC sin objetivo comercial, creada exclusivamente para fines educativos.
	Si has llegado por accidente a esta página, por favor, no introduzcas tus datos personales.
	`;
</script>

<svelte:head>
	<title>Vote4Photo - Acceso</title>
</svelte:head>

<section class="bg-gray-50 min-h-full">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<a href="/" class="flex items-center mb-6 font-semibold text-gray-600 dark:text-white text-4xl">
			<img class="w-20 h-20 mr-2" src="/images/logo.svg" alt="Logo Vote4Photo" />
			Vote4Photo
		</a>
		<div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-2xl font-semibold leading-tight tracking-tight text-gray-700">
					Crea tu cuenta
				</h1>
				<form class="space-y-4 md:space-y-6" on:submit|preventDefault={onSubmit}>
					<div>
						<Label for="fullName" class="text-gray-500">Nombre completo</Label>
						<Input
							type="text"
							name="fullName"
							id="fullName"
							placeholder="John Doe"
							required="true"
							size="lg"
						>
							<Fa icon={faUser} slot="left" />
						</Input>
					</div>
					<div>
						<Label for="email" class="text-gray-500">Email</Label>
						<Input
							type="email"
							name="email"
							id="email"
							placeholder="name@example.com"
							required="true"
							size="lg"
						>
							<Fa icon={faEnvelope} slot="left" />
						</Input>
					</div>
					<div class="flex flex-row gap-2">
						<div>
							<Label for="password" class="text-gray-500">Password</Label>
							<Input type="password" name="password" id="password" required="true" size="lg">
								<Fa icon={faKey} slot="left" />
							</Input>
						</div>
						<div>
							<Label for="password2" class="text-gray-500">Confirma password</Label>
							<Input type="password" name="password2" id="password2" required="true" size="lg">
								<Fa icon={faKey} slot="left" />
							</Input>
						</div>
					</div>
					{#if $walletAccount === undefined}
						<Button on:click={firstConnect} type="button" class="w-full" color="alternative">
							<!-- text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center -->
							<Fa icon={faGlobe} class="text-xl mr-2" />
							Conecta tu wallet
						</Button>
					{:else}
						<div>
							<Label for="walletaccount" class="text-gray-500">Cuenta conectada</Label>
							<Input
								type="text"
								id="walletaccount"
								size="lg"
								value={`${$chain?.name}: ${$walletAccount}`}
								readonly
							>
								<Fa icon={faAddressBook} slot="left" />
							</Input>
						</div>
					{/if}
					<p class="text-sm font-light text-gray-500 dark:text-gray-400">
						<Checkbox id="terms" name="terms" required="true">
							<a id="terms_and_conditions" class="font-medium text-primary-600 hover:underline"
								>Condiciones legales</a
							>
						</Checkbox>
						<Popover
							class="w-64 text-sm font-light "
							title="Términos y condiciones"
							triggeredBy="#terms_and_conditions">{terms}</Popover
						>
					</p>
					<Button
						type="submit"
						class="w-full bg-secondary-600 hover:bg-secondary-500"
						disabled={!$walletAccount}
					>
						<Fa icon={faUserAlt} color="white" class="text-xl mr-2" />
						Registrarse
					</Button>
				</form>
				<p class="text-sm font-light text-gray-500 dark:text-gray-400">
					¿Ya tienes una cuenta? <a
						href="/signin"
						class="font-medium text-primary-600 hover:underline">Accede con tu cuenta</a
					>
				</p>
			</div>
		</div>
	</div>
</section>
<Footer />
<ErrorModal />
