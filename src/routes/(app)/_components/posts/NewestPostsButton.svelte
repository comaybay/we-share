<script>
	import ButtonText from 'src/routes/_components/buttons/ButtonText.svelte';
	import SparkleIcon from '../icons/SparkleIcon.svelte';
	export let active = false;
</script>

<ButtonText {active} on:click>
	<div class="flex gap-x-1">
		<SparkleIcon />
		<span>Mới nhất</span>
	</div>
</ButtonText>
