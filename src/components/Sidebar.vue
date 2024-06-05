<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <img class="logo" src="../assets/logo.svg" alt="logo" />
      <span class="title">Mathéo</span>
    </div>
    <div class="new-chat-btn" @click="createNewChat">
      <img style="margin-right: 10px" src="../assets/add.svg" alt="add chat" />
      <span>Nouvelle discussion</span>
    </div>
    <div class="chat-list">
      <div v-if="!hasChats" class="no-history">
        Aucun historique, vous pouvez commencer une nouvelle discussion !
      </div>
      <div v-else>
        <div v-if="this.todayChats.length" class="chat-list-separator">
          <div class="separator"></div>
          <span class="separator-text">Aujourd'hui</span>
          <div class="separator"></div>
        </div>
        <div
          class="chat-item"
          v-for="chat in todayChats"
          :key="chat.id"
          @click="selectChat(chat)"
        >
          <img src="../assets/chat.svg" alt="chat icon" />
          <span>{{ chat.name }}</span>
          <img
            class="chat-item-option"
            src="../assets/option.svg"
            alt="chat options"
          />
        </div>
        <div v-if="yesterdayChats.length" class="chat-list-separator">
          <div class="separator"></div>
          <span class="separator-text">Hier</span>
          <div class="separator"></div>
        </div>
        <div
          class="chat-item"
          v-for="chat in yesterdayChats"
          :key="chat.id"
          @click="selectChat(chat)"
        >
          <img src="../assets/chat.svg" alt="chat icon" />
          <span>{{ chat.name }}</span>
          <img
            class="chat-item-option"
            src="../assets/option.svg"
            alt="chat options"
          />
        </div>
        <div v-if="last7DaysChats.length" class="chat-list-separator">
          <div class="separator"></div>
          <span class="separator-text">7 jours précédents</span>
          <div class="separator"></div>
        </div>
        <div
          class="chat-item"
          v-for="chat in last7DaysChats"
          :key="chat.id"
          @click="selectChat(chat)"
        >
          <img src="../assets/chat.svg" alt="chat icon" />
          <span>{{ chat.name }}</span>
          <img
            class="chat-item-option"
            src="../assets/option.svg"
            alt="chat options"
          />
        </div>
        <div v-if="olderChats.length" class="chat-list-separator">
          <div class="separator"></div>
          <span class="separator-text">Anciennes conversations</span>
          <div class="separator"></div>
        </div>
        <div
          class="chat-item"
          v-for="chat in olderChats"
          :key="chat.id"
          @click="selectChat(chat)"
        >
          <img src="../assets/chat.svg" alt="chat icon" />
          <span>{{ chat.name }}</span>
          <img
            class="chat-item-option"
            src="../assets/option.svg"
            alt="chat options"
          />
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="logout-btn" @click="logout">
        <img
          style="margin-right: 10px"
          src="../assets/logout.svg"
          alt="logout"
        />
        <span>Deconnexion</span>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  props: ["chats"],
  data() {
    return {
      todayChats: [],
      yesterdayChats: [],
      last7DaysChats: [],
      olderChats: [],
      userINE: JSON.parse(localStorage.getItem("user")).ine,
    };
  },
  computed: {
    hasChats() {
      return (
        this.todayChats.length ||
        this.yesterdayChats.length ||
        this.last7DaysChats.length ||
        this.olderChats.length
      );
    },
  },
  async created() {
    await this.fetchConversations();
  },
  methods: {
    async fetchConversations() {
      const convRef = collection(this.$db, "conversations");
      const q = query(convRef, where("user_id", "==", this.userINE));
      const querySnapshot = await getDocs(q);

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);

      const conversations = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        data.last_used = new Date(data.last_used.seconds * 1000);
        conversations.push(data);
      });

      console.log("Conversations :", conversations);

      this.todayChats = conversations.filter((chat) =>
        this.isSameDay(chat.last_used, today)
      );
      this.yesterdayChats = conversations.filter((chat) =>
        this.isSameDay(chat.last_used, yesterday)
      );
      this.last7DaysChats = conversations.filter((chat) => {
        const chatDate = new Date(chat.last_used);
        return chatDate > last7Days && chatDate < yesterday;
      });
      this.olderChats = conversations.filter(
        (chat) => new Date(chat.last_used) <= last7Days
      );
    },
    isSameDay(d1, d2) {
      console.log(d1, d2);
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    },
    createNewChat() {
      // Logique pour créer un nouveau chat
    },
    selectChat(chat) {
      // Logique pour sélectionner un chat
    },
    logout() {
      localStorage.removeItem("user"); // Supprime les informations de l'utilisateur du localStorage
      this.$router.push("/"); // Redirige vers la page de connexion
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  height: 100px;
  display: flex;
  align-items: center;
}
.logo {
  height: 35px;
  width: 35px;
  margin-left: 35px;
}
.title {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 15px;
}
.new-chat-btn {
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
  margin-bottom: 30px;
  padding: 12px 0;
  background: #5eacdc;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
}
.new-chat-btn:hover {
  opacity: 0.95;
}
.chat-list {
  flex: 1;
  overflow-y: auto;
}
.no-history {
  font-size: 12px;
  text-align: center;
  margin: 0 20px;
}
.chat-list-separator {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 0 15px;
}
.separator {
  border-bottom: 1px solid #424a4c;
  width: 100%;
}
.separator-text {
  margin: 0 15px;
  font-size: 14px;
  font-weight: 300;
  white-space: nowrap;
}
.chat-item {
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
  padding: 12px 0;
  height: 24px;
  border-radius: 12px;
  cursor: pointer;
}
.chat-item:hover {
  background-color: #2b2e2f;
}
.chat-item img {
  margin-left: 15px;
  margin-right: 10px;
}
.chat-item span {
  flex-grow: 1;
  font-size: 0.85rem;
}
.chat-item-option {
  margin-left: 0px;
  margin-right: 15px;
}
.footer {
  margin: 20px 0;
}
.logout-btn {
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
  padding: 12px 0;
  background: transparent;
  border: solid 1.5px #e08686;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
}
.logout-btn:hover {
  opacity: 0.95;
  background-color: #e08686;
}
</style>
