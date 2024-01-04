<script lang="ts">
	import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

	import {
		Button,
		Checkbox,
		Datepicker,
		Helper,
		Input,
		Label,
		Modal,
		Select,
		Textarea
	} from 'flowbite-svelte';
	import Fa from 'svelte-fa';
	import { createEventDispatcher, onMount } from 'svelte';
	import { faCalendarPlus } from '@fortawesome/free-regular-svg-icons';
	import { DateTime } from 'luxon';
	import { showError } from '$lib/ui/error-manager';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import type { ContestDetail } from '$lib/domain/contests';

	const dispatch = createEventDispatcher();

	const handleSubmit = async (e: SubmitEvent) => {
		//const formdata = new FormData(e.target as HTMLFormElement);

		const initTimestamp = initContestNow
			? null
			: DateTime.fromISO(`${values.initDate}T${values.initTime}:00`);
		const endTimestamp = DateTime.fromISO(
			`${values.endDate}T${values.endTime}:00`
		);
		if (initTimestamp && initTimestamp.toMillis() > endTimestamp.toMillis()) {
			showError('La fecha de inicio no puede ser posterior a la fecha de fin');
			return;
		}
		if (initTimestamp && initTimestamp.toMillis() < DateTime.now().toMillis()) {
			showError('La fecha y hora de inicio no puede ser anterior al momento actual');
			return;
		}
		if (endTimestamp.toMillis() < DateTime.now().toMillis()) {
			showError('La fecha y hora de fin no puede ser anterior al momento actual');
			return;
		}
		const data = {
			title: values.title,
			description: values.description,
			initTimestamp: initTimestamp?.toISO() || null,
			endTimestamp: endTimestamp.toISO()
		};
		const url = contestId ? `/api/contest/${contestId}` : '/api/contest';
		const r = await fetchProxy(url, {
			method: 'POST',
			payload: data
		});
		if (r.status === 200) {
			dispatch('close', {});
			const updatedData = await r.json();
			if (contestId) {
				dispatch('updated', updatedData);
			} else {
				dispatch('created', updatedData);
			}
		}
	};

	const onClose = () => {
		dispatch('close', {});
	};

	type FormValues = {
		title: string;
		description: string;
		initDate: string;
		initTime: string;
		endDate: string;
		endTime: string;
	};

	export let openModal = false;
	export let contestData = null as ContestDetail | null;
	let form: HTMLFormElement;
	$: contestId = contestData?.id;
	$: initContestNow = false;
	$: title = contestId ? 'Editar concurso' : 'Nuevo concurso';
	$: buttonTitle = contestId ? 'Modificar concurso' : 'Crear concurso';
	$: values = {} as FormValues;
	$: {
		if (!values.title && form && contestData) {
			values.title = contestData!.title;
			values.description = contestData!.description;
			values.initDate = DateTime.fromISO(contestData!.initTimestamp!).toISODate()!;
			values.initTime = DateTime.fromISO(contestData!.initTimestamp).toISOTime({
				includeOffset: false
			})!.substring(0, 5)!;
			values.endDate = DateTime.fromISO(contestData!.endTimestamp).toISODate()!;
			values.endTime = DateTime.fromISO(contestData!.endTimestamp).toISOTime({
				includeOffset: false
			})?.substring(0, 5)!;			
		}
	}
</script>

<Modal {title} bind:open={openModal} class="min-w-full" on:close={onClose}>
	<form bind:this={form} on:submit|preventDefault={handleSubmit}>
		<div class="grid gap-4 mb-4 sm:grid-cols-2">
			<div>
				<Label for="title" class="mb-2">Título</Label>
				<Input
					bind:value={values.title}
					type="text"
					id="title"
					name="title"
					placeholder="Título"
					required
				/>
			</div>
			<div class="sm:col-span-2">
				<Label for="description" class="mb-2">Descripción</Label>
				<Textarea
					id="description"
					bind:value={values.description}
					placeholder="Descripción o temática del concurso"
					rows="2"
					name="description"
					required
				/>
			</div>
			{#if !contestId}
				<div class="sm:col-span-2">
					<Checkbox
						bind:checked={initContestNow}
						color="primary"
						aria-describedby="helper-contest-init-date">Iniciar el concurso inmediatamente</Checkbox
					>
					<Helper id="helper-contest-init-date" class="ps-6"
						>El concurso se creará en estado activo y se podrán subir fotos</Helper
					>
				</div>
			{/if}
			{#if !initContestNow}
				<div>
					<Label for="initDate" class="mb-2">Fecha de inicio</Label>
					<Input bind:value={values.initDate} type="date" id="initDate" name="initDate" required />
				</div>
				<div>
					<Label for="initTime" class="mb-2">Hora de inicio</Label>
					<Input bind:value={values.initTime} type="time" id="initTime" name="initTime" required />
				</div>
			{/if}
			<div>
				<Label for="endDate" class="mb-2">Fecha de fin</Label>
				<Input bind:value={values.endDate} type="date" id="endDate" name="endDate" required />
			</div>
			<div>
				<Label for="endTime" class="mb-2">Hora de fin</Label>
				<Input bind:value={values.endTime} type="time" id="endTime" name="endTime" required />
			</div>
			<div class="flex justify-end col-span-2">
				<Button type="submit" class="w-52">
					<Fa icon={faCalendarPlus} class="w-5 h-5 mr-1" />
					{buttonTitle}
				</Button>
			</div>
		</div>
	</form>
</Modal>
