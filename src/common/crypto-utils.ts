import { Buffer } from 'node:buffer';

const PASS_HASH_ALGORITHM = 'SHA-256';
const SEP = '$';

const _saltedData = (data: string, salt : Uint8Array) : Uint8Array => {
  const encoder = new TextEncoder();
  const arrayData = encoder.encode(data);
  const saltedPass = new Uint8Array(salt.length + arrayData.length);
  saltedPass.set(salt); 
  saltedPass.set(arrayData, salt.length);
  return saltedPass;
}

export async function hashPassword(plainPassword: string) : Promise<string> {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    
    const saltedPass = _saltedData(plainPassword, salt);
    const hashedPass = await crypto.subtle.digest(PASS_HASH_ALGORITHM, saltedPass);
    const saltB64 = Buffer.from(salt).toString('hex');
    const hashedPassB64 = Buffer.from(hashedPass).toString('base64');
    
    return `${saltB64}${SEP}${hashedPassB64}`;
  }

  export async function verifyPassword(plainPassword: string, saltedPassB64: string) : Promise<boolean> {
    const [hexSalt, b64Password] = saltedPassB64.split(SEP);
    const salt = Uint8Array.from(Buffer.from(hexSalt, 'hex'));
    const saltedPass = _saltedData(plainPassword, salt);
    const hashedPass = await crypto.subtle.digest(PASS_HASH_ALGORITHM, saltedPass);
    const hashedPassB64 = Buffer.from(hashedPass).toString('base64');
    
    return hashedPassB64 === b64Password;
  }