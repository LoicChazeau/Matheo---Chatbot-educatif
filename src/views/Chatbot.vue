<template>
	<div id="chatbot">
		<Sidebar :chats="chats" @selectChat="handleSelectChat" />
		<ChatWindow :user="currentUser" :selectedChatId="selectedChatId" />
	</div>
</template>

<script>
	import Sidebar from '../components/Sidebar.vue';
	import ChatWindow from '../components/ChatWindow.vue';
	import { useRoute } from 'vue-router';

	export default {
		components: {
			Sidebar,
			ChatWindow,
		},
		data() {
			return {
				currentUser: JSON.parse(localStorage.getItem('user')),
				chats: [],
				selectedChatId: null,
			};
		},
		mounted() {
			const route = useRoute();
			this.selectedChatId = route.params.chatId || null;
		},
		watch: {
			'$route.params.chatId'(newId) {
				this.selectedChatId = newId;
			},
		},
		methods: {
			handleSelectChat(chat) {
				this.selectedChatId = chat.id;
			},
		},
	};
</script>

<style>
	#chatbot {
		display: flex;
		height: 100vh;
		width: 100vw;
	}
</style>
