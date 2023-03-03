<script lang="ts">
	import type { ImageItem } from "../common";
	import { applicationStore, imagesStore } from "../stores";
	import ImageTile from "./ImageTile.svelte";

    let images: ImageItem[] = [];

   $: if( $imagesStore.length > ($applicationStore.currentPage - 1) * $applicationStore.itemsPerPage ) {
        // TODO: Refactor this
        images = $imagesStore.slice(($applicationStore.currentPage - 1) * $applicationStore.itemsPerPage, $applicationStore.currentPage * $applicationStore.itemsPerPage);
    }
    
</script>
<div class="gallery">
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
        grid-template-columns: repeat(auto-fill, 200px);
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
            grid-template-columns: repeat(auto-fill, 150px);
        }
    }
</style>