<template>
	<div class="chat-messages">
		<div v-for="message in messages" :key="message.id" :class="['message', message.sender === 'bot' ? 'bot-message' : 'user-message']">
			<img v-if="message.sender === 'bot'" src="../assets/avatar-bot.svg" alt="Bot Avatar" class="avatar avatar-bot" />
			<div class="message-content">
				<p>{{ message.message }}</p>
			</div>
			<img v-if="message.sender === 'user'" :src="avatarSrc" alt="User Avatar" class="avatar avatar-user" />
		</div>
	</div>
</template>

<script>
	import { collection, query, where, onSnapshot } from 'firebase/firestore';

	export default {
		props: ['selectedChatId', 'user'],
		computed: {
			avatarSrc() {
				const avatarPath = new URL(`../assets/avatar/${this.user.profileImageURL}.svg`, import.meta.url).href;
				return avatarPath;
			},
		},
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
	.chat-messages {
		flex: 1;
		overflow-y: auto;
		padding: 0 25px;
		padding-top: 25px;
		padding-bottom: 15px;
		color: #000;
	}
	.message {
		display: flex;
		align-items: flex-start;
		margin: 15px;
		padding: 10px;
		border-radius: 12px;
		max-width: 70%;
	}
	.bot-message {
		background-color: #e7f4f5;
		text-align: left;
	}
	.user-message {
		background-color: #f5f5f5;
		text-align: left;
		justify-content: flex-end;
		margin-left: auto;
	}
	.message-content {
		background-color: #f5f5f5;
		padding: 6px;
		border-radius: 10px;
		position: relative;
	}
	.bot-message .message-content {
		background-color: #e7f4f5;
	}
	.avatar {
		width: 40px;
		height: 40px;
		margin: 0 10px;
	}
	.avatar-bot {
		order: -1;
		margin-right: 20px;
	}
	.avatar-user {
		order: 2;
		margin-left: 20px;
	}
	.message-content p {
		margin: 0;
		word-wrap: break-word;
	}
</style>
