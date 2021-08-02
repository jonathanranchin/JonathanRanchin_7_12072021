<template>
  <main>
    <div id="titles">
      <h1>Groupomania le réseau pour toi</h1>
      <h2 v-if="this.messages.length !== 0">Dernières Publications</h2>
      <h2 v-else>
        Aucune publication pour l'instant, soyez le premier à en créer une !
      </h2>
      <button class="disconect-button" @click="localClear">
        Se déconnecter
      </button>
    </div>
    <section id="fil-principal">
      <!-- bloc utilisateur -->
      <article id="profil-publish">
        <p>Bonjour {{ name }} !</p>
        <p id="membre">Membre depuis le {{ creation }}</p>
        <router-link v-if="isAdmin" to="/Admin">
          <button>ADMIN.<button>ACTIVÉE</button></button>
        </router-link>
        <router-link v-else to="/Compte">
          <button>COMPTE</button>
        </router-link>
      </article>
      <sub>
        <router-link to="/Create">
          <button>PUBLIER</button>
        </router-link>
        <div class="message-container">
          <div v-for="message in messages" :key="message.id" class="message">
            <div>
              <span>
                Posté par
                {{
                  message.userName.charAt(0).toUpperCase() +
                  message.userName.slice(1)
                }}
                le
                {{
                  message.createdAt
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join(".") +
                  " à " +
                  message.createdAt.slice(11, 16)
                }}
              </span>
              <div>ref # {{ message.id }}</div>
            </div>
            <div @click="commentPage(message.id)">
              <img :src="message.messageUrl" v-if="message.messageUrl !== ''" />
            </div>
            <p>
              {{ message.message }}
            </p>
            <div>
              <button @click="commentPage(message.id)">Commenter</button>
              <div v-if="isAdmin || message.UserId == id">
                <button @click="deleteMessage(message.id, message.UserId, id)">
                  Supprimer ce message
                </button>
              </div>
            </div>
          </div>
        </div>
      </sub>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import router from "../router";
import "../main.css";

export default {
  name: "Stream",
  data() {
    return {
      isAdmin: false,
      messages: [],
      id: "",
      name: "",
      creation: "",
    };
  },
  created: function () {
    let id = localStorage.getItem("userId");
    axios
      .get("http://localhost:3000/api/messages", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        if (res) {
          const rep = res.data.list;
          this.messages = rep;
          rep.splice(10);
          localStorage.setItem("MessageId", rep[0].id);
          console.log(this.messages);
        } else {
          console.log("aucun message");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let self = this;
    axios
      .get("http://localhost:3000/api/users/" + id, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res);
        self.id = res.data.id;
        self.name =
          res.data.userName.charAt(0).toUpperCase() +
          res.data.userName.slice(1);
        self.creation = res.data.createdAt
          .slice(0, 10)
          .split("-")
          .reverse()
          .join(".");
        self.isAdmin = res.data.isAdmin;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    commentPage(m) {
      console.log(m);
      localStorage.setItem("MessageId", m);
      router.push({ path: "/Comment" });
    },
    deleteMessage(a, b, c) {
      console.log(typeof a, typeof b, typeof c);
      let confirmMessageDeletion = confirm(
        "Voulez-vous supprimer cette image ? Tous les commentaires associés seront également supprimés."
      );
      if (confirmMessageDeletion == true) {
        axios
          .delete("http://localhost:3000/api/messages/", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            params: {
              messageId: a,
              messageUid: b,
              uid: c,
            },
          })
          .then((res) => console.log(res))
          .catch((error) => {
            location.reload();
            console.log("ligne 133 " + error);
          });
      } else {
        return;
      }
    },
    localClear() {
      localStorage.clear();
      router.push({ path: "/" });
    },
  },
};
</script>
<style scoped>
.message-container {
  display: flex;
  flex-flow: row wrap;
}
.message {
  background-color: rgb(190, 189, 183);
  color: rgb(21, 39, 70);
  margin: 1%;
  width: 47%;
  border-radius: 15px;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
.message img {
  margin: 4px;
  width: 98%;
  max-height: 430px;
}
@media only screen and (max-device-width: 769px) {
  .message {
    width: 97%;
  }
  #titles button {
    width: 45%;
  }
}
</style>
