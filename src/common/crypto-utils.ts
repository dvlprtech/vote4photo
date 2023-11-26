import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { Buffer } from 'node:buffer';

const PASS_HASH_ALGORITHM = 'SHA-256';
const SEP = '$';

const _saltedData = (data: string, salt: Uint8Array): Uint8Array => {
  const encoder = new TextEncoder();
  const arrayData = encoder.encode(data);
  const saltedPass = new Uint8Array(salt.length + arrayData.length);
  saltedPass.set(salt);
  saltedPass.set(arrayData, salt.length);
  return saltedPass;
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  const saltedPass = _saltedData(plainPassword, salt);
  const hashedPass = await crypto.subtle.digest(PASS_HASH_ALGORITHM, saltedPass);
  const saltB64 = Buffer.from(salt).toString('hex');
  const hashedPassB64 = Buffer.from(hashedPass).toString('base64');

  return `${saltB64}${SEP}${hashedPassB64}`;
}

export async function hash(...data: string[]): Promise<string> {
  const encoder = new TextEncoder();
  const arrayData = encoder.encode(data.join(''));

  const hashed = await crypto.subtle.digest(PASS_HASH_ALGORITHM, arrayData);
  const b64Data = Buffer.from(hashed).toString('base64');

  return b64Data;
}

export async function verifyPassword(plainPassword: string, saltedPassB64: string): Promise<boolean> {
  const [hexSalt, b64Password] = saltedPassB64.split(SEP);
  const salt = Uint8Array.from(Buffer.from(hexSalt, 'hex'));
  const saltedPass = _saltedData(plainPassword, salt);
  const hashedPass = await crypto.subtle.digest(PASS_HASH_ALGORITHM, saltedPass);
  const hashedPassB64 = Buffer.from(hashedPass).toString('base64');

  return hashedPassB64 === b64Password;
}

export function extractBearerToken(c: Context): string {

  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    throw new HTTPException(401, { message: 'Missing token' });
  }
  return token.trim();
}

