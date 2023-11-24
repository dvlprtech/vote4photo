<script lang="ts">
    import { onMount } from 'svelte';
    import { DarkMode, Footer, FooterBrand, FooterCopyright } from 'flowbite-svelte';
    import { SERVER_URL_BASE } from '$lib/environment/';

    let version : string | undefined = '';
    onMount(async () => {
        fetch(`${SERVER_URL_BASE}/api/v`).then(r => r.json()).then(r => {
            version = r.version;
        }).catch(reson => {
            version = '<unknown>';
        });
    });
        
</script>

<Footer class="rounded-none md:py-3 w-full bg-slate-100 dark:bg-slate-500 felx flex-row items-center" >
    <FooterCopyright href="https://uoc.edu" by="UOC TFM" classSpan="dark:text-gray-300" />
    <span class="dark:text-gray-300 text-gray-500 text-sm">v{version} by Roberto Sánchez</span>
    <FooterBrand imgClass="w-8 rounded-lg" href="https://dvlpr.tech" src="/images/avatar_roberto.jpg" alt="Roberto UOC" />    
</Footer>