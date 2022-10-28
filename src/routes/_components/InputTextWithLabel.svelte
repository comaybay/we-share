<script lang="ts">
	export let type: 'text' | 'password' | 'email' = 'text';
	export let labelText: string;
	export let name: string;

	export let required = false;
	export let value: string;
	export let minlength: number | undefined = undefined;
	export let maxlength: number | undefined = undefined;
</script>

<label>
	<p class="text-lg">
		{#if required}
			<span class="text-sec-base">*</span>
		{/if}
		{labelText}
	</p>
	{#if type === 'text'}
		<input
			{required}
			{name}
			{minlength}
			{maxlength}
			bind:value
			type="text"
			class="rounded-sm w-full"
		/>
	{:else if type === 'password'}
		<input
			{required}
			{name}
			{minlength}
			{maxlength}
			bind:value
			type="password"
			class="rounded-sm w-full"
		/>
	{:else}
		<input
			{required}
			{name}
			{minlength}
			{maxlength}
			bind:value
			type="email"
			class="rounded-sm w-full"
		/>
	{/if}
</label>
