<script lang="ts">
    import Fa from 'svelte-fa';
	import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
    import { Badge, Button, Indicator, Modal, Toast, Tooltip } from "flowbite-svelte";
    import { writable } from "svelte/store";
    import { blur } from "svelte/transition";

    export let imgSrc = '';
    export let badgeContent = null as string | number | null;
    export let cardClass = '';
    export let divImgClass = 'bg-center bg-cover h-44';
    export let horizontal = false;
    $: imageStyle = `background-image: url(${imgSrc});`;
    $: orientation = horizontal ? 'flex-row w-96' : 'flex-col w-48';
    $: imageRounded = horizontal ? 'rounded-l-lg' : 'rounded-t-lg';

</script>
<!-- <img class={imgClass2} src={imgSrc} alt={imgAlt} /> -->
<div class="rounded-lg border border-gray-200 divide-gray-200 shadow-md flex {orientation} {cardClass}">
    {#if imgSrc}
        <div class="relative bg-no-repeat w-full {imageRounded} {divImgClass}" style={imageStyle}>            
            {#if badgeContent}
            <Indicator color="blue" border size="xl" placement="top-right" class="text-white text-xs font-semibold">{badgeContent}</Indicator>            
            {/if}
        </div>
        
    {/if}
    <div class="p-2 h-fit w-full ">
        <slot />
    </div>
   
</div>