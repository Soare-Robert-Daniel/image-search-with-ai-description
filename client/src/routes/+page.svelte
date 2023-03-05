<script>
	import SearchArea from './SearchArea.svelte';
	import GalleryArea from './GalleryArea.svelte';
	import PaginationArea from './PaginationArea.svelte';
	import LoadArea from './LoadArea.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Image Search App" />
</svelte:head>

<section>
	<SearchArea />
	<LoadArea />
	<GalleryArea />
	<PaginationArea />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
