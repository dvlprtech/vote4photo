<script lang="ts">
	import { faCartPlus } from "@fortawesome/free-solid-svg-icons";


	import { Button, Datepicker, Input, Label, Modal, Select, Textarea } from "flowbite-svelte";
	import Fa from "svelte-fa";
	import { createEventDispatcher, onMount } from 'svelte';
	import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
	import { DateTime } from "luxon";
	import { showError } from "$lib/ui/error-manager";
	import { fetchProxy } from "$lib/utils/fetch-utils";
	
	
	const dispatch = createEventDispatcher();

    const handleSubmit = async (e: SubmitEvent) => {
        
        const formdata = new FormData(e.target as HTMLFormElement);
        
        const initTimestamp = DateTime.fromISO(`${formdata.get('initDate')}T${formdata.get('initTime')}:00`);
        const endTimestamp = DateTime.fromISO(`${formdata.get('endDate')}T${formdata.get('endTime')}:00`);
        if (initTimestamp.toMillis() > endTimestamp.toMillis()) {
            showError('La fecha de inicio no puede ser posterior a la fecha de fin');
            return;
        }
        if (initTimestamp.toMillis() < DateTime.now().toMillis()) {
            showError('La fecha y hora de inicio no puede ser anterior al momento actual');
            return;
        }
        const data = {
            title: formdata.get('title'),
            description: formdata.get('description'),
            initTimestamp: initTimestamp.toISO(),
            endTimestamp: endTimestamp.toISO()
        }
        console.log('data: ', data);
        const r = await fetchProxy('/api/contest', {
            method: 'POST',
            payload: data
        });
        if (r.status === 200) {
            dispatch('close', {});
            dispatch('created', {
                ...(await r.json())
            });
        }

    }

    const onClose = () => {
        dispatch('close', {});
    }
    
    export let openModal = false;
    export let contestId : number | null = null;
    let title = '';
    onMount(() => {
        if (contestId) {
            title = 'Editar concurso';
        } else {
            title = 'Nuevo concurso';
        }
    });
    
</script>


<Modal {title} bind:open={openModal} class="min-w-full" on:close={onClose}>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="grid gap-4 mb-4 sm:grid-cols-2">
        <div>
          <Label for="title" class="mb-2">Título</Label>
          <Input type="text" id="title" name="title" placeholder="Título" required />
        </div>
        <div class="sm:col-span-2">
            <Label for="description" class="mb-2">Descripción</Label>
            <Textarea id="description" placeholder="Descripción o temática del concurso" rows="2" name="description" required />
          </div>
          <div>
            <Label for="initDate" class="mb-2">Fecha de inicio</Label>
            <Input type="date" id="initDate" name="initDate" required />
          </div>
          <div>
            <Label for="initTime" class="mb-2">Hora de inicio</Label>
            <Input type="time" id="initTime" name="initTime" required />
          </div>
          <div>
            <Label for="endDate" class="mb-2">Fecha de fin</Label>
            <Input type="date" id="endDate" name="endDate" required />
          </div>
          <div>
            <Label for="endTime" class="mb-2">Hora de fin</Label>
            <Input type="time" id="endTime" name="endTime" required />
          </div>
            <div class="flex justify-end col-span-2">
            <Button type="submit" class="w-52">
                <Fa icon={faCalendarPlus} class="w-5 h-5 mr-1" />
                Crear concurso
            </Button>
        </div>
      </div>
    </form>
  </Modal>