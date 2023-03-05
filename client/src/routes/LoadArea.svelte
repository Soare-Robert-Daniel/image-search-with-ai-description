<script lang="ts">

    function sendFile(file: File) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            fetch('http://localhost:9000/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: file.name,
                    data: reader.result
                })
            })
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    function onSubmit() {
        const files = (document.querySelector("#multiple_files") as HTMLInputElement)?.files;
        
        if( ! files ) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            sendFile(file);
        }
    }
</script>

<div class="m-2 w-full max-w-4xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="multiple_files">Upload multiple files</label>
    <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="multiple_files" type="file" multiple>
    <button type="button" on:click={onSubmit} class="mt-1 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Send</button>
</div>