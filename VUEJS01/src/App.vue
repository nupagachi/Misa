
<template>
  <div id="app">
    <Header />
    <NavBar />
    <Content />
  </div>
</template>
<script>
import NavBar from "../src/layouts/NavBar.vue";
import Header from "../src/layouts/Header.vue";
import Content from "../src/layouts/Content.vue";
export default {
  name: "App",
  components: {
    NavBar,
    Header,
    Content,
  },
};
</script>



<style>
@import "../src/css/common/main.css";
@import "../src/css/common/header.css";
@import "../src/css/common/navbar.css";
@import "../src/css/common/content.css";
@import "../src/css/common/dropdown.css";
</style>
