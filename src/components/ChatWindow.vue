<template>
  <div class="chat-window">
    <ChatHeader :user="user" />
    <ChatMessages :user="user" :selectedChatId="selectedChatId" />
    <MessageInput @openImageToText="showImageToTextModal" :selectedChatId="selectedChatId" @sendMessage="handleUserMessage" />
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
    handleUserMessage(message) {
      console.log("User message received: ", message);
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
