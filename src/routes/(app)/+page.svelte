<script lang="ts">
	import ButtonOutline from '../_components/buttons/ButtonOutline.svelte';
	import WeShareIcon from '../_components/WeShareIcon.svelte';
	import type { PageData } from './$types';
	import AskQuestionIcon from './_components/icons/AskQuestionIcon.svelte';
	import CreateSharingPostIcon from './_components/icons/CreateSharingPostIcon.svelte';
	import TeamIcon from './_components/icons/TeamIcon.svelte';
	import FindTeamPostMini from './_components/posts/headlines/FindTeamPostMini.svelte';
	import QuestionMini from './_components/posts/headlines/QuestionMini.svelte';
	import SharingPostMini from './_components/posts/headlines/SharingPostMini.svelte';
	import SectionTitle from './_homePageComponents/SectionTitle.svelte';

	export let data: PageData;
</script>

<div class="mt-4 w-fit mx-auto text-sec-base">
	<WeShareIcon size={64} strokeWidth={1} />
</div>
<h1 class="mt-3 text-center text-3xl">
	WeShare <span class="text-sec-base">-</span> Cộng đồng chia sẻ kiến thức
</h1>

<div class="mt-8 grid place-content-center grid-cols-2 gap-x-4 gap-y-12 max-w-5xl mx-auto">
	<div>
		<SectionTitle href="/hoi-dap">
			<span slot="first">Họ cần bạn!</span>
			<span slot="second">Câu hỏi cần được giúp</span>
		</SectionTitle>
		{#each data.questions as question}
			<QuestionMini {question} />
		{/each}
	</div>

	<div>
		<SectionTitle href="/chia-se">
			<span slot="first">Học hỏi!</span>
			<span slot="second">Bài viết chia sẻ gần đây</span>
		</SectionTitle>
		{#each data.sharingPosts as post}
			<SharingPostMini {post} />
		{/each}
	</div>

	<div>
		<SectionTitle href="/tim-nhom">
			<span slot="first">Tìm nhóm!</span>
			<span slot="second">Tham gia các project thú vị</span>
		</SectionTitle>
		{#each data.findTeamPosts as post}
			<FindTeamPostMini {post} />
		{/each}
	</div>

	<div>
		<h3 class="group text-2xl">
			<span>Chia sẻ!</span>
			<span class="text-sec-base">-</span>
			<span>Bạn muốn làm gì?</span>
		</h3>
		<div class="mt-6 flex flex-col gap-y-4">
			<a href="/hoi-dap/dat-cau-hoi">
				<ButtonOutline rounded block>
					<div class="flex justify-center items-center gap-x-2 font-bold text-lg">
						<AskQuestionIcon /> ĐẶT CÂU HỎI
					</div>
				</ButtonOutline>
			</a>
			<a href="/chia-se/tao-bai-viet">
				<ButtonOutline rounded block>
					<div class="flex justify-center items-center gap-x-2 font-bold text-lg">
						<CreateSharingPostIcon /> TẠO BÀI VIẾT
					</div>
				</ButtonOutline>
			</a>
			<a href="/tim-nhom/tao-bai-viet">
				<ButtonOutline rounded block>
					<div class="flex justify-center items-center gap-x-2 font-bold text-lg">
						<TeamIcon /> ĐĂNG BÀI TÌM NHÓM
					</div>
				</ButtonOutline>
			</a>
		</div>
	</div>
</div>
