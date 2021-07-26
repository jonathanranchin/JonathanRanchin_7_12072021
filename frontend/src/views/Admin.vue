<template>
  <main>
    <section>
      <h1>Administration du site</h1>
      <Home></Home>
      <p v-if="isAdmin == false">
        Si vous êtes pas administrateur vous n'avez rien à faire sur cette page!
      </p>
    </section>
    <section v-if="isAdmin">
      <div>
        <article>
          <div>
            <div>
              <button @click="localClear">Se déconnecter</button>
              <div>Bonjour {{ nameCurrentUser }} !</div>
              <div>Membre depuis le {{ creation }}</div>
            </div>
            <div>
              <div v-if="isAdmin">
                <div v-if="isAdmin">Votre privilège d'aministrateur est:</div>
                <router-link to="/Admin">
                  <button type="button">
                    <button>ACTIVÉE</button>
                  </button>
                </router-link>
              </div>
            </div>
          </div>
          <div>
            <div>
              Vous avez le pouvoir de supprimer les messages des utilisateurs,
              leurs commentaires, ainsi que les utilisateurs eux-mêmes.
            </div>
          </div>
        </article>
      </div>
      <article>
        <h2>FAITES VOTRE CHOIX</h2>
        <div>
          <button @click="toCommentsList()">MESSAGES/COMMENTS</button>
          <button @click="toUsersList()">USERS</button>
        </div>
      </article>
    </section>
    <router-link to="/Stream">
      <button>Revenir à l'Acceuil</button>
    </router-link>
  </main>
</template>

<script>
import Home from "../components/Home";
import axios from "axios";
import router from "../router";
import "../main.css";

export default {
  name: "Admin",
  components: {
    Home,
  },
  data() {
    return {
      isAdmin: false,
      nameCurrentUser: "",
      creation: "",
    };
  },
  created: function () {
    let id = localStorage.getItem("userId");
    let self = this;
    axios
      .get("http://localhost:3000/api/users/" + id, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        self.creation = res.data.createdAt
          .slice(0, 10)
          .split("-")
          .reverse()
          .join(".");
        self.isAdmin = res.data.isAdmin;
        self.nameCurrentUser =
          res.data.userName.charAt(0).toUpperCase() +
          res.data.userName.slice(1);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    localClear() {
      localStorage.clear();
      router.push({ path: "/" });
    },
    seeOnePost(m) {
      console.log(m);
      localStorage.setItem("MessageId", m);
      router.replace("/Comment");
    },
    toCommentsList() {
      router.replace("/CommentsList");
    },
    toUsersList() {
      router.replace("/UsersList");
    },
  },
};
</script>

<style scoped>
main,
#fil-principal {
  display: block;
}
span {
  margin: 4%;
}
</style>
