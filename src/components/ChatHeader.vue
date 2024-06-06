<template>
	<div class="chat-header">
		<div class="user-info">
			<img class="avatar" :src="avatarSrc" alt="Avatar" />
			<div class="col">
				<span class="name">{{ user.name }}</span>
				<span class="ine">INE : {{ user.ine }}</span>
			</div>
		</div>
		<div class="separator"></div>
	</div>
</template>

<script>
	export default {
		props: ['user'],
		computed: {
			avatarSrc() {
				const avatarPath = new URL(`../assets/avatar/${this.user.profileImageURL}.svg`, import.meta.url).href;
				return avatarPath;
			},
		},
	};
</script>

<style scoped>
	.chat-header {
		height: 80px;
	}
	.user-info {
		display: flex;
		margin: 20px;
		margin-left: 30px;
	}
	.avatar {
		width: 50px;
		height: 50px;
	}
	.col {
		display: flex;
		flex-direction: column;
		margin-left: 15px;
	}
	.name {
		color: #171a1b;
		font-weight: 600;
	}
	.ine {
		color: #9a9b9b;
		font-size: 0.85rem;
	}
	.separator {
		border-bottom: 1px solid #e5e5e5;
		margin: 0 25px;
	}
</style>

/* Line 1 */ position: absolute; width: 1057px; height: 0px; left: 335px; top: 114px; border: 1px solid #E5E5E5;
