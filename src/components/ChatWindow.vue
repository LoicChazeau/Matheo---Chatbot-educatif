<template>
  <div class="chat-window">
    <ChatHeader :user="user" />
    <ChatMessages :user="user" :selectedChatId="selectedChatId" />
    <MessageInput @openImageToText="showImageToTextModal" :selectedChatId="selectedChatId" @messageSent="handleMessageSent" />
    <ImageToText @sendMessage="sendConvertedText" ref="imageToTextModal" />
  </div>
</template>

<script>
import ChatHeader from "./ChatHeader.vue";
import ChatMessages from "./ChatMessages.vue";
import MessageInput from "./MessageInput.vue";
import ImageToText from "./ImageToText.vue";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default {
  components: {
    ChatHeader,
    ChatMessages,
    MessageInput,
    ImageToText,
  },
  props: ["user", "selectedChatId"],
  methods: {
    handleMessageSent(userMessage) {
      // Simulate bot response after 1 second
      setTimeout(async () => {
        const botResponses = [
          "Hello! How can I help you?",
          "Thank you for your message!",
          "I am here to assist you.",
          "Can you please provide more details?",
          "I will look into it.",
        ];

        const botMessage = botResponses[Math.floor(Math.random() * botResponses.length)];

        const messagesRef = collection(this.$db, "messages");
        await addDoc(messagesRef, {
          conversation_id: this.selectedChatId,
          message: botMessage,
          sender: "bot",
          timestamp: serverTimestamp(),
        });
      }, 1500);
    },
    showImageToTextModal() {
      this.$refs.imageToTextModal.open();
    },
    sendConvertedText(message) {
      if (message.trim() === "" || !this.selectedChatId) return;

      const messagesRef = collection(this.$db, "messages");
      addDoc(messagesRef, {
        conversation_id: this.selectedChatId,
        message: message,
        sender: "user",
        timestamp: serverTimestamp(),
      }).then(() => {
        this.handleMessageSent(message); // Déclenche une réponse du bot après l'envoi du message converti
      });
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
