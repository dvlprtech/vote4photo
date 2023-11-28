import { Bindings } from '@lib/domain/env'
import { VERSION } from "@lib/common/version";
import { Context, Hono } from "hono";
import { executeWithSignature, getOperation, listOwnOperations, rejectOperation, executeOperation } from '@lib/services/operation-service';
import { getJsonBody } from '@lib/common/hono-utils';


export const route = new Hono<{ Bindings: Bindings }>();

route.get('/', async (c: Context) => {
  return c.json(await listOwnOperations(c, c.get('user').id));
})

route.get('/:operation_id', async (c: Context) => {
  const operationId = parseInt(c.req.param('operation_id'));
  const opOwner = c.get('role') === 'admin' ? null : c.get('user').id;
  return c.json(await getOperation(c, operationId, opOwner));
})

route.get('/:operation_id/data_to_sign', async (c: Context) => {
  const operationId = parseInt(c.req.param('operation_id'));
  const opOwner = c.get('user').id;
  return c.json(await getOperation(c, operationId, opOwner));
})


route.post('/:operation_id/signature', async (c: Context) => {
  const operationId = parseInt(c.req.param('operation_id'));
  const opOwner = c.get('user').id;
  const { signature } = await getJsonBody(c);
  return c.json(await executeWithSignature(c, operationId, signature, opOwner));
})

route.post('/:operation_id/execute', async (c: Context) => {
  const operationId = parseInt(c.req.param('operation_id'));
  const opOwner = c.get('user').id;
  
  return c.json(await executeOperation(c, operationId, opOwner));
})

route.post('/:operation_id/reject', async (c: Context) => {
  const operationId = parseInt(c.req.param('operation_id'));
  const opOwner = c.get('user').id;
  const { rejectionReason } = await getJsonBody(c);

  return c.json(await rejectOperation(c, operationId, rejectionReason, opOwner));
})


/*
  GET /api/operation
  GET /api/operation/{operation_id}
  GET /api/operation/{operation_id}/data_to_sign
  POST /api/operation/{operation_id}/signature
  POST /api/operation/{operation_id}/execute
  POST /api/operation/{operation_id}/reject
*/
