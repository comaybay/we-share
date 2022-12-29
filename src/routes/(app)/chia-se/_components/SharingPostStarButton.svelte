<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseClient } from 'src/lib/db';
	import generateLoginPath from 'src/lib/login/generateLoginPath';
	import YellowStarIcon from '../../_components/icons/YellowStarIcon.svelte';

	export let postId: number;
	export let starCount: number;
	export let starred: boolean;
	let loading = false;

	async function onClickStar() {
		loading = true;
		const user = $page.data.session?.user;

		if (!user) {
			await goto(generateLoginPath($page.url.pathname));
			return;
		}

		let success = false;
		if (starred) {
			const { error } = await supabaseClient.from('post_sharing_stars').delete().match({
				post_id: postId,
				user_id: user.id
			});
			success = error === null;
		} else {
			const { error } = await supabaseClient
				.from('post_sharing_stars')
				.insert([{ post_id: postId, user_id: user.id }]);
			success = error === null;
		}

		if (success) {
			starred = !starred;
			starCount += starred ? 1 : -1;
		}
		loading = false;
	}
</script>

<div class="flex text-quin-base justify-center items-center">
	<span class="text-4xl">{starCount}</span>
	<button
		on:click={onClickStar}
		class="{loading
			? 'text-quin-loading scale-90 hover:rotate-6 '
			: 'text-quin-base hover:text-quin-hover '} transition-transform duration-25 -mt-0.5"
	>
		<YellowStarIcon solid={starred} />
	</button>
</div>
