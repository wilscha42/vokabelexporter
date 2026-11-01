<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();

	let exportTitle = $derived(page.data.exportTitle);
</script>

<svelte:head>
	<title>Export: {exportTitle} - Vokabelexporter</title>
</svelte:head>

<header>
	<div class="centered">
		<h1>Export: {exportTitle}</h1>

		<a href={resolve('/')}>Zurück zur Startseite</a>
	</div>
</header>

{@render children()}

<style>
	header {
		background-color: var(--color-surface);
		width: 100%;
	}

	h1 {
		margin-bottom: 10px;
	}
</style>
