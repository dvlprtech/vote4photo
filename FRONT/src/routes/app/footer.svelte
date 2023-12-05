<script lang="ts">
    import { onMount } from 'svelte';
    import { Footer, FooterBrand, FooterCopyright } from 'flowbite-svelte';
    import { SERVER_URL_BASE } from '$lib/environment/';
	import { fetchProxy } from '$lib/utils/fetch-utils';

    let version : string | undefined = '';
    onMount(async () => {
        fetchProxy('/api').then(r => r.json()).then(r => {
            version = r.version;
        }).catch(reson => {
            version = '<??>';
        });
    });
        
</script>

<Footer class="rounded-none py-1 w-full bg-slate-100 dark:bg-slate-500 justify-between px-2 flex flex-row items-center gap-2" >
    <FooterBrand aClass="hidden sm:block" imgClass="h-8" href="https://dvlpr.tech" src="/images/uoc_azul.svg" alt="UOC" />    
    <FooterCopyright href="https://uoc.edu" by="UOC TFM" classSpan="text-xs sm:text-sm" copyrightMessage="" />
    <div class="flex flex-row items-center gap-2">
        <span class="dark:text-gray-300 text-gray-500 text-xs sm:text-sm text-right">v{version} <span class="whitespace-nowrap">by Roberto Sánchez</span></span>
        <FooterBrand imgClass="w-8 rounded-lg" href="https://dvlpr.tech" src="/images/avatar_roberto.jpg" alt="Roberto UOC" />    
    </div>
</Footer>