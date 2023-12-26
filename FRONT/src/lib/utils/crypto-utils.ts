
export async function hash(algorithm: string, ...data: string[]): Promise<string> {
    const encoder = new TextEncoder();
    const arrayData = encoder.encode(data.join(''));
    const hashed = await crypto.subtle.digest(algorithm, arrayData);

    const hashArray = new Uint8Array(hashed);
    const hashString = hashArray.reduce((str : string, byte: number) => str + String.fromCharCode(byte), '');

    const b64Data = btoa(hashString);

    return b64Data;
}

export const createChallenge = async (email: string) : Promise<string> => {
    const challengeMinuteDate = `${Math.floor(Date.now()/1000/60)}`;

    console.log('challengeMinuteDate', challengeMinuteDate);
    console.log('email', email);
  
    const challenge = await hash('SHA-256', challengeMinuteDate, email);
    console.log('challenge', challenge);
    return challenge;
}
