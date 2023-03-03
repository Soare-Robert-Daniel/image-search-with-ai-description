import type { ImageItem } from "./common";

export function generateFakeImageDataset(length: number): ImageItem[] {
    const result: ImageItem[] = [];
    for (let i = 1; i <= length; i++) {
        result.push({
            id: i,
            src: `http://localhost:9000/images/image-${i}.jpg`, // Ma intreb de unde a mai scos Copilot asta :)),
            name: `Image ${i}`,
            prompt: `Image ${i} prompt. Lorem ipsilum asdf asdf asf adsf adsf adsf asf `,
        });
    }
    return result;
}

export function getImagesFromServer(): Promise<ImageItem[]> {
    return fetch('http://localhost:9000/images')
        .then(response => response.json())
        .then(data => data as ImageItem[]);
}

export default { generateFakeImageDataset }