<svelte:head>
	<title>Vote4Photo - Crea tu cuenta</title>	
</svelte:head>

<script lang="ts">
	import { wallet, walletAccount } from '$lib/store/wallet-store';
	import { connectWallet, existsWallet, getWalletAccount } from '$lib/utils/wallet-utils';
	import { faUser } from '@fortawesome/free-regular-svg-icons';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { writable } from 'svelte/store';
	import { createWalletClient, custom } from 'viem'
	import { mainnet } from 'viem/chains'



</script>


<section class="bg-gray-50 dark:bg-gray-900">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<a href="/" class="flex items-center mb-6 font-semibold text-gray-600 dark:text-white text-4xl">
			<img class="w-20 h-20 mr-2" src="/images/logo.svg" alt="Logo Vote4Photo">
			Vote4Photo    
		</a>
		<div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-2xl font-semibold leading-tight tracking-tight text-gray-700 ">
					Crea tu cuenta
				</h1>
				<form class="space-y-4 md:space-y-6" >
					<div>
						<Label for="email" class="text-gray-500" >Email</Label>
						<Input type="email" name="email" id="email" class="" placeholder="name@example.com" required="" size="lg" />
					</div>

					<div>
						<Label for="password" class="text-gray-500">Password</Label>
						<Input type="password" name="password" id="password" class="" required="" size="lg" />
					</div>
					<Button type="button" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center ">
						<Fa icon={faUser} color="white" class="text-xl mr-2" />    
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