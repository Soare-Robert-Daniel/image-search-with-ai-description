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
                imagesStore.set( result?.documents?.map(x => x.value) ?? []);

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
    }

</script>

<div class="search-area">
    <div class="field">
        <input bind:value={searchTerm} type="search" placeholder="Search" />
        <button on:click={search}>Search</button>
    </div>
    <div class="result">
        <p>
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

    .field {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 500px;
    }

    .field input {
        width: 100%;
        padding: 0.5em;
        border: 1px solid #ccc;
        border-right: 0;
        border-top-left-radius: 0.25em;
        border-bottom-left-radius: 0.25em;
    }

    .field button {
        padding: 0.5em;
        border: 1px solid #ccc;
        border-left: 0;
        border-top-right-radius: 0.25em;
        border-bottom-right-radius: 0.25em;
    }

    .result {
        display: flex;
        justify-content: center;
    }

    @media (max-width: 640px) {
        .search-area {
            padding: 0px;
        }

        .field {
            flex-direction: row;
            min-width: 0;
            width: 100%;
        }
    }
</style>