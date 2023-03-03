import type { ImageItem } from "./common";

export function generateFakeImageDataset(length: number): ImageItem[] {
    const result: ImageItem[] = [];
    for (let i = 0; i < length; i++) {
        result.push({
            id: i,
            src: `https://picsum.photos/200/300?random=${i}`, // Ma intreb de unde a mai scos Copilot asta :)),
            name: `Image ${i}`,
            prompt: `Image ${i} prompt. Lorem ipsilum asdf asdf asf adsf adsf adsf asf `,
        });
    }
    return result;
}

export default { generateFakeImageDataset }