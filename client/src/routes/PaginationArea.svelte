<script lang="ts">
    import { applicationStore } from "../stores";

    let currentPage: number = 1;
    let totalPages: number = 1;

    $: currentPage = $applicationStore.currentPage;
    $: totalPages = $applicationStore.totalPages;

    function handlePrevClick() {
       applicationStore.update(store => {
           store.currentPage = store.currentPage - 1;
           return store;
       });
    }

    function handleNextClick() {
        applicationStore.update(store => {
            store.currentPage = store.currentPage + 1;
            return store;
        });
    }

    function handleFirstClick() {
        applicationStore.update(store => {
            store.currentPage = 1;
            return store;
        });
    }

    function handleLastClick() {
        applicationStore.update(store => {
            store.currentPage = store.totalPages;
            return store;
        });
    }
</script>

<div class="pagination-area">
    <div class="container">
        <button on:click={handleFirstClick}> First </button>
        <div>
            {#if currentPage > 1}
            <button on:click={handlePrevClick}> Prev </button>
            <button on:click={handlePrevClick}> {currentPage - 1} </button>
            {/if}

            <button> {currentPage} </button>

            {#if currentPage < totalPages}
                <button on:click={handleNextClick}> {currentPage + 1} </button>
                <button on:click={handleNextClick}> Next </button>
            {/if}
        </div>
        <button on:click={handleLastClick}> Last </button>
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
    }

    button {
        padding: 0.5em 1em;
        border: 1px solid #ccc;
        border-radius: 0.25em;
    }

    button:hover {
        background-color: #ccc;
    }

    @media (max-width: 640px) {
        .pagination-area {
            margin-top: 10px;
            padding: 0px;
        }

        button {
            font-size: small;
        }
    }
</style>