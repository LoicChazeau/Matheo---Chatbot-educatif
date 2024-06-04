<template>
  <div class="message-input">
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newMessage: ''
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        console.log("Sending message: ", this.newMessage.trim());
        this.$emit('sendMessage', this.newMessage.trim())
        this.newMessage = ''
      }
    }
  }
}
</script>

<style scoped>
.message-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}
.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.message-input button {
  margin-left: 10px;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
