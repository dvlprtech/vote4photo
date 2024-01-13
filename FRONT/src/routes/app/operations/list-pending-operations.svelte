<script lang="ts">
	import {
		faCancel,
		faCartArrowDown,
		faCartPlus,
		faCircle,
		faHandHoldingDollar,
		faInfoCircle,
		faSackDollar
	} from '@fortawesome/free-solid-svg-icons';

	import {
		isSignatureRequired,
		type OperationBasicData,
		type OperationStatusType,
		type OperationTypeType
	} from '$lib/domain/operations';
	import {
		faCheckCircle,
		faMoneyBillAlt,
		type IconDefinition,
		type IconLookup
	} from '@fortawesome/free-regular-svg-icons';
	import {
		Button,
		ButtonGroup,
		Checkbox,
		Helper,
		Img,
		Label,
		Modal,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Textarea,
		Tooltip
	} from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import { fetchProxy } from '$lib/utils/fetch-utils';
	import { localDateTime } from '$lib/utils/format-utils';
	import { showError } from '$lib/ui/error-manager';
	import { pendingOperations, refreshOperations } from '$lib/store/operations-store';
	import { signMessageWithWallet } from '$lib/utils/wallet-utils';

	const dispatch = createEventDispatcher();

	const onClose = () => {
		dispatch('close', {});
	};

	const iconByType = (type?: OperationTypeType) => {
		switch (type) {
			case 'accept_prize':
				return faSackDollar;
			case 'buy':
				return faCartPlus;
			case 'sell':
				return faHandHoldingDollar;
			case 'notification':
				return faInfoCircle;
		}
	};
	const textByType = (type?: OperationTypeType) => {
		switch (type) {
			case 'accept_prize':
				return 'Acepta el premio del concurso';
			case 'buy':
				return 'Compra la foto por la que votaste';
			case 'sell':
				return 'Vende la foto del concurso';
			case 'notification':
				return 'Notificación informativa';
		}
	};
	const rejectTextByType = (type?: OperationTypeType) => {
		switch (type) {
			case 'accept_prize':
				return 'Renunciarás al premio del concurso';
			case 'buy':
				return 'Rechazarás la compra de la foto';
			case 'sell':
				return 'Rechazas la venta la foto';
		}
	};
	const aceptTextByType = (type?: OperationTypeType) => {
		switch (type) {
			case 'accept_prize':
				return 'Al ejecutar la operación recibirás el premio del concurso a cambio de transferir la foto';
			case 'buy':
				return 'Aceptas la compra de la foto por la cantidad indicada. El propietario debe confirmar la venta.';
			case 'sell':
				return 'Aceptas la venta de la foto por la cantidad indicada';
		}
	};
	const openRejectionDialog = (op: OperationBasicData) => {
		//pendingOperations = pendingOperations.filter(o => o !== op);
		selectedOperation = op;
		rejectionReason = '';
		acceptRejection = false;
		rejectModal = true;
	};
	const openExecDialog = (op: OperationBasicData) => {
		//pendingOperations = pendingOperations.filter(o => o !== op);
		selectedOperation = op;
		acceptExecution = op.type === 'notification';
		executionModal = true;
	};

	const execWithSignature = async () => {
		const r: Response = await fetchProxy(`/api/operation/${selectedOperation!.id}/data_to_sign`);
		if (r.status !== 200) {
			const error = await r.json();
			showError(
				'No se ha podido obtener la información para firmar la operación. ERROR: ' +
					error.message ||
					error ||
					r.statusText
			);
			return;
		}
		const { messageToSign, domain } = await r.json();
		const signature = await signMessageWithWallet(messageToSign, domain);
		if (!signature) {
			showError('No se ha podido firmar el mensaje');
			return;
		}
		const signedMessage = { ...messageToSign, signature };
		executingOperation = true;
		const r2 = await fetchProxy(`/api/operation/${selectedOperation!.id}/signature`, {
			method: 'POST',
			payload: { signedMessage }
		});
		executingOperation = false;
		if (r2.status === 200) {
			executionModal = false;
			refreshOperations();
		}
	};

	const execWithoutSignature = async () => {
		executingOperation = true;
		const r: Response = await fetchProxy(`/api/operation/${selectedOperation!.id}/execute`, {
			method: 'POST'
		});
		executingOperation = false;
		if (r.status === 200) {
			executionModal = false;
			refreshOperations();
		}
	};

	const execOperation = async () => {
		if (!selectedOperation) {
			return;
		}
		if (!acceptExecution) {
			showError('Debes aceptar que la operación no se puede deshacer');
			return;
		}

		if (isSignatureRequired(selectedOperation.type)) {
			execWithSignature();
		} else {
			execWithoutSignature();
		}
	};

	const rejectOperation = async () => {
		if (!selectedOperation) {
			return;
		}
		if (!acceptRejection) {
			showError('Debes aceptar que la operación no se puede deshacer');
			return;
		}
		if (!rejectionReason) {
			showError('Debes indicar el motivo del rechazo');
			return;
		}

		const r: Response = await fetchProxy(`/api/operation/${selectedOperation!.id}/reject`, {
			method: 'POST',
			payload: {
				rejectionReason
			}
		});
		if (r.status === 200) {
			rejectModal = false;
			refreshOperations();
		}
	};

	$: selectedOperation = null as OperationBasicData | null;
	$: rejectModal = false;
	$: acceptRejection = false;
	$: rejectionReason = '';
	$: executingOperation = false;

	$: executionModal = false;
	$: acceptExecution = false;
</script>

{#if $pendingOperations.length > 0}
	<h2 class="text-xl font-semibold">Operaciones pendientes</h2>
	<Table>
		<TableHead>
			<TableHeadCell />
			<TableHeadCell>Foto</TableHeadCell>
			<TableHeadCell>Mensaje</TableHeadCell>
			<TableHeadCell>Fecha expiración</TableHeadCell>
			<TableHeadCell>Acción</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each $pendingOperations as op, i}
				<TableBodyRow class="divide-y">
					<TableBodyCell>
						<Fa icon={iconByType(op.type)} size="lg" />
						<Tooltip>{textByType(op.type)}</Tooltip>
					</TableBodyCell>
					<TableBodyCell>
						<div class="w-10 h-10">
							<Img src={`/api/photo/${op.photoKey}`} class="w-full h-auto" />
							<Tooltip>{op.title}</Tooltip>
						</div>
					</TableBodyCell>
					<TableBodyCell
						><div class="max-w-xl whitespace-break-spaces">{op.message}</div></TableBodyCell
					>
					<TableBodyCell>{localDateTime(op.expirationTimestamp)}</TableBodyCell>
					<TableBodyCell>
						<ButtonGroup>
							{#if op.status === 'pending'}
								<Button
									color="primary"
									size="sm"
									outline={true}
									pill={true}
									on:click={() => openExecDialog(op)}
								>
									<Fa icon={faCheckCircle} size="lg" />
								</Button>
								{#if op.type !== 'notification'}
									<Tooltip>Ejecuta la operación</Tooltip>
									<Button
										color="dark"
										size="sm"
										outline={true}
										pill={true}
										on:click={() => openRejectionDialog(op)}
									>
										<Fa icon={faCancel} size="lg" />
									</Button>
									<Tooltip>Rechaza la operación</Tooltip>
								{:else}
									<Tooltip>Marca la notificación como leída</Tooltip>
								{/if}
							{/if}
						</ButtonGroup>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}

<Modal title="Rechazar operación" bind:open={rejectModal}>
	<div class="flex flex-row gap-5 w-full">
		<div class="flex flex-col gap-1">
			<Img
				src={`/api/photo/${selectedOperation?.photoKey}`}
				class="w-32 h-auto"
			/>
			<span class="text-base leading-relaxed text-center">{selectedOperation?.title}</span>
		</div>
		<div class="flex flex-col gap-2 grow">
			<p class="text-base leading-relax flex flex-row gap-2">
				<Fa icon={iconByType(selectedOperation?.type)} size="lg" />
				<span class="text-lg">{rejectTextByType(selectedOperation?.type)}</span>
			</p>
			<p class="text-base leading-relax">{selectedOperation?.message}</p>
			{#if selectedOperation?.type === 'buy' || selectedOperation?.type === 'sell'}
				<p class="text-base leading-relax flex flex-row gap-2">
					<span class="text-md"
						>Valor de venta: <strong>{selectedOperation?.salePrice}€</strong></span
					>
				</p>
			{/if}
			<div>
				<Label for="rejectedReason" class="text-gray-500">Motivo del rechazo</Label>
				<Textarea
					bind:value={rejectionReason}
					class="w-full"
					name="rejectedReason"
					id="rejectedReason"
					placeholder="Indica el motivo de rechazo"
					required="true"
					rows="3"
				/>
			</div>
		</div>
	</div>
	<div>
		<Checkbox bind:checked={acceptRejection} color="red" aria-describedby="helper-reject-check"
			>Entiendo que si continúo, la acción no se puede deshacer</Checkbox
		>
		<Helper id="helper-reject-check" class="ps-6"
			>Al rechazar la operación ya no será posible ejecutarla en un futuro</Helper
		>
	</div>

	<svelte:fragment slot="footer">
		<Button color="red" on:click={rejectOperation}>Rechazar</Button>
		<Button
			color="alternative"
			on:click={() => {
				rejectModal = false;
			}}>Cancelar</Button
		>
	</svelte:fragment>
</Modal>

<Modal title="Aceptar operación" bind:open={executionModal}>
	<div class="flex flex-row gap-5 w-full">
		<div class="flex flex-col gap-1">
			<Img src={`/api/photo/${selectedOperation?.photoKey}`} class="w-32 h-auto" />
			<span class="text-base leading-relaxed text-center">{selectedOperation?.title}</span>
		</div>
		<div class="flex flex-col gap-2 grow">
			<p class="text-base leading-relax flex flex-row gap-2">
				<Fa icon={iconByType(selectedOperation?.type)} size="lg" />
				<span class="text-lg">{textByType(selectedOperation?.type)}</span>
			</p>
			<strong class="text-base leading-relax">{selectedOperation?.message}</strong>
			{#if selectedOperation?.type === 'buy' || selectedOperation?.type === 'sell'}
				<p class="text-base leading-relax flex flex-row gap-2">
					<span class="text-md"
						>Valor de venta: <strong>{selectedOperation?.salePrice}€</strong></span
					>
				</p>
			{/if}
		</div>
	</div>
	{#if selectedOperation?.type !== 'notification'}
		<div>
			<Checkbox
				bind:checked={acceptExecution}
				color="primary"
				aria-describedby="helper-accept-check"
				>Entiendo que si continúo, la acción no se puede deshacer</Checkbox
			>
			<Helper id="helper-accept-check" class="ps-6"
				>{aceptTextByType(selectedOperation?.type)}</Helper
			>
		</div>
	{/if}

	<svelte:fragment slot="footer">
		<Button color="primary" on:click={execOperation}>
			{#if executingOperation}
				<Spinner class="me-3" size="4" color="white" />
				Ejecutando...
			{:else}
				Aceptar
			{/if}
		</Button>
		<Button
			color="alternative"
			on:click={() => {
				executionModal = false;
			}}>Cancelar</Button
		>
	</svelte:fragment>
</Modal>
