<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import SearchArea from './SearchArea.svelte';
	import GalleryArea from './GalleryArea.svelte';
	import PaginationArea from './PaginationArea.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Image Search App" />
</svelte:head>

<section>
	<SearchArea />
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
