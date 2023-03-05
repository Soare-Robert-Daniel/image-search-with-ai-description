<script lang="ts">
    import { applicationStore, imagesStore } from "../stores";

    let currentPage: number = 1;
    let totalPages: number = 1;

    $: currentPage = $applicationStore.currentPage;
    $: totalPages = $applicationStore.totalPages;

    function goToPrevPage() {
       applicationStore.update(store => {
           store.currentPage = Math.max(0, store.currentPage - 1);
           return store;
       });
    }

    function goToNextPage() {
        applicationStore.update(store => {
            store.currentPage = Math.min(store.currentPage + 1, Math.round( $imagesStore.length / store.itemsPerPage - 1)) ;
            return store;
        });
    }
</script>

<div class="pagination-area">
    <div class="flex flex-col items-center">
        <!-- Help text -->
        <span class="text-sm text-gray-700 dark:text-gray-400">
            Showing <span class="font-semibold text-gray-900 dark:text-white"> {$applicationStore.currentPage * $applicationStore.itemsPerPage}</span> to <span class="font-semibold text-gray-900 dark:text-white">{Math.min(($applicationStore.currentPage + 1) * $applicationStore.itemsPerPage, $imagesStore.length)}</span> of <span class="font-semibold text-gray-900 dark:text-white">{$imagesStore.length}</span> Entries
        </span>
        <div class="inline-flex mt-2 xs:mt-0">
          <!-- Buttons -->
          <button on:click={goToPrevPage} class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <svg aria-hidden="true" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>
              Prev
          </button>
          <button on:click={goToNextPage} class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              Next
              <svg aria-hidden="true" class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
      </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
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