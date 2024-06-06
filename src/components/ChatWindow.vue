<template>
	<div class="chat-window">
		<ChatHeader :user="user" />
		<ChatMessages :user="user" :selectedChatId="selectedChatId" />
		<MessageInput :selectedChatId="selectedChatId" @sendMessage="handleUserMessage" />
	</div>
</template>

<script>
	import ChatHeader from './ChatHeader.vue';
	import ChatMessages from './ChatMessages.vue';
	import MessageInput from './MessageInput.vue';

	export default {
		components: {
			ChatHeader,
			ChatMessages,
			MessageInput,
		},
		props: ['user', 'selectedChatId'],
		methods: {
			handleUserMessage(message) {
				console.log('User message received: ', message);
				// Add user message to messages array
				this.addMessage(message, 'user');
			},
			addMessage(text, sender) {
				this.messages.push({
					id: this.messageId++,
					text,
					sender,
				});
				// Save messages and messageId to localStorage
				localStorage.setItem('messages', JSON.stringify(this.messages));
				localStorage.setItem('messageId', JSON.stringify(this.messageId));
				console.log('Messages : ', this.messages);
			},
		},
	};
</script>

<style scoped>
	.chat-window {
		width: 100%;
		background: #fefefe;
		border-radius: 19px;
		margin: 20px 20px 20px 0px;
		display: flex;
		flex-direction: column;
	}
</style>
