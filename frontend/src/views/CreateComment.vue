<template>
  <main>
    <section>
      <form enctype="multipart/form-data">
        <div>
          <h1>
            {{ callName() }} vous commentez la publication numéro
            <span> {{ callNumber() }}</span>
          </h1>
        </div>
        <div>
          <label for="newComment">À vos claviers...</label>
          <div>
            <textarea
              v-on:keydown="isInvalid = false"
              v-model="newComment"
              id="newComment"
              name="comment"
              rows="8"
              placeholder=" Saisissez votre commentaire ici. (1500 caractères max) "
            ></textarea>
          </div>
        </div>
        <div>
          <div>
            <button type="submit" @click.prevent="send()">Valider</button>
          </div>
          <router-link to="/Stream">
            <div><a>Annuler/Retour</a></div></router-link
          >
        </div>
        <div v-show="isInvalid" key="invalid">
          <p>
            Vous devez renseigner la case " Saisissez votre commentaire ici en
            respectant les instructions (1500 caractères max) "
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import router from "../router";
import "../main.css";

export default {
  name: "CreateComment",
  data() {
    return {
      isAdmin: false,
      currentUserId: "",
      newComment: "",
      comments: [],
      isInvalid: false,
    };
  },
  methods: {
    callName() {
      let name = localStorage.getItem("userName");
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    callNumber() {
      return localStorage.getItem("MessageId");
    },
    send() {
      if (
        !this.newComment ||
        !localStorage.getItem("userId") ||
        !localStorage.getItem("MessageId" || this.newComment.lemgth > 1500)
      ) {
        this.isInvalid = true;
      } else {
        let UserId = localStorage.getItem("userId");
        let comment = this.newComment.toString();
        let MessageId = localStorage.getItem("MessageId");

        axios
          .post(
            "http://localhost:3000/api/comments/",
            { UserId, comment, MessageId },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          )
          .then(() => {
            this.UserId = "";
            this.newMessage = "";

            alert("Commentaire Posté!");
            router.push({ path: "Comment" });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>
<style scoped>
textarea {
  width: 100%;
  height: 100%;
  margin: 1%;
}
a {
  color: white;
  text-decoration: none;
}
</style>
