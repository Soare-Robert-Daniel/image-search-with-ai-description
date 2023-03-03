<script lang="ts">
    let searchTerm: string = '';

    function search() {
        console.log(`Search: ${searchTerm}`);
    }
</script>

<div class="search-area">
    <div class="field">
        <input bind:value={searchTerm} type="search" placeholder="Search" />
        <button on:click={search}>Search</button>
    </div>
</div>

<style>

    .search-area {
        margin: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
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