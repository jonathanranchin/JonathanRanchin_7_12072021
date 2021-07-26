<template>
  <div id="app">
    <Navi></Navi>
    <router-view></router-view>
  </div>
</template>

<script>
import Navi from "./components/Navi";

export default {
  name: "App",
  components: {
    Navi,
  },
};
</script>
