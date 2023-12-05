<script>
    import { page } from '$app/stores';    
	import { clearSessionData } from '$lib/store/session-store';
	import { faHome, faHomeAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	import Fa from 'svelte-fa';
    $: activeUrl = $page.url.pathname;
    let activeClass = 'text-base text-secondary-500';
    let nonActiveClass = 'text-base hover:text-secondary-400';
</script> 

<Navbar let:hidden let:toggle class="py-0 w-full bg-slate-100 dark:bg-slate-500 shadow" >
    <NavBrand href="/">
      <img src="/images/logo.svg" alt="Vote4Photo" class="mr-2 h-6 sm:h-9">
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Vote4Photo</span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {activeUrl} {hidden} {activeClass} {nonActiveClass} class="font-bold" >
      <NavLi href="/app/home"><Fa icon={faHome} class="w-5 h-5 mt-1" /></NavLi>
      <NavLi href="/app/contests">Concursos</NavLi>
      <NavLi href="/app/profile">Profile</NavLi>
    </NavUl>
    <Button outline={true} pill={false} on:click={clearSessionData} class="p-2" color="light">
      <Fa icon={faSignOutAlt} class="w-5 h-5" />
    </Button>
  </Navbar>
  
  