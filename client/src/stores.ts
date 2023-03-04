import { writable, type Writable } from 'svelte/store';
import type { ImageItem } from './common';
import { generateFakeImageDataset } from './utils';

export const imagesStore: Writable<ImageItem[]> = writable([]);

export const applicationStore = writable({
    itemsPerPage: 15,
    currentPage: 1,
    totalPages: 10,
    viewImage: -1
});