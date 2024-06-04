<template>
	<div class="chat-window">
		<ChatHeader :user="user" />
		<ChatMessages :messages="messages" />
		<MessageInput @sendMessage="handleUserMessage" />
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
    data() {
    return {
      messages: JSON.parse(localStorage.getItem('messages')) || [{ id: 1, text: 'Welcome to the chat!', sender: 'bot' }],
      messageId: JSON.parse(localStorage.getItem('messageId')) || 2,
    };
  },
  props: ['user'],
  methods: {
    handleUserMessage(message) {
      console.log("User message received: ", message);
      // Add user message to messages array
      this.addMessage(message, 'user');

      // Simulate bot response
      setTimeout(() => {
        this.addMessage(this.getBotResponse(), 'bot');
      }, 1000); // 1-second delay for bot response
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
      console.log("Messages : ", this.messages);
    },
    getBotResponse() {
      // Simulated bot responses
      const responses = [
        'Hello! How can I assist you today?',
        "I'm here to help you with your math problems.",
        'Can you please clarify your question?',
        "That's a great question! Let me think...",
        "I'm not sure about that. Can you provide more details?",
      ];
      // Return a random response
      return responses[Math.floor(Math.random() * responses.length)];
    },
  },
	};
</script>

<style scoped>
.chat-window {
  width: 100%;
  background: #FEFEFE;
  border-radius: 19px;
  margin: 20px 20px 20px 0px;
}
</style>
