<template>
  <main>
    <div>
      <div>
        <h1>Vous consultez vote compte</h1>
        <Home></Home>
      </div>
      <section id="fil-principal-compte">
        <div>
          <div>
            <p>Bonjour {{ nameCurrentUser }} !</p>
            <button @click="localClear">Se déconnecter</button>
          </div>
        </div>
        <p>Membre depuis le {{ creation }}</p>
        <div>
          <div>
            Depuis cette page vous pouvez supprimer votre compte. La suppression
            de votre compte entrainera également la suppression de tous les
            commentaires et les images que vous avez posté.
          </div>
        </div>
        <div>
          <button @click="deleteMyAccount(id)">
            <span>SUPPRIMER VOTRE COMPTE</span>
          </button>
        </div>
      </section>
    </div>
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
  name: "Compte",
  components: {
    Home,
  },
  data() {
    return {
      isAdmin: false,
      nameCurrentUser: "",
      creation: "",
      id: "",
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
        self.id = res.data.id;
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
    deleteMyAccount(n) {
      let id = n;
      let confirmUserDeletion = confirm(
        "voulez-vous vraiment supprimer votre compte ?"
      );
      if (confirmUserDeletion == true) {
        axios
          .delete("http://localhost:3000/api/users/" + id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            console.log(res);
            alert("Cliquez sur ok et l'utilisateur sera supprimé");
            router.replace("http://localhost:8080/api/");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        return;
      }
    },
    toCommentsList() {
      router.replace("http://localhost:8080/api/CommentsList");
    },
    toUsersList() {
      router.replace("http://localhost:8080/api/UsersList");
    },
  },
};
</script>
