<script lang="ts">
	export let authorUsername: string;
</script>

<a class="hover:text-pri-hover font-semibold" href={`/nguoi-dung/${authorUsername}`}>
	{authorUsername}
</a>
