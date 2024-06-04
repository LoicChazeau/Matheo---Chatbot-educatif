<template>
	<div class="chat-messages">
		<div v-for="message in messages" :key="message.id" class="message" :class="message.sender">
			{{ message.text }}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			messages: {
				type: Array,
				required: true,
			},
		},
	};
</script>

<style scoped>
	.chat-messages {
		height: 400px;
		overflow-y: auto;
		padding: 10px;
		border: 1px solid #ccc;
	}

	.message {
		margin-bottom: 10px;
		padding: 8px;
		border-radius: 5px;
	}

	.user {
		background-color: #e0f7fa;
		text-align: right;
	}

	.bot {
		background-color: #e0e0e0;
		text-align: left;
	}
</style>
