<script lang="ts">
    import Fa from 'svelte-fa';
	import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
    import { Button, Modal, Toast } from "flowbite-svelte";
    import { writable } from "svelte/store";
    import { blur } from "svelte/transition";

    import { type ErrorData, errorMessage } from "$lib/ui/error-manager";

    const message = writable('');

    errorMessage.subscribe((data: ErrorData | null) => {
        if (data?.message) {
            message.set(data.message);
        } else {
            message.set('');
        }
    });
    $: showErrorModal = !!$message;
    const modalIsClosed = () => {
        errorMessage.set(null);
    }
</script>



<Modal title="Error" bind:open={showErrorModal} size="xs" autoclose outsideclose color="red" on:close={modalIsClosed}>
    <div class="text-center">          
      <p class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{$message}</p>
    </div>
    <div slot="footer" class="flex items-center justify-center w-full">
        <Button color="red">Cerrar</Button>
    </div>
</Modal>