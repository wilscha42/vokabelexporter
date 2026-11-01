<script lang="ts">
	let {
		value = $bindable(''),
		label = '',
		placeholder = '',
		password = false,
		multiLine = false,
		disabled = false
	}: {
		value?: string;
		label?: string;
		placeholder?: string;
		password?: boolean;
		multiLine?: boolean;
		disabled?: boolean;
	} = $props();
</script>

<div class="text-input" class:disabled>
	{#if label}
		<div class="label">{label}</div>
	{/if}

	{#if multiLine}
		<textarea bind:value {placeholder} {disabled}></textarea>
	{:else}
		<input bind:value type={password ? 'password' : 'text'} {placeholder} {disabled} />
	{/if}
</div>

<style>
	.text-input {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 10px 0;
	}

	.text-input.disabled {
		opacity: 0.5;
		cursor: default;
	}

	input,
	textarea {
		color: var(--color-text);
		font-family: var(--font-sans);
		font-size: var(--text-md);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 7px 15px;
		width: 100%;
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--color-text-muted);
	}

	input:focus,
	textarea:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: -1px;
	}
</style>
