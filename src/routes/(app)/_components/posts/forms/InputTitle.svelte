<script lang="ts">
	export let title: string;
	export let disabled = false;
</script>

<input
	{disabled}
	required
	name="title"
	minlength={1}
	maxlength={255}
	bind:value={title}
	type="text"
	class="rounded-sm w-full"
	placeholder="Tiêu đề"
/>
