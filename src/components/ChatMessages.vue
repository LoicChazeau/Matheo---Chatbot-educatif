<template>
  <div class="chat-messages">
    <div v-for="message in messages" :key="message.id" class="message" :class="message.sender">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['messages'],
};
</script>

<style scoped>
	.chat-messages {
		display: flex;
		flex-direction: column;
		padding: 10px;
		max-height: 400px; /* Ajustez selon vos besoins */
		overflow-y: auto;
	}
</style>
