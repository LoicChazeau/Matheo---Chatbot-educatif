<template>
  <div class="container">
    <div class="message-input-wrapper">
      <div class="message-input">
        <img src="../assets/photo.svg" alt="Image to Text" @click="$emit('openImageToText')" class="input-icon-left" />
        <textarea
          ref="messageInput"
          v-model="message"
          @keydown.enter.exact="sendMessage"
          @keydown.shift.enter="insertNewLine"
          @input="autoResize"
          placeholder="Une question, un problème ?"
        ></textarea>
        <img src="../assets/send.svg" alt="Send" @click="sendMessage" class="input-icon-right" />
      </div>
    </div>
  </div>
</template>

<script>
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default {
  props: ["selectedChatId"],
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async sendMessage(event) {
      // Prevent newline on enter press
      if (event) {
        if (event.shiftKey) return;
        event.preventDefault();
      }

      if (this.message.trim() === "" || !this.selectedChatId) return;

      const messagesRef = collection(this.$db, "messages");
      await addDoc(messagesRef, {
        conversation_id: this.selectedChatId,
        message: this.message,
        sender: "user",
        timestamp: serverTimestamp(),
      });

      this.$emit("messageSent", this.message);

      this.message = "";
      this.resetTextareaHeight(); // Reset the textarea height
    },
    insertNewLine(event) {
      event.preventDefault();
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      this.message = this.message.substring(0, start) + "\n" + this.message.substring(end);
      this.$nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        this.autoResize({ target: textarea });
      });
    },
    autoResize(event) {
      const textarea = event.target;
      const lineHeight = 21; // Hauteur d'une ligne
      const numberOfLines = textarea.value.split("\n").length;
      const newHeight = Math.min(numberOfLines * lineHeight, 300); // Limiter la hauteur à 300px
      textarea.style.height = `${newHeight}px`;
    },
    resetTextareaHeight() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = "21px"; // Reset to default height
    },
  },
};
</script>

<style scoped>
.container {
  height: auto;
  padding: 10px 25px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.message-input-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.message-input {
  display: flex;
  align-items: flex-end;
  align-items: center;
  padding: 5px 0;
  border: 1px solid #e6e6e6;
  background-color: #fafafa;
  border-radius: 12px;
  position: relative;
  max-width: 750px;
  width: 100%;
}

.message-input textarea {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 0px;
  background-color: #fafafa;
  margin: 0 50px;
  color: #333;
  font-size: 15px;
  outline: none;
  resize: none;
  overflow: hidden;
  font-family: "Marianne", sans-serif;
  height: 21px;
  min-height: 21px;
}

.message-input textarea::placeholder {
  color: #999;
}

.input-icon-left,
.input-icon-right {
  position: absolute;
  bottom: 13px;
  cursor: pointer;
}

.input-icon-left {
  left: 15px;
}

.input-icon-right {
  right: 15px;
}
</style>
