<script lang="ts">
	export let title: string;
</script>

<div class="mt-4 text-xl">
	<div class="flex flex-col items-center">
		<span>{title}</span>
		<slot />
	</div>
</div>
