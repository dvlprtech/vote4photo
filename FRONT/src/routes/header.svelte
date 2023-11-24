<script>
    import { page } from '$app/stores';    
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
    $: activeUrl = $page.url.pathname;
    let activeClass = 'text-base text-white bg-primary-500 !px-3 !py-1 font-bold ';
    let nonActiveClass = 'text-base font-bold !px-3 !py-1 text-primary-700 dark:text-gray-300 dark:hover:text-white';
</script> 

<Navbar let:hidden let:toggle class="py-0 w-full bg-slate-100 dark:bg-slate-500 shadow" >
    <NavBrand href="/">
      <img src="/images/logo.svg" alt="Vote4Photo" class="mr-2 h-6 sm:h-9">
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Vote4Photo</span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {activeUrl} {hidden} {activeClass} {nonActiveClass} class="font-bold">
      <NavLi href="/contest">Concursos</NavLi>
      <NavLi href="/profile">Profile</NavLi>
    </NavUl>
  </Navbar>
  
  