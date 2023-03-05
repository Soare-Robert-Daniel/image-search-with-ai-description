import 'flowbite';
import { writable, type Writable } from 'svelte/store';
import type { ImageItem } from './common';

export const imagesStore: Writable<ImageItem[]> = writable([]);

export const applicationStore = writable({
    itemsPerPage: 15,
    currentPage: 0,
    totalPages: 10,
    viewImage: -1,
    searchStatus: 'idle',
});