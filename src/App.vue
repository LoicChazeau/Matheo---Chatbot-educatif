<template>
  <div id="app">
    <Sidebar :chats="chats" />
    <ChatWindow :user="currentUser" :messages="currentMessages" />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import ChatWindow from './components/ChatWindow.vue'

export default {
  components: {
    Sidebar,
    ChatWindow
  },
  data() {
    return {
      currentUser: {
        name: 'Tanguy Otière',
        ine: 'INE : 4368258399738',
        avatar: '/src/assets/avatar-1.svg'
      },
      chats: [],
      currentMessages: []
    }
  }
}
</script>

<style>
#app {
	display: flex;
	height: 100vh;
	width: 100vw;
}
</style>