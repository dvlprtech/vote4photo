import * as Sentry from '@sentry/svelte';

Sentry.init({/*...*/})

// /** @type {import('@sveltejs/kit').HandleClientError} */
// export async function handleError({ error, event }) {
// 	const errorId = crypto.randomUUID();
// 	// example integration with https://sentry.io/
// 	Sentry.captureException(error, { extra: { event, errorId } });

// 	return {
// 		message: 'Whoops!',
// 		errorId
// 	};
// }

import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch = (async ({ request, fetch }) => {
    console.log('HOOK FETCH????');    
    return fetch(request);
}) satisfies HandleFetch;