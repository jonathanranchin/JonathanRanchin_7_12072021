<template>
  <main>
    <section>
      <form enctype="multipart/form-data">
        <div>
          <h1>{{ callName() }} vous allez modifier une publication</h1>
        </div>
        <div>
          <div>
            <label for="newMessage"
              >Donnez des détails sur votre publication.</label
            >
            <textarea
              v-on:keydown="isInvalid = false"
              v-model="newMessage"
              id="modifiedMessage"
              name="message"
              rows="8"
              placeholder="Saisissez votre message. (1500 caractères max)"
            ></textarea>
          </div>
          <div>
            <img :src="modifiedImage" />
            <p>
              un aperçu de votre post apparaîtra ici. Formats acceptés: jpg,
              jpeg, png et gif.
            </p>
          </div>
          <div>
            <div>
              <label for="File">Choisir une nouvelle photo</label>
              <input
                @change="selectFile()"
                type="file"
                ref="file"
                name="image"
                id="File"
                accept=".jpg, .jpeg, .gif, .png"
              />
            </div>
          </div>
        </div>
        <div>
          <div>
            <button type="submit" @click.prevent="send()">Valider</button>
          </div>
          <router-link to="/Stream">
            <button>Revenir à l'accueil</button>
          </router-link>
        </div>
        <div v-show="isInvalid" key="invalid">
          <p>
            Les posts doivent inclure une image et du texte 1500 charactère
            maximum.
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
  name: "Modify",
  data() {
    return {
      isAdmin: false,
      newImage: "",
      currentUserId: "",
      newMessage: "",
      file: null,
      messages: [],
      isInvalid: false,
    };
  },
  methods: {
    callName() {
      let name = localStorage.getItem("userName");
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    selectFile() {
      this.file = this.$refs.file.files[0];
      this.modifiedImage = URL.createObjectURL(this.file);
    },
    send() {
      if (
        !this.file ||
        !localStorage.getItem("userName") ||
        !this.modifiedMessage ||
        this.modifiedMessage > 1500
      ) {
        this.isInvalid = true;

        console.log("ligne 69" + this.file);
      } else {
        const formData = new FormData();
        formData.append("image", this.file);
        formData.append("UserId", localStorage.getItem("userId"));
        formData.append("message", this.modifiedMessage.toString());
        let messageId = localStorage.getItem("messageId");
        axios
          .put(
            "http://localhost:3000/api/messages/" + messageId,
            { formData, messageId },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          )
          .then(() => {
            this.UserId = "";
            this.newMessage = "";
            this.file = null;
            alert("publication modifié!");
            router.push({ path: "Stream" });
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
img {
  max-width: 30%;
}
</style>
