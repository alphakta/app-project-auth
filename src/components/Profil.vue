<template>
  <div
    class="
      container--s container--s
      position-absolute
      top-50
      start-50
      translate-middle
    "
  >
    <div class="card container-fluid p-2">
      <h1 class="card-title text-center fs-4 fw-bold">Espace Perso</h1>
      <p>
        Salut,
        <span v-if="this.userInfos.user != ''">{{ this.userInfos.user }}</span>
        !
      </p>
      <img class="card-img-top" :src="this.userInfos.imageUrl" alt="" />

      <h3 class="my-3">Changer son mot de passe</h3>
      <div class="mb-3 d-flex justify-center">
        <input
          type="password"
          class="form-control me-3"
          id="old_password"
          v-model="this.old_password"
          placeholder="Ancien mot de passe"
        />
        <input
          type="password"
          class="form-control me-3"
          id="new_password"
          v-model="this.new_password"
          placeholder="Nouveau mot de passe"
        />
        <a
          :class="{ 'btn btn-secondary px-5': validatedFieldsPassword }"
          @click="this.changePassword()"
        >
          Valider
        </a>
      </div>
      <div id="alert-mail"></div>
      <h3 class="my-3">Changer l'adresse email</h3>
      <div class="mb-3 d-flex justify-center">
        <input
          type="email"
          class="form-control me-3"
          id="old_email"
          v-model="this.old_email"
          placeholder="Ancienne adresse mail"
        />
        <input
          type="email"
          class="form-control me-3"
          id="new_email"
          v-model="this.new_email"
          placeholder="Nouvelle adresse mail"
        />
        <a
          :class="{ 'btn btn-secondary px-5': validatedFieldsMail }"
          @click="this.changeMail()"
        >
          Valider
        </a>
      </div>
      <div id="alert-mail"></div>
      <div class="mb-3 d-flex justify-center">
        <input
          type="file"
          class="form-control me-5"
          ref="fileInput"
          accept="image/*"
          @change="onFilePicked"
        />
        <a class="button-bottom btn btn-secondary" @click="this.changeImage()">
          Changer de photo de profil</a
        >
      </div>
      <a
        class="button-bottom btn-d btn-danger p-3 my-2"
        @click="disconnectAccount()"
      >
        Déconnexion
      </a>
    </div>
    <div class="container_delete">
      <a @click="deleteAccount()"> Supprimer le compte</a>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Profil",
  props: {
    idUser: String,
  },
  data: () => {
    return {
      old_email: "",
      new_email: "",
      old_password: "",
      new_password: "",
      userInfos: {
        user: "",
        mail: "",
        password: "",
        image: null,
        imageUrl: "",
      },
      files: null,
      filename: null,
    };
  },
  async mounted() {
    if (this.$props.idUser != undefined) {
      const response = await this.getUsersInfos();

      for (const user of response) {
        if (this.$props.idUser == user._id) {
          this.userInfos = user;
          localStorage.setItem("userConnected", JSON.stringify(user));
        }
      }
    } else if (
      this.$props.idUser == undefined &&
      localStorage.getItem("userConnected") == null
    ) {
      this.$router.push({ name: "login" });
    } else {
      if (
        this.userInfos.user == "" &&
        this.userInfos.mail == "" &&
        this.userInfos.password == ""
      ) {
        this.userInfos = JSON.parse(localStorage.getItem("userConnected"));
      }
    }
    document.body.style.backgroundColor = "rgb(1, 71, 71)";
  },
  computed: {
    validatedFieldsMail: function () {
      if (this.old_email != "" && this.new_email != "") return true;
      else return false;
    },
    validatedFieldsPassword: function () {
      if (this.old_password != "" && this.new_password != "") return true;
      else return false;
    },
  },

  methods: {
    getUsersInfos() {
      return axios.get("http://localhost:5500/posts").then((response) => {
        return response.data;
      });
    },
    putUserInfos(userInfos) {
      axios
        .put("http://localhost:5500/posts/" + this.userInfos._id, userInfos)
        .then((response) => {
          console.log("PUT", response.status);
        })
        .catch((error) => {
          console.log("PUT", error);
        });
    },
    deleteUsersInfos() {
      axios
        .delete("http://localhost:5500/posts/" + this.userInfos._id)
        .then((response) => {
          console.log("DELETE", response.status);
        })
        .catch((error) => {
          console.log("DELETE", error);
        });
    },
    changeMail() {
      if (this.validatedFieldsMail == true) {
        if (
          this.old_email == this.userInfos.mail &&
          this.validateMail(this.new_email)
        ) {
          this.userInfos.mail = this.new_email;
          this.putUserInfos(this.userInfos);
          this.old_email = "";
          this.new_email = "";
          localStorage.removeItem("userConnected");
          localStorage.setItem("userConnected", JSON.stringify(this.userInfos));
          this.showAlert("L'adresse email a bien été modifié.", "success");
        } else {
          this.showAlert(
            "Les champs n'ont pas été remplis correctement.",
            "danger"
          );
        }
      }
    },
    changePassword() {
      if (this.validatedFieldsPassword == true) {
        if (this.old_password == this.userInfos.password) {
          this.userInfos.password = this.new_password;
          this.putUserInfos(this.userInfos);
          this.old_password = "";
          this.new_password = "";
          localStorage.removeItem("userConnected");
          localStorage.setItem("userConnected", JSON.stringify(this.userInfos));
          this.showAlert("Le mot de passe a bien été modifié.", "success");
        } else {
          this.showAlert(
            "Les champs n'ont pas été remplis correctement.",
            "danger"
          );
        }
      }
    },
    deleteAccount() {
      if (
        confirm(
          "Vous êtes sur le ponit de supprimer votrec compte. Etes vous sûr ?"
        )
      ) {
        this.deleteUsersInfos();
        this.disconnectAccount();
      }
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      this.files = event.target.files;
      this.filename = this.files[0].name;

      if (this.filename.lastIndexOf(".") <= 0) {
        return alert("Ajouter un fichier valide !");
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.userInfos.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(this.files[0]);
      // this.userInfos.image = files[0]
    },
    changeImage() {
      this.putUserInfos(this.userInfos);
      localStorage.removeItem("userConnected");
      localStorage.setItem("userConnected", JSON.stringify(this.userInfos));
    },
    showAlert: function (message, type) {
      var alertDiv = document.getElementById("alert-mail");
      var wrapper = document.createElement("div");
      wrapper.innerHTML =
        '<div class="alert alert-' +
        type +
        ' alert-dismissible" role="alert">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
      alertDiv.append(wrapper);
      setTimeout(function () {
        alertDiv.removeChild(wrapper);
      }, 2000);
    },
    validateMail: function (email) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    disconnectAccount() {
      localStorage.removeItem("userConnected");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style>
.card p span {
  font-weight: 800;
  /* text-transform: uppercase; */
  color: rgb(22, 79, 165);
}
.card-img-top {
  width: 70% !important;
  margin: auto;
  max-height: 200px;
}
.card h3 {
  font-size: 15px;
  font-style: italic;
  text-decoration: underline;
  color: rgb(22, 79, 165);
  font-weight: 400;
}

.btn-d {
  text-decoration: none;
  cursor: pointer;
}

.button-bottom {
  width: 70%;
  margin: auto;
}

a {
  background-color: #cccccc;
  color: #666666;
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
  padding-right: 3rem !important;
  padding-left: 3rem !important;
  padding: 0.375rem 0.75rem;
  text-decoration: none;
}
a:hover {
  color: #666666;
}
.container_delete {
  position: absolute;
  top: 5px;
  right: 0;
}
.container_delete a {
  box-sizing: border-box;
  padding: 5px !important;
  font-style: 15px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
}
.container_delete a:hover {
  opacity: 0.95;
}
.card-img-top {
  max-height: 250px;
}
@media screen and (max-width: 650px) {
  .card .mb-3 {
    flex-direction: column;
  }
}
</style>