import { writable } from 'svelte/store';
import { generateFakeImageDataset } from './utils';

export const imagesStore = writable(generateFakeImageDataset(100));

export const applicationStore = writable({
    itemsPerPage: 15,
    currentPage: 1,
    totalPages: 10,
    viewImage: -1
});