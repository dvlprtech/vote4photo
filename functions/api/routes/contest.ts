import { Bindings } from '@lib/domain/env'
import { VERSION } from "@lib/common/version";
import { Context, Hono } from "hono";
import { getJsonBody, verifyAdminUser } from '@lib/common/hono-utils';
import { HTTPException } from 'hono/http-exception';
import { createContest, getContest, getContests, initContest, participateInContestWithNFT, updateContest, votePhoto } from '@lib/services/contest-service';


export const route = new Hono<{ Bindings: Bindings }>();

route.get('', async (c: Context) => {
    return c.json(await getContests(c));
  });
  

/**
 * Crea un nuevo concurso
 */
route.post('', async (c: Context) => {
  verifyAdminUser(c);
  const contestData = await getJsonBody(c);

  return c.json(await createContest(c, contestData));
});

/**
 * Crea un nuevo concurso
 */
route.post('/:contestId', async (c: Context) => {
  verifyAdminUser(c);
  const contestId = parseInt(c.req.param('contestId'));
  const contestData = await getJsonBody(c);

  return c.json(await updateContest(c, contestId, contestData));
});

/**
 * Crea un nuevo concurso
 */
route.post('/:contestId/init', async (c: Context) => {
  verifyAdminUser(c);
  const contestId = parseInt(c.req.param('contestId'));
  
  return c.json(await initContest(c, contestId));
});

/**
 * Crea un nuevo concurso
 */
route.get('/:contestId', async (c: Context) => {
  const contestId = parseInt(c.req.param('contestId'));

  return c.json(await getContest(c, contestId));
});


/**
 * Sube una foto al usuario y al concurso y crea el NFT asociado
 */
route.post('/:contestId/addphoto', async (c: Context) => {
  const userId = c.get('user').id;
  const contestId = parseInt(c.req.param('contestId'));
  if (isNaN(contestId)) {
    throw new HTTPException(404, {message: 'Concurso inexistente'});
  }
  const requestData = await getJsonBody(c);
  const photoData = await participateInContestWithNFT(c, contestId, userId, requestData);
  return c.json(photoData);
});

/**
 * Vota por una foto en un concurso
 */
route.post('/:contestId/vote', async (c: Context) => {
  const userId = c.get('user').id;
  const contestId = parseInt(c.req.param('contestId'));
  const { contestPhotoId, votes } = await c.req.json();
  const logVote = await votePhoto(c, contestId, userId, contestPhotoId, votes);
  return c.json({...logVote});
});
 

