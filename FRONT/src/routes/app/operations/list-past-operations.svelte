<script lang="ts">
	import { faCartPlus, faHandHoldingDollar, faInfoCircle, faSackDollar } from "@fortawesome/free-solid-svg-icons";

  import type { OperationBasicData, OperationTypeType } from "$lib/domain/operations";
  import { localDateTime } from "$lib/utils/format-utils";
  import { Img, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Tooltip } from 'flowbite-svelte';
  import Fa from "svelte-fa";
	
	

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
  }
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
  }

  export let executedOperations: OperationBasicData[] = [];
  export let rejectedOperations: OperationBasicData[] = [];

</script>

{#if executedOperations.length > 0}
<h2 class="text-xl font-semibold">Operaciones ejecutadas</h2>
<Table>
  <TableHead>
    <TableHeadCell></TableHeadCell>
    <TableHeadCell>Foto</TableHeadCell>
    <TableHeadCell>Mensaje</TableHeadCell>
    <TableHeadCell>Fecha ejecución</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each executedOperations as op, i}
    <TableBodyRow class="divide-y">
      <TableBodyCell>
        <Fa icon={iconByType(op.type)} size="lg" color="darkgreen" />
        <Tooltip>{textByType(op.type)}</Tooltip>
      </TableBodyCell>
      <TableBodyCell>
        <div class="w-10 h-10">
          <Img src2="http://localhost:5173/images/logo.svg" src={`/api/photo/${op.photoKey}`} class="w-full h-auto" />
          <Tooltip>{op.title}</Tooltip>
        </div>
      </TableBodyCell>
      <TableBodyCell>{op.message}</TableBodyCell>
      <TableBodyCell>{localDateTime(op.executionTimestamp)}</TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>
{/if}

{#if rejectedOperations.length > 0}
<h2 class="text-xl font-semibold">Operaciones rechazadas</h2>
<Table>
  <TableHead>
    <TableHeadCell></TableHeadCell>
    <TableHeadCell>Foto</TableHeadCell>
    <TableHeadCell>Mensaje</TableHeadCell>
    <TableHeadCell>Fecha rechazo</TableHeadCell>
    <TableHeadCell>Motivo</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each rejectedOperations as op, i}
    <TableBodyRow class="divide-y">
      <TableBodyCell>
        <Fa icon={iconByType(op.type)} size="lg" color="lightgray" />
        <Tooltip>{textByType(op.type)}</Tooltip>
      </TableBodyCell>
      <TableBodyCell>
        <div class="w-10 h-10">
          <Img src="http://localhost:5173/images/logo.svg" src2={`/api/photo/${op.photoKey}`} class="w-full h-auto" />
          <Tooltip color="gray">{op.title}</Tooltip>
        </div>
      </TableBodyCell>
      <TableBodyCell><span class="text-gray-400">{op.message}</span></TableBodyCell>
      <TableBodyCell><span class="text-gray-400">{localDateTime(op.rejectionTimestamp)}</span></TableBodyCell>
      <TableBodyCell><span class="text-gray-400">{op.rejectionReason || ''}</span></TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>
{/if}