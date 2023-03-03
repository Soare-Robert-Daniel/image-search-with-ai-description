<script lang="ts">
    export let src: string = '';
    export let name: string = '';
    export let prompt: string = '';
    
    let show: boolean = false;

    function onShowClick() {
        show = !show;
    }
</script>

<div class="img-box" class:show={show}>
    {#if show}
        <div class="overlay">
            <p>{prompt}</p>
        </div>
    {/if}
    <img alt={prompt} {src} >
    <div class="metadata">
        <p>{name}</p>
        <div class="actions">
            <button on:click={onShowClick} class="btn-show">
                {#if show}
                    Hide
                {:else}
                    Show
                {/if}
            </button>
        </div>
    </div>
</div>

<style>
    .img-box {
        display: flex;
        flex-direction: column;
        gap: 0px;

        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
        position: relative;
    }

    img {
        width: 200px;
        height: 200px;
        aspect-ratio: auto;
    }

    .metadata {
        width: 100%;

        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        
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