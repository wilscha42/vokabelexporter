<script lang="ts">
</script>

<svelte:head>
	<title>Vokabelexporter</title>
</svelte:head>

<header></header>

<main>
	<div class="centered">
		<h1>Vokabelexporter</h1>

		<h2>Willkommen beim Vokabelexporter!</h2>
		<p>
			Mit dieser Anwendung können Vokabeln aus CSV-Datensätzen in Lehr- und Lernmaterialien
			exportiert werden.
		</p>

		<p>Es werden bisher folgende Exporte unterstützt:</p>

		<div class="export-options-container">
			<div class="option">
				<a href="/export/list" class="option-title">Liste</a>

				<span class="option-description"
					>Eine tabellarische Liste, die bspw. mehrere Sprachen oder Formen gegenüber stellt.</span
				>
			</div>

			<!-- <div class="option">
				<a href="/export/cards" class="option-title">Druckbare Karteikarten</a>

				<span class="option-description"
					>Für den PDF-Export geeignete doppelseitige A4-Seiten zum Ausschneiden von physischen
					Karteikarten.</span
				>
			</div> -->

			<!-- <div class="option">
				<a href="/export/trainer" class="option-title">Interaktiver Trainer</a>

				<span class="option-description"
					>Eine HTML-Datei, die Vokabeln abfragt, indem es erst die eine Seite anzeigt und erst auf
					Knopfdruck die zweite.</span
				>
			</div> -->

			<!-- <div class="option">
				<a href="/export/presentation" class="option-title">Folien</a>

				<span class="option-description"
					>Bietet die Möglichkeit, die Vokabeln mehrerer Sprachen schrittweise als Folien zu
					präsentieren.</span
				>
			</div> -->
		</div>
	</div>
</main>

<footer>
	Made by <a href="https://github.com/wilscha42">@wilscha42</a>
</footer>

<style>
	header {
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		width: 100%;
		min-height: 50px;
	}

	main {
		padding: 20px 0;
	}

	footer {
		align-self: center;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	footer > a {
		color: inherit !important;
	}

	.export-options-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.option {
		background-color: var(--color-surface);
		border-radius: var(--radius-sm);
		padding: 20px;
		text-decoration: none;
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	.option-title {
		font-weight: bold;
		font-size: var(--text-lg);
		margin-bottom: 5px;
		display: block;
	}
</style>
