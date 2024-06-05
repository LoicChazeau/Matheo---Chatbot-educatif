<template>
  <div id="chatbot">
    <Sidebar :chats="chats" />
    <ChatWindow :user="currentUser" :messages="currentMessages" />
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import ChatWindow from '../components/ChatWindow.vue'

export default {
  components: {
    Sidebar,
    ChatWindow
  },
  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('user')),
      chats: [],
      currentMessages: []
    }
  },
}
</script>

<style>
#chatbot {
  display: flex;
  height: 100vh;
  width: 100vw;
}
</style>
