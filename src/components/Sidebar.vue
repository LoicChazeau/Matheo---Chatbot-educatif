<template>
	<div class="sidebar">
		<div class="sidebar-header">
			<img class="logo" src="../assets/logo.svg" alt="logo" />
			<span class="title">Mathéo</span>
		</div>
		<div class="new-chat-btn" @click="createNewChat">
			<img style="margin-right: 10px" src="../assets/add.svg" alt="add chat" />
			<span>Nouvelle discussion</span>
		</div>
		<div class="chat-list">
			<div class="no-history">Aucun historique, vous pouvez commencer une nouvelle discussion !</div>
			<div class="chat-list-separator">
				<div class="separator"></div>
				<span class="separator-text">Aujourd'hui</span>
				<div class="separator"></div>
			</div>
			<div class="chat-list-separator">
				<div class="separator"></div>
				<span class="separator-text">Hier</span>
				<div class="separator"></div>
			</div>
			<div class="chat-item" v-for="chat in chats" :key="chat.id">
				<div @click="selectChat(chat)">{{ chat.name }}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['chats'],
		methods: {
			createNewChat() {
				// Logique pour créer un nouveau chat
			},
			selectChat(chat) {
				// Logique pour sélectionner un chat
			},
		},
	};
</script>

<style scoped>
	.sidebar {
		max-width: 260px;
		height: 100vh;
	}
	.sidebar-header {
		height: 100px;
		display: flex;
		align-items: center;
	}
	.logo {
		height: 35px;
		width: 35px;
		margin-left: 35px;
	}
	.title {
		color: #ffffff;
		font-size: 1.2rem;
		font-weight: bold;
		margin-left: 15px;
	}
	.new-chat-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 20px;
		margin-bottom: 30px;
		padding: 12px 0;
		background: #5eacdc;
		border-radius: 12px;
		font-weight: 500;
		cursor: pointer;
	}
	.chat-list {
	}
	.no-history {
		font-size: 12px;
		text-align: center;
		margin: 0 20px;
	}
	.chat-list-separator {
		display: flex;
		align-items: center;
		height: 40px;
		margin: 0 15px;
	}
	.separator {
		border-bottom: 1px solid #424a4c;
		width: 100%;
	}
	.separator-text {
		margin: 0 15px;
		font-size: 14px;
		font-weight: 300;
	}
</style>
