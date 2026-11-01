<script lang="ts">
	let {
		checked = $bindable(false),
		onchange = () => {},
		label = '',
		disabled = false
	}: {
		checked?: boolean;
		onchange?: (value: boolean) => void;
		label?: string;
		disabled?: boolean;
	} = $props();

	function handleChange() {
		onchange(checked);
	}
</script>

<label class="checkbox-input" class:disabled>
	<input type="checkbox" bind:checked onchange={handleChange} {disabled} />

	<span class="checkbox" aria-hidden="true">
		{#if checked}
			✓
		{/if}
	</span>

	{#if label}
		<div class="input-label">{label}</div>
	{/if}
</label>

<style>
	.checkbox-input {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-input.disabled {
		opacity: 0.5;
		cursor: default;
	}

	input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
		display: hidden;
	}

	.checkbox {
		width: var(--checkbox-size);
		height: var(--checkbox-size);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-container);
		color: var(--color-text-inverse);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input:checked + .checkbox {
		background-color: var(--color-primary);
		border-color: var(--color-border-primary);
	}

	input:focus-visible + .checkbox {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>
