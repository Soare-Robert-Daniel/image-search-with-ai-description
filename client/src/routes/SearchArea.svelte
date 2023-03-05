<script lang="ts">
	import { searchImages } from "../api";
	import { applicationStore, imagesStore } from "../stores";


    let searchTerm: string = '';

    function search() {
       $applicationStore.searchStatus = "searching"; 

       if( searchTerm.length === 0 ) {
           return;
       }

       searchImages(searchTerm).then((result) => {
            try {
                console.log(`Search term: ${searchTerm}. Response:`, result);

                const images = result?.documents ?? [];
                // sort images by score (descending)
                images.sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0));

                imagesStore.set( images );

                if( result?.total > 0 ) {
                    $applicationStore.searchStatus = "success";
                    $applicationStore.currentPage = 0;
                } else {
                    $applicationStore.searchStatus = "no-results";
                }
            } catch(e) {
                console.error(e);
                $applicationStore.searchStatus = "error";
            }
        })
    }

</script>

<div class="w-full max-w-4xl p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">Image <span class="text-blue-600 dark:text-blue-500">smart</span> search</h1>
    <div class="field w-full flex items-center justify-center gap-4 sm:flex-col">
        <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" bind:value={searchTerm} type="search" placeholder="Search" />
        <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" on:click={search}>Search</button>
    </div>
    <div class="result mt-1">
        <p class="">
            {#if $applicationStore.searchStatus === "searching"}
            Searching...
        {:else if $applicationStore.searchStatus === "success"}
            Found {$imagesStore.length} results
        {:else if $applicationStore.searchStatus === "no-results"}
            No results found
        {:else if $applicationStore.searchStatus === "error"}
            Error. Check console for details.
        {/if}
        </p>
    </div>
</div>

<style>

    .search-area {
        margin: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.1);
        padding: 10px;

        position: sticky;
        top: 0;
        z-index: 10;
    }

    input {
        min-width: 400px;
        max-width: 800px;
    }


    .result {
        display: flex;
        justify-content: center;
    }

    @media (max-width: 640px) {
        input {
            min-width: unset;
            width: 100%;
        }

        .field {
            flex-direction: column;
        }
    }
</style>