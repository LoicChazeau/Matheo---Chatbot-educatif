<template>
	<div class="message-input">
		<input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message" />
		<button @click="sendMessage">Send</button>
	</div>
</template>

<script>
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

	export default {
		props: ['selectedChatId'],
		data() {
			return {
				message: '',
			};
		},
		methods: {
			async sendMessage() {
				if (this.message.trim() === '' || !this.selectedChatId) return;

				const messagesRef = collection(this.$db, 'messages');
				await addDoc(messagesRef, {
					conversation_id: this.selectedChatId,
					message: this.message,
					sender: 'user',
					timestamp: serverTimestamp(),
				});

				this.message = '';
			},
		},
	};
</script>

<style scoped>
	.message-input {
		display: flex;
		align-items: center;
		padding: 10px;
		border-top: 1px solid #ccc;
	}

	.message-input input {
		flex: 1;
		padding: 10px;
		margin-right: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.message-input button {
		padding: 10px 20px;
		border: none;
		background-color: #5eacdc;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}

	.message-input button:hover {
		background-color: #4a8cb6;
	}
</style>
