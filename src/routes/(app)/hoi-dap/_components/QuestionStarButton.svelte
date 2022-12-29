<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseClient } from 'src/lib/db';
	import generateLoginPath from 'src/lib/login/generateLoginPath';
	import StarIcon from '../../_components/icons/StarIcon.svelte';

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
			const { error } = await supabaseClient.from('post_question_stars').delete().match({
				post_id: postId,
				user_id: user.id
			});
			success = error === null;
		} else {
			const { error } = await supabaseClient
				.from('post_question_stars')
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

<div class="flex text-sec-base justify-center items-center">
	<span class="text-4xl">{starCount}</span>
	<button
		on:click={onClickStar}
		class="{loading
			? 'text-sec-loading scale-90 hover:rotate-6 '
			: 'text-sec-base hover:text-sec-hover '} transition-transform duration-25 -mt-0.5"
	>
		<StarIcon solid={starred} />
	</button>
</div>
