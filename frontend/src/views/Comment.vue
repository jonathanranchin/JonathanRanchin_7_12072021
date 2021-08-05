<template>
  <main>
    <div>
      <p>Vous consultez les commentaires</p>
      <Home></Home>
    </div>
    <div>
      <article id="panelComment">
        <div>
          <div>
            <div>
              <p>Bonjour {{ nameCurrentUser }} !</p>
              <p>Membre depuis le {{ creationUser }}</p>
              <router-link to="/Stream">
                <button>Revenir à l'Acceuil</button>
              </router-link>
            </div>
            <div>
              <router-link v-if="isAdmin" to="/Admin"
                ><button type="button">
                  ADMIN. <button>ACTIVÉE</button>
                </button></router-link
              >
              <router-link v-else to="/Compte"
                ><button type="button">COMPTE</button></router-link
              >
            </div>
          </div>
          <div>
            <router-link to="/Create"
              ><button type="button">CREER UNE PUBLICATION</button></router-link
            >
          </div>
          <div></div>
        </div>
      </article>
      <!--Section message -->
      <section>
        <div>
          <span> Posté par {{ messageUserName }} le {{ creation }} </span>
          <div>ref # {{ messageId }}</div>
        </div>
        <div>
          <p>
            <router-link to="/Comment"
              ><img
                :src="messageUrl"
                v-if="messageUrl !== ''"
                alt="image postée par utilisateur"
            /></router-link>
          </p>
        </div>
        <div>
          <div>
            <p>{{ message }}</p>
          </div>
          <div v-if="isAdmin || messageUserId == currentUserId">
            <button
              @click="deleteMessage(messageId, messageUserId, currentUserId)"
            >
              Supprimer ce Post
            </button>
          </div>
          <div v-if="isAdmin || messageUserId == currentUserId">
            <router-link to="/Modify">
              <button>Modifier ce Post</button>
            </router-link>
          </div>
        </div>
      </section>
    </div>
    <!-- section commentaire(s) -->
    <section>
      <router-link to="/CreateComment"
        ><p v-if="comments.length == 0">
          Aucun commentaire pour l'instant, soyez le premier à en créer un !
        </p></router-link
      >
      <router-link to="/CreateComment"
        ><button type="button">COMMENTER</button></router-link
      >
      <div v-for="comment in comments" :key="comment" class="comment">
        <div>
          <p>
            Commentaire rédigé le
            {{ comment.createdAt.slice(0, 10).split("-").reverse().join("/") }}
            par
            {{
              comment.User.userName.charAt(0).toUpperCase() +
              comment.User.userName.slice(1)
            }}
          </p>
        </div>
        <div>
          <p>{{ comment.comment }}</p>
        </div>
        <div>
          <p>
            <span> n°{{ comment.id }}</span>
          </p>
          <div v-if="isAdmin || comment.UserId == currentUserId">
            <router-link to="/ModifyComment">
              <button
                @click="
                  setCommentValues(comment.id, comment.UserId, currentUserId)
                "
              >
                Modifier son commentaire
              </button></router-link
            >
          </div>
          <div v-if="isAdmin || comment.UserId == currentUserId">
            <button
              @click="deleteComment(comment.id, comment.UserId, currentUserId)"
            >
              Supprimer son commentaire
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Home from "../components/Home";
import axios from "axios";
import router from "../router";
import "../main.css";

export default {
  name: "Comment",
  components: {
    Home,
  },
  data() {
    return {
      isAdmin: false,
      comments: [],
      creation: "",
      messageUserName: "",
      messageUserId: "",
      message: "",
      messageId: "",
      messageUrl: "",
      nameCurrentUser: "",
      currentUserId: "",
      creationUser: "",
    };
  },
  created: function () {
    let MessageId = localStorage.getItem("MessageId");
    let self = this;
    axios
      .get("http://localhost:3000/api/messages/" + MessageId, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res);
        self.creation = res.data.createdAt
          .slice(0, 10)
          .split("-")
          .reverse()
          .join(".");
        self.messageUserName = res.data.userName;
        self.messageUserId = res.data.userId;
        self.message = res.data.message;
        self.messageId = res.data.id;
        self.messageUrl = res.data.messageUrl;
      })
      .catch((error) => {
        alert(error);
      });
    let id = localStorage.getItem("userId");
    axios
      .get("http://localhost:3000/api/users/" + id, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        self.isAdmin = res.data.isAdmin;
        self.nameCurrentUser =
          res.data.userName.charAt(0).toUpperCase() +
          res.data.userName.slice(1);
        self.creationUser = res.data.createdAt
          .slice(0, 10)
          .split("-")
          .reverse()
          .join(".");
        self.currentUserId = res.data.id;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("http://localhost:3000/api/comments/" + MessageId, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then(function (res) {
        self.comments = res.data;
        console.log(self.comments);
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
    deleteMessage(messageId, messageUserId, currentUserId) {
      let confirmMessageDeletion = confirm(
        "Voulez-vous vraiment supprimer cette image ? Tous les commentaires associés seront également supprimés."
      );
      if (confirmMessageDeletion == true) {
        axios
          .delete("http://localhost:3000/api/messages/", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            params: {
              messageId: messageId,
              messageUid: messageUserId,
              uid: currentUserId,
            },
          })
          .then((res) => console.log(res))
          .catch((error) => {
            console.log("ligne 133 " + error);
          });
        alert(
          "Au click sur ok, le message (et ses commentaires) seront supprimé ave un retour à l'accueil."
        );
        router.push({ path: "/Stream" });
      } else {
        return;
      }
    },
    setCommentValues(commId, commUid, currentUid) {
      localStorage.setItem("commentId", commId);
      localStorage.setItem("commentUserId", commUid);
      localStorage.setItem("currentUID", currentUid);
    },
    deleteComment(commId, commUid, currentUid) {
      let confirmCommentDeletion = confirm(
        "Voulez-vous vraiment suppimer votre commentaire ?"
      );
      if (confirmCommentDeletion == true) {
        axios
          .delete("http://localhost:3000/api/comments/" + commId, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            params: {
              commentId: commId,
              commentUid: commUid,
              currentUid: currentUid,
            },
          })
          .then((res) => {
            console.log(res);
            alert("Cliquez sur ok et le commentaire sera supprimé");
            location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        return;
      }
    },
  },
};
</script>
<style scoped>
main {
  display: block;
  margin-left: 5px;
}
section img {
  max-width: 500px;
}
.comment {
  background: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  padding: 5px;
  margin: 1%;
  width: 50%;
  color: rgb(21, 39, 70);
  font-weight: 700;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>
