<template>
  <div class="d-flex align-center justify-center" style="height: 90vh">
    <v-card variant="outlined" class="pa-3">
      <div>
        <center>
          <h2 class="text-primary mb-3">Company Name</h2>
        </center>
        <v-alert
          class="text-body-2"
          v-model="showError"
          :text="errorMessage"
          type="error"
        ></v-alert>
      </div>
      <v-sheet width="300" class="mx-auto">
        <v-form ref="form" v-model="valid">
          <v-text-field
            density="compact"
            v-model="userAccount.userName"
            label="User Name"
            variant="outlined"
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            density="compact"
            :rules="passwordRules"
            v-model="userAccount.password"
            label="password"
            variant="outlined"
            :type="showPassword ? 'text' : 'password'"
            @keyup.enter="accountLogin()"
            name="mbt"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
          <div class="text-right">
            <v-btn
              color="primary"
              style="text-transform: none"
              class="mt-2"
              @click="accountLogin"
              :disabled="!valid"
              >Login</v-btn
            >
          </div>
        </v-form>
      </v-sheet>
    </v-card>
  </div>
</template>
<script>
import loginService from "../service/LoginService";
export default {
  data() {
    return {
      valid: true,
      showPassword: false,
      userAccount: {
        userName: "",
        password: "",
      },
      nameRules: [(v) => !!v || "Name is required"],
      passwordRules: [(v) => !!v || "Password is required"],
      showError: false,
      errorMessage: "",
    };
  },
  props: {
    hideToolbar: Function,
  },
  methods: {
    phoneLogin: function () {
      this.$router.push("/loginphone").catch(() => {});
    },

    accountLogin: function () {
      //   console.log(this.userAccount);

      if (this.userAccount.userName.length != 0 && this.userAccount.password.length != 0) {
        loginService
          .loginAccount(this.userAccount)
          .then((data) => {
            this.$store.commit("updateUserAccount", data);
            // this.hideToolbar(false);
            this.$router.push("/").catch(() => {});
          })
          .catch((e) => {
            if (e != undefined) {
              this.showError = true;
              if (e.response == undefined) {
                this.errorMessage = "Server Error";
              } else {
                if (e.response.data == undefined) {
                  this.errorMessage = "No Internet Connection.";
                } else {
                  this.errorMessage = e.response.data.message;
                }
              }
            }
          });
      } else {
        this.showError = true;
        this.errorMessage = "Fill,User Name and Password.";
      }
    },
  },
};
</script>
