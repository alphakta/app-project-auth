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
    <div class="card container-fluid p-4">
      <form class="m-4">
        <h1
          class="card-title text-center fs-4 fw-bold"
          v-if="this.mode == 'login'"
        >
          Connexion
        </h1>
        <h1
          class="card-title text-center fs-4 fw-bold"
          v-if="this.mode == 'create'"
        >
          Inscription
        </h1>
        <h2 v-if="this.mode == 'login'" class="text-center fs-6 fw-italic m-2">
          Tu n'as pas de compte ?
          <span
            @click="this.switchCreateAccount"
            class="link link-secondary text-decoration-underline"
          >
            Inscription
          </span>
        </h2>

        <h2 v-if="this.mode == 'create'" class="text-center fs-6 fw-italic m-2">
          Tu as un compte ?
          <span
            @click="this.switchLoginAccount"
            class="link link-secondary text-decoration-underline"
          >
            Connexion
          </span>
        </h2>

        <div v-if="this.mode == 'create'" class="mb-3">
          <input
            v-model="this.userInfos.mail"
            type="email"
            class="form-control"
            id="mail"
            aria-describedby="emailHelp"
            placeholder="Adresse email"
          />
        </div>
        <div class="mb-3 d-flex justify-center">
          <input
            v-if="this.mode == 'create'"
            v-model="this.userInfos.user"
            type="email"
            class="form-control me-3"
            id="pseudo"
            aria-describedby="emailHelp"
            placeholder="Pseudo"
          />
          <input
            v-if="this.mode == 'login'"
            v-model="this.userInfos.mail"
            type="email"
            class="form-control me-3"
            id="mail"
            aria-describedby="emailHelp"
            placeholder="Adresse email"
          />
          <input
            v-model="this.userInfos.password"
            type="password"
            class="form-control"
            id="mdp"
            placeholder="Mot de passe"
          />
        </div>
        <a
          @click="loginAccount()"
          v-if="this.mode == 'login'"
          :class="{ 'btn btn-secondary px-5': validatedFields }"
        >
          Connexion
        </a>
        <a
          @click="createAccount()"
          v-if="this.mode == 'create'"
          :class="{ 'btn btn-secondary px-5': validatedFields }"
        >
          Inscription</a
        >
        <div id="alert" class="my-4"></div>
      </form>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
// const ObjectID = require('mongoose').Types.ObjectId

export default {
  name: "Login",
  data: () => {
    return {
      mode: "login",
      userInfos: {
        mail: "",
        user: "",
        password: "",
        imageUrl: "",
      },
      infos: [],
    };
  },
  mounted() {
    if (localStorage.getItem("userConnected") != null) {
      this.$router.push({ name: "profil" });
    }
    document.body.style.backgroundColor = "rgb(1, 71, 71)";
  },
  computed: {
    validatedFields: function () {
      if (this.mode == "create") {
        if (
          this.userInfos.mail != "" &&
          this.userInfos.password != "" &&
          this.userInfos.user != ""
        )
          return true;
        else return false;
      } else if (this.mode == "login") {
        if (this.userInfos.mail != "" && this.userInfos.password != "")
          return true;
        else return false;
      } else {
        return false;
      }
    },
  },
  methods: {
    switchCreateAccount: function () {
      this.mode = "create";
    },
    switchLoginAccount: function () {
      this.mode = "login";
    },
    createAccount: function () {
      if (this.validatedFields == true) {
        console.log(this.userInfos);
        if (!this.validateMail(this.userInfos.mail)) {
          this.showAlert("Erreur : l'email saisie est incorrect !", "danger");
        } else {
          var boolVerifAccount = true;

          const getUsers = async () => {
            const resultGetUsersInfos = await this.getUsersInfos();
            this.infos = resultGetUsersInfos;
            for (const user of this.infos) {
              if (
                user.mail == this.userInfos.mail ||
                user.password == this.userInfos.password
              ) {
                this.showAlert(
                  "Email ou mot de passe déjà utilisé !",
                  "danger"
                );
                boolVerifAccount = false;
              }
            }
            if (boolVerifAccount == true) {
              this.postUserInfos(this.userInfos);
              this.showAlert("Création du compte avec succès", "success");
            }
          };
          getUsers();
          this.mode = "login";
        }
      }
    },
    loginAccount: function () {
      if (this.validatedFields == true) {
        console.log(this.userInfos);
        if (!this.validateMail(this.userInfos.mail)) {
          this.showAlert("Erreur : l'email saisie est incorrect !", "danger");
        } else {
          var boolVerifAccount = false;

          const getUsers = async () => {
            const resultGetUsersInfos = await this.getUsersInfos();
            this.infos = resultGetUsersInfos;
            var idUSER = "";
            for (const user of this.infos) {
              if (
                user.mail == this.userInfos.mail &&
                user.password == this.userInfos.password
              ) {
                boolVerifAccount = true;
                idUSER = user._id;
                console.log(idUSER);
              }
            }
            // localStorage.setItem('storeData', JSON.stringify(this.infos))
            if (boolVerifAccount == true) {
              this.showAlert("Connexion du compte avec succcès !", "success");
              setTimeout(() => {
                this.$router.push({
                  name: "profil",
                  params: { idUser: idUSER },
                });
              }, 3200);
            } else {
              this.showAlert(
                "Adresse email ou mot de passe incorrect !",
                "danger"
              );
            }
          };
          getUsers();
        }
      }
    },
    validateMail: function (email) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    showAlert: function (message, type) {
      var alertDiv = document.getElementById("alert");
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
      }, 3000);
    },
    getUsersInfos() {
      return axios.get("http://localhost:5500/posts").then((response) => {
        return response.data;
      });
    },
    postUserInfos(userInfos) {
      axios
        .post("http://localhost:5500/posts", userInfos)
        .then((response) => {
          console.log("POST", response.status);
        })
        .catch((error) => {
          console.log("POST", error);
        });
    },
  },
};
</script>

<style>
.card-title {
  color: rgb(22, 79, 165);
}
h2 .link {
  cursor: pointer;
  color: rgb(22, 79, 165);
  font-style: italic;
  font-weight: 600;
}
.btn {
  background-color: rgb(22, 79, 165) !important;
}
.container--s {
  width: 50%;
}

@media screen and (max-width: 750px) {
  .container--s {
    width: 70%;
  }
}
</style>