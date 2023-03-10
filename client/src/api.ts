import type { ImageItem } from "./common";

const HOST = 'https://chimeinapp.net';

/**
 * Get all the images from the server.
 * @returns An array of image items.
 */
export async function getImages(): Promise<{ total: number, documents: ImageItem[]}> {
    const response = await fetch(`${HOST}`);
    return await response.json();
}


/**
* This function searches for images based on the search term.
* @param search The search term.
* @returns An array of image items.
*/
export async function searchImages(search: string): Promise<{ total: number, documents: ImageItem[]}> {
    const response = await fetch(`${HOST}/search?${new URLSearchParams({ query: search })}`);
    return await response.json();
}

export default { getImages };