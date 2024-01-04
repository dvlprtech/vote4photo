import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { extractBearerToken } from "./crypto-utils";
import { validateJWT } from "@lib/services/account-service";

export type SecRequest = ['GET' | 'POST', string];

export const requestTimeLog = async (c: Context, next: Next) => {
  const start = performance.now();
  await next();
  
  const elapsed = performance.now() - start;
  const elapsedTxt = `${(elapsed).toFixed(0)} ms`;
  c.res.headers.set('x-v4p-response-time', elapsedTxt);
}


export const securityFilter = (config: {publicPathsPrefix?: SecRequest[]}) => {
  const publicPrefix = config.publicPathsPrefix || [];
  return async (c: Context, next: Next) => {
    const publicPathMatch = publicPrefix.find(([method, prefix]: SecRequest) => {
      if (c.req.path === prefix) {
        return method === c.req.method;
      }
      if (prefix.endsWith('*') && c.req.path.startsWith(prefix.substring(0, prefix.length-2))) {
        return method === c.req.method;
      }
      return false;
    });
    if (!publicPathMatch) {
      const token = extractBearerToken(c);
      const payload = await validateJWT(c, token);
      c.set('user', payload);
    }
    await next();
  }  
}

/**
 * Comprueba que el usuario conectado sea el mismo que el que se quiere modificar o que sea admin
 * 
 * @param c 
 * @param userId 
 */
export const verifyUser = (c: Context, userId: string | number) => {
    const user = c.get('user');
    if (!user || (user.role !== 'admin' && user.id != userId)) {
        throw new HTTPException(403, {message: 'Forbidden'});
    }   
}

export const verifyAdminUser = (c: Context) => {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
      throw new HTTPException(403, {message: 'Forbidden'});
  }   
}


export const getJsonBody = async <T = any>(c: Context) : Promise<T> => {
  try {
    return await c.req.json();
  } catch(err) {
    throw new HTTPException(400, {message: 'Wrong body format'});
  } 
}

export const globalErrorHandler = (err: unknown, c: Context) => {
  let httpCode = 500;
  if (err instanceof HTTPException) {
    httpCode = err.status;    
  }
  const message = (err as any).message || `${err}`;
  console.error(httpCode, message);
  return c.json({message}, httpCode);
}


export const getUrlBase = (c: Context) => {
  const firstSlash = c.req.url.indexOf('/', 'https://'.length);
  if (firstSlash > 0) {
    return c.req.url.substring(0, firstSlash);
  }
  return c.req.url;
}