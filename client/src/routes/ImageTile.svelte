<script lang="ts">
    export let src: string = '';
    export let name: string = '';
    export let prompt: string = '';
    
    let show: boolean = false;

    function onShowClick() {
        show = !show;
    }
</script>

<div class="relative block max-w-sm p-1 mt-1 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" class:show={show}>
    {#if show}
        <div class="prompt overflow-y-auto">
            {#if prompt}
                <p>{prompt}</p>
            {:else}
                <p>Still processing. Check later.</p>
            {/if}
        </div>
    {:else}
        <img alt={prompt} {src} >
    {/if}
    <div class="metadata mt-2">
        <p class="truncate">{name}</p>
        <div class="actions flex items-center justify-center">
            <button on:click={onShowClick} class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800">
                {#if show}
                    Hide
                {:else}
                    Text
                {/if}
            </button>
        </div>
    </div>
</div>

<style>

    img {
        aspect-ratio: auto;
    }

    .prompt, img {
        width: 200px;
        height: 200px;
    }

    .metadata {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    p {
        flex-grow: 1;
        margin: 0px;
    }

    .metadata p {
        max-width: 150px;
    }

    @media (max-width: 640px) {
        img, .prompt {
            width: 150px;
            height: 150px;
        }

        .metadata {
            width: 150px;
            font-size: small;
        }
    }


</style>