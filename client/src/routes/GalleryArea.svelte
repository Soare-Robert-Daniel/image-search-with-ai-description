<script lang="ts">
	import { onMount } from "svelte";
	import { getImages } from "../api";
	import type { ImageItem } from "../common";
	import { applicationStore, imagesStore } from "../stores";
	import ImageTile from "./ImageTile.svelte";

    let images: ImageItem[] = [];
    let refreshCount: number = 0;
    let interval: any = null;

    $: if( $imagesStore.length > ($applicationStore.currentPage) * $applicationStore.itemsPerPage ) {
        images = $imagesStore.slice(($applicationStore.currentPage) * $applicationStore.itemsPerPage, ($applicationStore.currentPage + 1) * $applicationStore.itemsPerPage);
    }

    $: if( $applicationStore.refreshStatus === "start" ) {
        refreshCount = 15;
        $applicationStore.refreshStatus = "ongoing";
        interval = setInterval(() => {
            refreshCount--;
            if( refreshCount === 0 ) {
                clearInterval(interval);
                $applicationStore.refreshStatus = "end";
            }
        }, 1000);
    }

    $: if( $applicationStore.refreshStatus === "end" ) {
        getImages().then((result) => {
            try {
                imagesStore.set( result?.documents ?? []);
            } catch(e) {
                console.error(e);
               
            } finally {
                clearInterval(interval);
                $applicationStore.refreshStatus = "idle";
            }
        })
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

<div class="w-full mt-2 flex justify-center items-center flex-col">
    {#if $applicationStore.refreshStatus === "ongoing"}
        <div class="mt-1 flex justify-center items-center">
            <div class="flex flex-col items-center">
                <div class="text-sm text-gray-700 dark:text-gray-200">Auto-Refreshing in {refreshCount} seconds</div>
            </div>
        </div>
    {/if}
    <div class="gallery mt-2 p-2 sm:p-1 max-w-4xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="container">
            {#each images as image}
                <ImageTile name={image.name} src={image.src} prompt={image.prompt} />
            {/each}
         </div>
    </div>
    
</div>

<style>

    .gallery {
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
            grid-template-columns: repeat(auto-fill, 150px);
        }
    }
</style>