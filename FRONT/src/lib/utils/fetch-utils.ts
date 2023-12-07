export const ssr = false;
export const prerender = false;

import { goto } from "$app/navigation";
import { currentToken } from "$lib/store/session-store";
import { showError } from "$lib/ui/error-manager";
import { get } from "svelte/store";

type ExtendedRequestInit = RequestInit & { payload?: object };

// Creamos un proxy fetch para añadir el token a las peticiones
export const fetchProxy = async (input: RequestInfo, init?: ExtendedRequestInit, skipError: boolean = false) : Promise<Response> => {
    const headers = new Headers(init?.headers);
    const token = get(currentToken);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && init?.payload) {
        headers.set('Content-Type', 'application/json');
    }
    if (init && typeof init?.payload === 'object') {
        init.body = JSON.stringify(init.payload);
    }
    
    const r = await fetch(input, {...init, headers });
    if (r.status !== 200 && !skipError) {
        console.log('Error en la petición: ', input);
        const errorData = await r.json();
        showError(errorData);        
        if (r.status === 401) {
            goto('/signin');            
        }
    }
    
    return r;
}
