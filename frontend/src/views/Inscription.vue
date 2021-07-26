<template>
  <main>
    <section>
      <form @submit.prevent="sendForm(event)">
        <h1>INSCRIPTION</h1>
        <div>
          <label for="inputUserName">Nom d'utilisateur:</label>
          <input
            v-on:keydown="invalid = false"
            v-model="inputUserName"
            type="text"
            id="inputUserName"
            aria-describedby="userNameHelp"
            placeholder="Entrez votre nom"
          />
        </div>
        <div>
          <label for="inputEmail">Email:</label>
          <input
            v-on:keydown="invalid = false"
            v-model="inputEmail"
            type="email"
            id="inputEmail"
            aria-describedby="emailHelp"
            placeholder="votre email"
          />
        </div>
        <div>
          <label for="inputPassword">Choisissez un Mot de passe:</label>
          <input
            v-on:keydown="invalid = false"
            v-model="inputPassword"
            type="password"
            id="inputPassword"
            aria-describedby="passwordHelp"
            placeholder="mot de passe"
          />
        </div>
        <button type="submit">S'INSCRIRE</button>
      </form>
    </section>
    <div v-show="invalid" class="invalidBox m-2" key="invalid">
      Veuillez remplir tous les champs du formulaire en suivant les
      instructions.
    </div>
    <div>
      <router-link to="/#"
        ><button>RETOUR A L'ECRAN DE CONNEXION</button></router-link
      >
    </div>
  </main>
</template>

<script>
import axios from "axios";
import router from "../router";
import "../main.css";

export default {
  name: "Inscription",
  data() {
    return {
      inputUserName: "",
      inputEmail: "",
      inputPassword: "",
      invalid: false,
    };
  },
  methods: {
    sendForm() {
      if (!this.inputUserName || !this.inputEmail || !this.inputPassword) {
        return (this.invalid = true);
      }
      const nameRegex = /(.*[a-z]){3,30}/;
      const mailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (
        nameRegex.test(this.inputUserName) &&
        mailRegex.test(this.inputEmail) &&
        pwdRegex.test(this.inputPassword)
      ) {
        axios
          .post("http://localhost:3000/api/auth/signup", {
            userName: this.inputUserName,
            email: this.inputEmail,
            password: this.inputPassword,
          })
          .then(() => {
            alert(
              "inscription réussie, redirection vers le module de connexion"
            );
            router.push({ path: "/" });
          })
          .catch((error) => {
            alert(error.status);
            console.log(error);
          });
      } else {
        console.log("validation form, method sendForm, renvoie une erreur");
        this.invalid = true;
      }
    },
  },
};
</script>
<style scoped>
label,
input,
p {
  margin: 1%;
}
@media only screen and (max-device-width: 769px) {
  label,
  input,
  p {
    margin: 1%;
    width: 95%;
  }
}
</style>
