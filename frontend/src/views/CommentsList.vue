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
        <sub>
          <article>
            <div>
              <div>
                <p>Bonjour {{ nameCurrentUser }} !</p>
                <button @click="localClear">Se déconnecter</button>
              </div>
            </div>
            <div>
              <div>
                <p>Membre depuis le {{ creation }}</p>
              </div>
              <div>
                <router-link v-if="isAdmin" to="/Admin">
                  <button>ADMIN. <button>ACTIVÉE</button></button>
                </router-link>
              </div>
            </div>
            <div>
              Pour modérer les commentaires, veuillez vous rendre sur la page
              des commentaires.
            </div>
          </article>
        </sub>
        <sub>
          <h2>Liens vers tous les messages et leurs commentaires.</h2>
          <div>
            <span>DATE</span>
            <span>AUTEUR</span>
            <span>MESSAGE</span>
            <span>REF</span>
            <span>VOIR</span>
          </div>
          <div v-for="j in messages" :key="j">
            <div>
              <span>
                Le {{ j.createdAt.slice(0, 10).split("-").reverse().join(".") }}
              </span>
              <span>
                {{ j.userName.charAt(0).toUpperCase() + j.userName.slice(1) }}
              </span>
              <span> {{ j.message.slice(0, 10) }}...</span>
              <span> ref #{{ j.id }}</span>
              <span>
                <button @click="seeOnePost(j.id)">regarder ce Post</button>
              </span>
            </div>
          </div>
        </sub>
      </section>
    </div>
  </main>
</template>

<script>
import Home from "../components/Home";
import axios from "axios";
import router from "../router";
import "../main.css";

export default {
  name: "CommentsList",
  components: {
    Home,
  },
  data() {
    return {
      isAdmin: false,
      messages: [],
      nameCurrentUser: "",
      creation: "",
    };
  },
  created: function () {
    let id = localStorage.getItem("userId");
    let self = this;
    axios
      .get("http://localhost:3000/api/messages", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res);
        if (res) {
          self.messages = res.data.list;
          console.log(res.data.list);
        } else {
          console.log("aucun message");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
