import type { ImageItem } from "./common";

const HOST = 'http://localhost:9000';

export async function getImages(): Promise<ImageItem[]> {
    const response = await fetch(`${HOST}`);
    return await response.json() as ImageItem[];
}

export default { getImages };