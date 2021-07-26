<template>
  <main>
    <section>
      <form @submit.prevent="handleSubmit">
        <h1>CONNEXION</h1>
        <div>
          <label for="inputEmail">Email:</label>
          <input
            v-on:keydown="isInvalid = false"
            v-model="inputEmail"
            type="email"
            id="inputEmail"
            aria-describedby="emailHelp"
            placeholder="votre email"
          />
        </div>
        <div>
          <label for="inputPassword">Mot de passe:</label>
          <input
            v-on:keydown="isInvalid = false"
            v-model="inputPassword"
            type="password"
            id="inputPassword"
            aria-describedby="passwordHelp"
            placeholder="votre mot de passe"
          />
          <span id="passwordHelp">Contactez-nous en cas d'oubli</span>
        </div>
        <button type="submit">SE CONNECTER</button>
      </form>
    </section>
    <div v-show="isInvalid" key="invalid">
      Veuillez vérifier vos informations de connexion.
    </div>
    <div>
      <router-link to="/inscription"><button>INSCRIPTION</button></router-link>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import router from "../router";
import "../main.css";

export default {
  name: "Accueil",
  data() {
    return {
      inputEmail: "",
      inputPassword: "",
      isInvalid: false,
    };
  },
  methods: {
    handleSubmit() {
      if (!this.inputEmail || !this.inputPassword) {
        return (this.isInvalid = true);
      }

      axios
        .post("http://localhost:3000/api/auth/login", {
          email: this.inputEmail,
          password: this.inputPassword,
        })
        .then(function (res) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("userName", res.data.userName);
          localStorage.setItem("role", res.data.role);
          window.alert("Connexion réussie, bienvenue à notre page principale");
          router.push({ path: "Stream" });
        })
        .catch((error) => {
          this.isInvalid = true;
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
section {
  width: 100%;
}
label,
input,
span {
  margin: 1%;
}
</style>
