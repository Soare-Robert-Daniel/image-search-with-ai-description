<script lang="ts">
	import { applicationStore } from "../stores";
	import { serverName } from "../utils";

    let hasFileToLoad = false;
    let loadedFilesCount = 0;
    let totalFilesToLoad = 0;
    let files: FileList | null = null;
    let input: HTMLInputElement;

    function sendFile(file: File) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            fetch('https://chimeinapp.net/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: file.name,
                    data: reader.result
                })
            }).then((response) => {
                loadedFilesCount++;
                if( loadedFilesCount === totalFilesToLoad ) {
                    hasFileToLoad = false;
                    input.value = '';
                    $applicationStore.refreshStatus = "start";
                }
            }).catch((error) => {
                console.error('Error:', error);
                hasFileToLoad = false;
            })
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
            hasFileToLoad = false;
        };
    }

    function onSubmit() {
        if( !files || files.length === 0 ) {
            return;
        }

        totalFilesToLoad = files.length;
        loadedFilesCount = 0;
        hasFileToLoad = true;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            sendFile(file);
        }
    }
</script>

<div class="mt-2 w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="multiple_files">Upload images</label>
    <input bind:this={input} bind:files accept="image/*" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="multiple_files" type="file">
    <button disabled={hasFileToLoad} type="button" on:click={onSubmit} class="mt-1 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
        {#if hasFileToLoad}
            Loading...
        {:else}
            Upload
        {/if}
    </button>
</div>