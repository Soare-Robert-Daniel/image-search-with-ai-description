<script lang="ts">
	import { onMount } from "svelte";
	import { getImages } from "../api";
	import type { ImageItem } from "../common";
	import { applicationStore, imagesStore } from "../stores";
	import ImageTile from "./ImageTile.svelte";

    let images: ImageItem[] = [];

    $: if( $imagesStore.length > ($applicationStore.currentPage) * $applicationStore.itemsPerPage ) {
        // TODO: Refactor this
        images = $imagesStore.slice(($applicationStore.currentPage) * $applicationStore.itemsPerPage, ($applicationStore.currentPage + 1) * $applicationStore.itemsPerPage);
    }

    onMount(() => {
        getImages().then((result) => {
            try {
                imagesStore.set( result?.documents ?? []);

                if( result?.total > 0 ) {
                    $applicationStore.searchStatus = "success";
                } else {
                    $applicationStore.searchStatus = "no-results";
                }
            } catch(e) {
                console.error(e);
                $applicationStore.searchStatus = "error";
            }
        })
    });
    
</script>
<div class="gallery p-2 max-w-4xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div class="container">
        {#each images as image}
            <ImageTile name={image.name} src={image.src} prompt={image.prompt} />
        {/each}
     </div>
</div>

<style>

    .gallery {
        margin: 1rem;
        width: 100%;
        display: flex;
        justify-content: center;
        
    }

    .container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 210px);
        grid-gap: 10px;
        justify-content: center;
        justify-items: center;
    }
    
    @media (max-width: 640px) {
        .gallery {
            padding: 0px;
            margin: 0px;
        }

        .container {
            grid-template-columns: repeat(auto-fill, 160px);
        }
    }
</style>