<script lang="ts">
	let {
		value = $bindable(0),
		label = '',
		min,
		max,
		step = 1
	}: {
		value?: number;
		label?: string;
		min?: number;
		max?: number;
		step?: number;
	} = $props();

	function increment() {
		if (max === undefined || value < max) value += step;
	}

	function decrement() {
		if (min === undefined || value > min) value -= step;
	}
</script>

<div class="number-input">
	{#if label}
		<div class="label">{label}</div>
	{/if}

	<div class="input-wrapper">
		<input type="number" bind:value {min} {max} {step} size="1" />
		<div class="button-container">
			<button onclick={increment} type="button"> + </button>

			<button onclick={decrement} type="button"> - </button>
		</div>
	</div>
</div>

<style>
	.number-input {
		display: flex;
		flex-direction: column;
		width: fit-content;
	}

	.input-wrapper {
		display: flex;
		width: 100%;
	}

	input {
		color: var(--color-text);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		font-family: var(--font-sans);
		font-size: var(--text-md);
		padding: 7px 15px;
		border-radius: var(--radius-md) 0 0 var(--radius-md);
		flex-grow: 1;
		-moz-appearance: textfield;
		border-right: none;
	}

	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button {
		-webkit-appearance: none;
	}

	.button-container {
		display: flex;
		flex-direction: column;
		width: 30px;
		border-left: 1px solid var(--color-border);
	}

	.button-container > button {
		flex-grow: 1;
		cursor: pointer;
		color: var(--color-text);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-left: none;
	}

	.button-container > button:hover {
		background-color: var(--color-surface-hover);
	}

	.button-container > button:active {
		background-color: var(--color-surface-active);
	}

	.button-container > button:first-of-type {
		border-radius: 0 var(--radius-md) 0 0;
		border-bottom: none;
	}

	.button-container > button:last-of-type {
		border-radius: 0 0 var(--radius-md) 0;
	}
</style>
