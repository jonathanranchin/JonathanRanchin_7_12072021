<template>
  <main>
    <div>
      <div>
        <router-link v-if="isAdmin" to="/Admin">
          <h1>Administration du site</h1>
        </router-link>
        <Home></Home>
      </div>
      <section id="fil-principal">
        <article>
          <div>
            <div>
              <div>
                <p>Bonjour {{ nameCurrentUser }} !</p>
                <button @click="localClear">Se déconnecter</button>
              </div>
            </div>
            <div>
              <div>
                <p>Membre depuis le {{ creation }}</p>
                <router-link to="/Stream">
                  <button>Revenir à l'Acceuil</button>
                </router-link>
              </div>
              <div>
                <router-link v-if="isAdmin" to="/Admin">
                  <button v-if="isAdmin" type="button">
                    VOUS ÊTES L'ADMINISTRATEUR DU SITE
                  </button>
                </router-link>
                <router-link v-if="isAdmin" to="/Admin">
                  <button type="button">
                    <button>ACTIVÉE</button>
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </article>
        <sub>
          <h2>
            <strong
              ><u
                >Vous pouvez supprimer les utilisateurs que vous voulez.</u
              ></strong
            >
          </h2>
          <div>
            <span>NOM</span>
            <span>EMAIL</span>
            <span>DEPUIS LE</span>
            <span>SUPPRIMER</span>
          </div>
          <div v-for="i in users" :key="i">
            <div>
              <span>
                {{ i.userName.charAt(0).toUpperCase() + i.userName.slice(1) }}
              </span>
              <span> {{ i.email }} </span>
              <span>
                {{ i.createdAt.slice(0, 10).split("-").reverse().join(".") }}
              </span>
              <span>
                <button @click="deleteOneUser(i.id, isAdmin)">
                  Supprimer cet utilisateur
                </button>
              </span>
            </div>
          </div>
        </sub>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import router from "../router";
import "../main.css";
import Home from "../components/Home";

export default {
  name: "UsersList",
  components: {
    Home,
  },
  data() {
    return {
      isAdmin: false,
      nameCurrentUser: "",
      creation: "",
      users: [],
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

    axios
      .get("http://localhost:3000/api/users/all", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        this.users = res.data.found;
      })
      .catch((error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    deleteOneUser(uid, isAdmin) {
      console.log(uid, isAdmin);

      let confirmUserDeletion = confirm(
        "voulez-vous vraiment supprimer cet utilisateur ?"
      );
      if (confirmUserDeletion == true) {
        axios
          .delete("http://localhost:3000/api/users/", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            params: {
              uid: uid,
              isAdmin: isAdmin,
            },
          })
          .then((res) => {
            console.log(res);
            alert("Cliquez sur ok et l'utilisateur sera supprimé");
            router.replace("http://localhost:8080/api/UsersList");
          })
          .catch((error) => {
            location.reload();
            console.log(error);
          });
      } else {
        return;
      }
    },
    localClear() {
      localStorage.clear();
      router.push({ path: "/" });
    },
    seeOnePost(m) {
      console.log(m);
      localStorage.setItem("MessageId", m);
      router.replace("http://localhost:8080/api/comment");
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
