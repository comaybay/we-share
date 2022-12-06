<script>
	import ButtonText from 'src/routes/_components/buttons/ButtonText.svelte';
	import TopIcon from '../icons/TopIcon.svelte';

	export let active = false;
</script>

<ButtonText {active} on:click>
	<div class="flex gap-x-1">
		<TopIcon />
		<span>Top</span>
	</div>
</ButtonText>
