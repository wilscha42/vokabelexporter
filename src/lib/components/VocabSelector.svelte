<script lang="ts">
	import { readCSV, type CSVData } from '#lib/shared/readCSV.ts';
	import Checkbox from './Checkbox.svelte';

	let { onchange = () => {} }: { onchange?: (selectedData: CSVData) => void } = $props();

	let file: File | null = $state(null);
	let data: CSVData = $state([]);
	let selectedEntries: Set<number> = $state(new Set());
	let selectedColumns: Set<number> = $state(new Set());
	let expandedView = $state(false);

	let fileInputEl: HTMLInputElement;

	$effect(() => {
		updateData(file);
	});

	$effect(() => {
		if (data.length > 0) selectAllEntriesAndColumns();
	});

	$effect(() => {
		const selectedData = getSelectedData(data, selectedEntries, selectedColumns);

		onchange(selectedData);
	});

	async function updateData(file: File | null) {
		data = file ? await readFile(file) : [];
	}

	function selectAllEntriesAndColumns() {
		const allEntryIndexes = Array.from({ length: data.length }, (_, i) => i);
		const allColumnIndexes = Array.from({ length: Object.keys(data[0]).length }, (_, i) => i);
		selectedEntries = new Set(allEntryIndexes);
		selectedColumns = new Set(allColumnIndexes);
	}

	async function readFile(file: File) {
		const fileContent = (await new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				const content = e.target?.result;
				if (typeof content === 'string') {
					resolve(content);
				} else {
					reject(new Error('Failed to read file as text.'));
				}
			};

			reader.onerror = (error) => {
				reject(error);
			};

			reader.readAsText(file);
		})) as string;

		return readCSV(fileContent);
	}

	function getSelectedData(
		data: CSVData,
		selectedEntries: Set<number>,
		selectedColumns: Set<number>
	): CSVData {
		let selectedColumnNames = [];
		if (data.length > 0) {
			const columns = Object.keys(data[0]);

			for (let index = 0; index < columns.length; index++) {
				if (selectedColumns.has(index)) {
					selectedColumnNames.push(columns[index]);
				}
			}
		}

		return data
			.filter((_, index) => {
				return selectedEntries.has(index);
			})
			.map((entry) => {
				const filteredEntry = {} as { [column: string]: string };

				for (let i = 0; i < selectedColumnNames.length; i++) {
					const columnName = selectedColumnNames[i];

					filteredEntry[columnName] = entry[columnName];
				}

				return filteredEntry;
			});
	}

	function handleFileChange(e: Event) {
		const files = (e.currentTarget! as HTMLInputElement).files;

		if (files && files.length == 1) {
			const selectedFile = files[0];

			file = selectedFile;
		}
	}

	function uploadFile() {
		fileInputEl.click();
	}

	function clearFile() {
		file = null;
	}

	function toggleEntrySelection(index: number) {
		if (selectedEntries.has(index)) {
			selectedEntries.delete(index);
		} else {
			selectedEntries.add(index);
		}

		// so it updates it's reactive state
		selectedEntries = new Set(selectedEntries);
	}

	function toggleAllEntriesSelected() {
		const entryCount = data.length;

		if (selectedEntries.size == entryCount) {
			selectedEntries = new Set();
		} else {
			const allIndexes = Array.from({ length: entryCount }, (_, i) => i);

			selectedEntries = new Set(allIndexes);
		}
	}

	function toggleColumnSelection(index: number) {
		if (selectedColumns.has(index)) {
			selectedColumns.delete(index);
		} else {
			selectedColumns.add(index);
		}

		// so it updates it's reactive state
		selectedColumns = new Set(selectedColumns);
	}

	function toggleExpandedView() {
		expandedView = !expandedView;
	}
</script>

<div class="vocab-selector" class:expanded={expandedView}>
	<div class="selector-header">
		<input class="hidden-input" bind:this={fileInputEl} type="file" onchange={handleFileChange} />

		<div>
			{#if file}
				<button class="button" disabled={!file} onclick={clearFile}>Datei schließen</button>
			{:else}
				<button class="button primary" onclick={uploadFile}>Datei auswählen</button>
			{/if}

			{#if file}
				<span class="file-name">
					{file.name}
				</span>
			{/if}
		</div>

		<button class="button" onclick={toggleExpandedView}>
			{#if expandedView}
				Zurück
			{:else}
				Größere Ansicht
			{/if}
		</button>
	</div>

	<div class="list-container">
		{#if data.length > 0}
			<div class="row header">
				{#each Object.keys(data[0]) as columnName, index}
					{@const selected = selectedColumns.has(index)}

					<div class="cell" class:column-selected={selected}>
						{columnName}

						<Checkbox checked={selected} onchange={() => toggleColumnSelection(index)} />
					</div>
				{/each}
			</div>

			{#each data as entry, index}
				{@const selected = selectedEntries.has(index)}

				<div class="row" class:selected>
					<Checkbox checked={selected} onchange={() => toggleEntrySelection(index)} />

					<div class="checkbox-margin-separator"></div>

					{#each Object.keys(entry) as column, index}
						<div class="cell" class:not-selected={!selectedColumns.has(index)}>{entry[column]}</div>
					{/each}
				</div>
			{/each}

			<button class="button primary select-all-button" onclick={toggleAllEntriesSelected}>
				{#if selectedEntries.size === data.length}
					Alle Einträge abwählen
				{:else}
					Alle Einträge auswählen
				{/if}
			</button>
		{:else}
			<span class="no-file-placeholder"> Keine Datei ausgewählt. </span>
		{/if}
	</div>
</div>

<style>
	.vocab-selector {
		width: 100%;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: 10;
	}

	.vocab-selector.expanded {
		position: fixed;
		inset: 0;
		border: none;
		border-radius: 0;
	}

	.vocab-selector.expanded .list-container {
		max-height: none;
		flex-grow: 1;
	}

	.selector-header {
		border-bottom: 1px solid var(--color-border);
		padding: 10px;
		display: flex;
		justify-content: space-between;
		gap: 10px;
		align-items: center;
	}

	.hidden-input {
		display: none;
	}

	.file-name {
		font-size: var(--text-md);
		font-weight: bold;
	}

	.list-container {
		min-height: 200px;
		max-height: 300px;
		overflow: scroll;
	}

	.select-all-button {
		position: absolute;
		bottom: 10px;
		right: 10px;
	}

	.list-container:has(.no-file-placeholder) {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-container);
	}

	.row {
		display: flex;
		padding: 5px;
		min-width: 100%;
		width: fit-content;

		--checkbox-margin: 10px;
	}

	.checkbox-margin-separator {
		margin-left: var(--checkbox-margin);
	}

	.row.header {
		position: sticky;
		top: 0;
		border-bottom: 1px solid var(--color-border);
		font-weight: bold;
		background-color: var(--color-container);
		z-index: 1;
		padding-left: calc(5px + var(--checkbox-size) + var(--checkbox-margin));
	}

	.row.header .cell {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.row:nth-child(odd) {
		background-color: var(--color-container);
	}

	.row.selected {
		background-color: var(--color-surface-primary);
	}

	.row.selected:nth-child(odd) {
		background-color: var(--color-container-primary);
	}

	.cell {
		min-width: 200px;
		max-width: 200px;
	}

	.cell:last-child {
		max-width: none;
	}

	.cell.not-selected {
		opacity: 0.5;
	}

	.no-file-placeholder {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
</style>
