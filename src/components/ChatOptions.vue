<template>
  <div class="chat-options">
    <div class="option" @click="renameChat">
      <img src="../assets/edit.svg" alt="rename" />
      <span>Renommer</span>
    </div>
    <div class="separator"></div>
    <div class="option" @click="deleteChat">
      <img src="../assets/delete.svg" alt="delete" />
      <span>Supprimer</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["chat"],
  methods: {
    renameChat() {
      this.$emit("rename", this.chat);
    },
    deleteChat() {
      this.$emit("delete", this.chat);
    },
  },
};
</script>

<style scoped>
.chat-options {
  width: 180px;
  position: absolute;
  background-color: #2b2e2f;
  color: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 7px 0;
  font-size: 0.9rem;
  border-radius: 12px;
}
.option img {
  margin: 0 8px;
}
.option:hover {
  background-color: #444;
}
.separator {
  border-bottom: 1px solid #424a4c;
  margin: 10px 0;
}
</style>
