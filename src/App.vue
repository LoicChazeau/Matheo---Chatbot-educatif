<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    const user = localStorage.getItem("user");
    if (!user && this.$route.path !== "/") {
      this.$router.push("/");
    }
  },
};
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
</style>
