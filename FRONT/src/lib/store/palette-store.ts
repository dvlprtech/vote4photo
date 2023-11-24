// import { SERVER_URL_BASE } from "$lib/environment";
// import type { ColorPalette } from "$lib/mm-domain.ts";
// import { error } from "@sveltejs/kit";

// const r = await fetch(`${SERVER_URL_BASE}/api/palette/json`);
// if (r.status !== 200) {
//     const err = await r.json();
//     const msg = err.message || JSON.stringify(err);
//     throw error(r.status, `Failed to load default palette: ${msg}`);    
// }
// export const defaultPalette = await r.json() as ColorPalette[];

// export const paletteColorByHex : Map<string, ColorPalette> = defaultPalette.reduce((map, color) => {
//     map.set(color.hex, color);
//     return map;
// }, new Map());