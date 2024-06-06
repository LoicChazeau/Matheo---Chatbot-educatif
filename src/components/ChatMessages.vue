<template>
	<div class="chat-messages">
		<div v-for="message in messages" :key="message.id" :class="['message', message.sender === 'bot' ? 'bot-message' : 'user-message']">
			<p>{{ message.message }}</p>
			<span v-if="message.timestamp">{{ new Date(message.timestamp.seconds * 1000).toLocaleString() }}</span>
			<span v-else>Timestamp inconnu</span>
		</div>
	</div>
</template>

<script>
	import { collection, query, where, onSnapshot } from 'firebase/firestore';

	export default {
		props: ['selectedChatId'],
		data() {
			return {
				messages: [],
				unsubscribe: null,
			};
		},
		watch: {
			selectedChatId(newId) {
				if (newId) {
					this.fetchMessages(newId);
				} else if (this.unsubscribe) {
					this.unsubscribe();
					this.unsubscribe = null;
				}
			},
		},
		methods: {
			fetchMessages(conversationId) {
				const messagesRef = collection(this.$db, 'messages');
				const q = query(messagesRef, where('conversation_id', '==', conversationId));

				if (this.unsubscribe) {
					this.unsubscribe();
				}

				this.unsubscribe = onSnapshot(q, (querySnapshot) => {
					this.messages = [];
					querySnapshot.forEach((doc) => {
						const data = doc.data();
						data.id = doc.id;
						this.messages.push(data);
					});
					// Trier les messages par timestamp
					console.log(this.messages);
					this.messages.sort((a, b) => {
						const aTimestamp = a.timestamp ? a.timestamp.seconds : 0;
						const bTimestamp = b.timestamp ? b.timestamp.seconds : 0;
						return aTimestamp - bTimestamp;
					});
				});
			},
		},
		beforeDestroy() {
			if (this.unsubscribe) {
				this.unsubscribe();
			}
		},
	};
</script>

<style scoped>
	.message {
		margin: 10px;
		padding: 10px;
		border-radius: 5px;
	}

	.bot-message {
		background-color: #f1f1f1;
		text-align: left;
	}

	.user-message {
		background-color: #daf8cb;
		text-align: right;
	}

	.message p {
		margin: 0;
	}

	.message span {
		font-size: 0.8rem;
		color: #888;
	}

	.chat-messages {
		overflow-y: auto;
		max-height: 70vh; /* Ajustez selon vos besoins */
	}
</style>
