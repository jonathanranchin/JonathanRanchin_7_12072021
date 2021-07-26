<template>
  <div>
    <img src="../assets/logo.png" alt="Logo de Groupomania" />
    <button>
      <a class="mailto" href="mailto:contact@test.com">Contactez nous!</a>
    </button>
  </div>
</template>

<script>
export default {
  name: "Navi",
};
</script>
<style scoped>
a {
  color: white;
  text-decoration: none;
}
div {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  background: linear-gradient(
    178.6deg,
    rgb(20, 36, 50) 11.8%,
    rgb(124, 143, 161) 83.8%
  );
  border-radius: 15px;
  padding: 4px;
}
img {
  width: 180px;
  height: 50px;
}
</style>
