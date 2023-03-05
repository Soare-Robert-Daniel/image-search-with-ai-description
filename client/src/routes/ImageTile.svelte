<script lang="ts">
    export let src: string = '';
    export let name: string = '';
    export let prompt: string = '';
    
    let show: boolean = false;

    function onShowClick() {
        show = !show;
    }
</script>

<div class="relative block max-w-sm p-1 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" class:show={show}>
    {#if show}
        <div class="prompt overflow-y-auto">
            <p>{prompt}</p>
        </div>
    {:else}
        <img alt={prompt} {src} >
    {/if}
    <div class="metadata mt-2">
        <p>{name}</p>
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

    .btn-show {
        background-color: white;
        font-size: small;
        border: none;
        border-radius: 5px;
        padding: 5px;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .btn-show:hover {
        background-color: #ccc;
    }

    .overlay {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 200px;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 5px;
        box-sizing: border-box;

        color: white;

        overflow-y: auto;
    }

    @media (max-width: 640px) {
        .img-box {
            background: #ccc;
        }

        img, .overlay {
            width: 150px;
            height: 150px;
        }

        .metadata {
            width: 150px;
            font-size: small;
        }

        .overlay {
            font-size: small;
        }
    }
</style>