<script lang="ts">
    import Fa from 'svelte-fa';
	import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
    import { Toast } from "flowbite-svelte";
    import { writable } from "svelte/store";
    import { blur } from "svelte/transition";

    import { type ErrorData, errorMessage } from "$lib/ui/error-manager";

    const message = writable('');
    const showErrorToast = writable(false);

    errorMessage.subscribe((data: ErrorData | null) => {
        if (data?.message) {
            showErrorToast.set(true);
            message.set(data.message);
            setTimeout(() => {
                showErrorToast.set(false);
                message.set('');
            }, data.delay || 7000);
        } else {
            showErrorToast.set(false);
        }
    });
</script>

<Toast transition={blur} color="red" open={$showErrorToast} position="bottom-right" on:close={() => showErrorToast.set(false)}
    contentClass="flex flex-nowrap items-center gap-2 overflow-hidden">

    <Fa icon={faCircleXmark} color="red" class="text-xl" />    
    <span>{$message}</span> 
</Toast>