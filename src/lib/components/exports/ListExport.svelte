<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';

	const PAGE_PADDING = 50; // px

	let { data, title, description, hideRandomly, hiddenColumns, randomlyHiddenCount, tab } =
		$props();

	let pageContainerEl: HTMLElement;

	let columnNames = $derived(Object.keys(data[0]));

	function pickRandomElements(arr: any[], n: number) {
		const shuffled = [...arr];

		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		return shuffled.slice(0, Math.min(n, shuffled.length));
	}

	function renderPages() {
		const createPageEl = () => {
			const pageEl = document.createElement('div');

			pageEl.classList.add('page', 'list-export');

			return pageEl;
		};

		const createTitleEl = (title: string) => {
			const titleEl = document.createElement('h1');

			titleEl.classList.add('list-export');
			titleEl.textContent = title;

			return titleEl;
		};

		const createDescriptionEl = (description: string) => {
			const descriptionEl = document.createElement('p');

			descriptionEl.classList.add('list-export');
			descriptionEl.textContent = description;

			return descriptionEl;
		};

		const createHeaderEl = (columnNames: string[]) => {
			const headerEl = document.createElement('div');
			headerEl.classList.add('row', 'header', 'list-export');

			for (let i = 0; i < columnNames.length; i++) {
				const cellEl = document.createElement('div');
				cellEl.classList.add('cell');

				cellEl.textContent = columnNames[i];

				headerEl.appendChild(cellEl);
			}

			return headerEl;
		};

		const createRowEl = (entry: { [column: string]: string }) => {
			const rowEl = document.createElement('div');
			rowEl.classList.add('row', 'list-export');

			const columnNames = Object.keys(entry);

			let randomlyHiddenColumns = new Set();
			if (hideRandomly) {
				const allColumnIndexes = Array.from({ length: Object.keys(data[0]).length }, (_, i) => i);
				randomlyHiddenColumns = new Set(pickRandomElements(allColumnIndexes, randomlyHiddenCount));
			}

			for (let i = 0; i < columnNames.length; i++) {
				const cellEl = document.createElement('div');
				cellEl.classList.add('cell');

				const hidden = hideRandomly ? randomlyHiddenColumns.has(i) : hiddenColumns.has(i);

				if (hidden) {
					cellEl.classList.add('hidden');
				} else {
					cellEl.textContent = entry[columnNames[i]];
				}

				rowEl.appendChild(cellEl);
			}

			return rowEl;
		};

		let currentPageEl = createPageEl();
		pageContainerEl.appendChild(currentPageEl);

		let pageHeight = currentPageEl.offsetHeight;
		let contentHeight = 0;

		if (title) {
			const titleEl = createTitleEl(title);
			currentPageEl.appendChild(titleEl);

			contentHeight += titleEl.offsetHeight;
		}

		if (description) {
			const descriptionEl = createDescriptionEl(description);
			currentPageEl.appendChild(descriptionEl);

			contentHeight += descriptionEl.offsetHeight;
		}

		const headerEl = createHeaderEl(columnNames);
		currentPageEl.appendChild(headerEl);

		contentHeight += headerEl.offsetHeight;

		for (let i = 0; i < data.length; i++) {
			const entry = data[i];

			const rowEl = createRowEl(entry);

			currentPageEl.appendChild(rowEl);
			contentHeight += rowEl.offsetHeight;

			console.log({ contentHeight, pageHeight });

			if (contentHeight > pageHeight - PAGE_PADDING * 2) {
				currentPageEl = createPageEl();
				pageContainerEl.appendChild(currentPageEl);

				pageHeight = currentPageEl.offsetHeight;

				contentHeight = 0;

				const headerEl = createHeaderEl(columnNames);
				currentPageEl.appendChild(headerEl);

				contentHeight += headerEl.offsetHeight;

				rowEl.remove();

				currentPageEl.appendChild(rowEl);
				contentHeight += rowEl.offsetHeight;
			}
		}
	}

	function handlePrint() {
		tab.window.print();
	}

	// Temporary and unstable solution.
	// Since this is usually mounted from another tab, the new tab might be open yet, when this runs.
	// This result in incorrect offset heights and hence incorrect layouts altogether.
	onMount(() => setTimeout(renderPages, 500));
</script>

<div
	class="page-container"
	bind:this={pageContainerEl}
	style="--page-padding: {PAGE_PADDING}px; --column-count: {columnNames.length}"
></div>

<button class="button primary print-button" onclick={handlePrint}>Drucken/PDF (Strg + P)</button>

<style>
	.page-container {
		display: flex;
		width: 100%;
		align-items: center;
		flex-direction: column;
		background-color: #dddddd;
		padding: 20px;
		gap: 10px;
		min-height: 100vh;
		height: auto;
	}

	.print-button {
		position: fixed;
		right: 20px;
		font-size: var(--text-lg);
		bottom: 20px;
	}

	:global(*.list-export) {
		margin: 0 !important;
	}

	:global(.page.list-export) {
		width: 210mm;
		height: 297mm;
		background-color: white;
		box-shadow: 0 0 10px darkgray;
		padding: var(--page-padding);
		overflow: hidden;
		flex-shrink: 0;
	}

	:global(h1.list-export) {
		padding-bottom: 10px;
	}

	:global(p.list-export) {
		padding-bottom: 30px;
	}

	:global(.row.list-export) {
		display: grid;
		grid-template-columns: repeat(var(--column-count), 1fr);
		gap: 20px;
		align-items: start;
		padding-bottom: 5px;
	}

	:global(.row.header.list-export) {
		font-weight: bold;
		padding-bottom: 10px;
	}

	:global(.row.list-export .cell) {
		display: flex;
		align-self: stretch;
	}

	:global(.row.list-export .cell.hidden) {
		min-height: var(--text-lg);
		border-bottom: 1px solid var(--color-text);
	}

	@media print {
		@page {
			size: A4 portrait;
			margin: 0;
		}

		:global(html, body) {
			width: 210mm;
			height: 297mm;
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		.page-container {
			display: block;
			padding: 0;
		}

		.print-button {
			display: none;
		}

		:global(.page.list-export) {
			box-shadow: none;
		}
	}
</style>
