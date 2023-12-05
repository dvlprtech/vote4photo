export const ssr = false;
import { get, writable, type Invalidator } from "svelte/store";

const localStorage = (typeof window !== 'undefined' ? window.localStorage : null) as Storage | null;
/**
 * Only for browser
 * 
 * @param data 
 * @returns 
 */
export function persistent<T>(key: string, data: T) {
   const store = writable<T>(data);
   const { subscribe, set } = store;

   let jsonData : string | null | undefined;
   if (data === undefined || data === null) {
    jsonData = localStorage?.getItem(key);    
    if (jsonData) {
        data = JSON.parse(jsonData);
    }
   } else {
    jsonData = JSON.stringify(data);
    localStorage?.setItem(key, jsonData);
   }
   set(data);

   return {
      subscribe,
      set: (n: T) => {
         localStorage?.setItem(key, JSON.stringify(n));
         set(n);
      },
      update: (cb :  (value?: T) => T) => {
         const updatedStore = cb(get(store));

         localStorage?.setItem(key, JSON.stringify(updatedStore));
         set(updatedStore);
      }
   };
}

