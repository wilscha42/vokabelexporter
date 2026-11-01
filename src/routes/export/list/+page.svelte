<script lang="ts">
	import Checkbox from '#lib/components/Checkbox.svelte';
	import Counter from '#lib/components/Counter.svelte';
	import ListExport from '#lib/components/exports/ListExport.svelte';
	import Textfield from '#lib/components/Textfield.svelte';
	import VocabSelector from '#lib/components/VocabSelector.svelte';
	import { type CSVData } from '#lib/shared/readCSV.ts';
	import { mount } from 'svelte';

	let data: CSVData = $state([]);
	let exportOptions = $state({
		title: '',
		description: '',
		hideRandomly: false,
		randomlyHiddenCount: 1,
		hiddenColumns: new Set()
	});

	let sufficientDataSelected = $derived(data.length > 0 && Object.keys(data[0]).length > 0);

	async function handleExport() {
		const newTab = window.open('', '_blank');

		if (!newTab) return;

		const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${exportOptions.title || 'Vokabeln'}</title>	
</head>
<body>

</body>
</html>
		`;

		newTab.document.write(HTML_TEMPLATE);

		// copy styles from svelte injected into head
		const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));

		stylesheets.forEach((stylesheet) => {
			newTab.document.head.appendChild(stylesheet.cloneNode(true));
		});

		await mount(ListExport, {
			target: newTab.document.body,
			props: { data, ...exportOptions, tab: newTab }
		});
	}

	function toggleColumnHidden(index: number) {
		if (exportOptions.hiddenColumns.has(index)) {
			exportOptions.hiddenColumns.delete(index);
		} else {
			exportOptions.hiddenColumns.add(index);
		}

		exportOptions.hiddenColumns = new Set(exportOptions.hiddenColumns);
	}

	function onchange(selectedData: CSVData) {
		data = selectedData;
	}
</script>

<main>
	<div class="centered">
		<h2>1. Datei und Vokabeln auswählen</h2>

		<p>
			Wähle die <b>.csv-Datei</b> aus, die Deine Vokabeln beinhaltet. Anschließend kannst Du bestimmen,
			welche dieser Vokabeln exportiert werden (standardmäßig alle).
		</p>

		<VocabSelector {onchange} />

		<h2>2. Optionen anpassen</h2>

		<p>Nun kannst Du das Dokument vor dem Export noch anpassen.</p>

		{#if sufficientDataSelected}
			<Textfield label="Titel (optional)" bind:value={exportOptions.title} />

			<Textfield label="Beschreibung (optional)" bind:value={exportOptions.description} multiLine />

			<span class="label hidden-columns-label">Lücken</span>

			<p class="hide-description">
				Spalten, für die hier ein Häkchen gesetzt wird, werden als Lücke („_________“) angezeigt.
				Alternativ platziert die Option <i>„Zufällige Lücken“</i> Lücken in zufälligen Spalten pro Zeile.
			</p>

			<Checkbox label="Zufällige Lücken" bind:checked={exportOptions.hideRandomly} />

			{@const columnNames = Object.keys(data[0])}

			{#if exportOptions.hideRandomly}
				<br class="counter-margin" />

				<Counter
					bind:value={exportOptions.randomlyHiddenCount}
					label="Anzahl der Lücken pro Zeile"
					min={1}
					max={columnNames.length}
				/>
			{:else}
				<div class="column-options">
					{#each columnNames as column, index}
						<div class="column-option-row">
							{column}
							<div>
								<Checkbox
									checked={exportOptions.hiddenColumns.has(index)}
									onchange={() => toggleColumnHidden(index)}
									disabled={exportOptions.hideRandomly}
								/>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{:else}
			<p><b><i>Bitte wähle zunächst mindestens einen Eintrag aus!</i></b></p>
		{/if}

		<h2>3. Exportieren</h2>

		<p>
			Die untere Schaltfläche <i>„Exportieren“</i> öffnet einen
			<b>neuen Tab in Deinem Browser</b>. Dies ist die exportierte Vokabelliste.
		</p>

		<p>
			Um es als <b>PDF-Dokument</b> zu speichern, drücke <span class="key">Strg</span>+
			<span class="key">P</span> im neuen Tab.
		</p>

		<p>
			Um es als <b>HTML-Dokument</b> zu speichern, drücke <span class="key">Strg</span> +
			<span class="key">S</span> im neuen Tab.
		</p>

		<button class="button primary" onclick={handleExport} disabled={!sufficientDataSelected}
			>Exportieren</button
		>
	</div>
</main>

<style>
	.column-options {
		display: flex;
		flex-direction: column;
		margin-bottom: 20px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		margin-top: 20px;
	}

	.column-option-row {
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.column-option-row > div {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.column-option-row:not(:last-of-type) {
		border-bottom: 1px solid var(--color-border);
	}

	.counter-margin {
		margin-bottom: 20px;
	}

	.hide-description {
		margin-top: 5px;
	}
</style>
