<script lang="ts">
	export let labelText: string;
	export let inputName: string;
</script>

<label>
	<p class="text-lg">{labelText}</p>
	<input name={inputName} type="text" class="rounded-sm w-full" />
</label>
