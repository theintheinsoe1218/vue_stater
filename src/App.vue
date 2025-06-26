<template>
  <v-app>
    <div>
      <v-app-bar fixed dark class="hidden-print-only py-2 mb-3">
        <v-app-bar-nav-icon
          class="ml-2"
          v-if="!showComputer"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>
          <router-link to="/" class="logo-link">
            <!-- <v-img src="/logo.jpg" alt="Highness Detal" max-width="120" contain /> -->
          </router-link>
        </v-toolbar-title>

        <v-row class="d-none d-md-flex" dense justify="end">
          <v-btn
            v-for="item in menu"
            :key="item"
            @focus="selectedComputer = item"
            :class="{ 'active-btn': selectedComputer === item }"
            class="ms-2 font-weight-bold hover-effect"
            @click="changeRouter(`/${item.trim().toLowerCase()}`, item)"
          >
            {{ item }}
          </v-btn>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="settingHide"
                v-bind="props"
                @focus="selectedComputer = 'set'"
                class="font-weight-bold hover-effect"
                :class="{ 'active-btn': selectedComputer === 'set' }"
              >
                <span class="ml-2" style="text-transform: none">SETTINGS</span>
                <v-icon>mdi-menu-down-outline</v-icon>
              </v-btn>
            </template>

            <v-list density="compact">
              <v-list-item
                v-for="(item, i) in settings"
                :key="i"
                :value="item"
                @click="changeRouter(item.value, item.clickPath)"
                @focus="selectedComputer = 'set'"
                :class="{ 'active-btn': selectedComputer === item }"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <template v-slot:append>
              <div class="pa-2">
                <v-btn
                  class="red--text"
                  block
                  rounded
                  color="primary"
                  @click="changeRouter('/logout', 'Home')"
                >
                  <v-icon>mdi-logout</v-icon>Logout
                </v-btn>
              </div>
            </template>
          </v-menu>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props">
                <span class="ml-2" style="text-transform: none">{{ loginUser.profileName }}</span>
              </v-btn>
            </template>

            <v-list nav density="compact">
              <v-list-item
                v-for="(item, i) in profileList"
                :key="i"
                :value="item"
                @click="changeRouter(item.value, item.clickPath)"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" fixed temporary>
        <v-list class="mt-3">
          <v-list-item
            v-for="item in menu"
            :key="item"
            link
            @focus="selectedComputer = item"
            :class="{ 'active-drawer': selectedComputer === item }"
            class="ms-2 font-weight-bold"
            @click="changeRouter(`/${item.toLowerCase()}`, item)"
          >
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-list v-model:opened="open" class="pl-2">
          <v-list-group value="Users">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Settings"></v-list-item>
            </template>

            <v-list-item
              v-for="(item, i) in settingsmenu"
              :key="i"
              :value="item"
              @click="changeRouter(item.value, item.clickPath)"
              @focus="selectedComputer = 'set'"
              :class="{ 'active-btn': selectedComputer === item }"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn
              class="red--text"
              block
              rounded
              color="primary"
              @click="changeRouter('/logout', 'Home')"
            >
              <v-icon>mdi-logout</v-icon>Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <div class="mt-12 hidden-print-only" style="margin-bottom: 100px"></div>
      <v-container fluid class="mt-5 pa-0">
        <router-view v-slot="{ Component }">
          <transition name="fade-page" mode="out-in">
            <component :is="Component" :hideToolbar="hideToolbar" />
          </transition>
        </router-view>
      </v-container>

      <div>
        <v-dialog v-model="logoutModel" persistent max-width="350">
          <v-card>
            <v-card-title class="title">ထွက်ရန် သေချာပြီလား?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="logoutModel = false">မလုပ်ပါ</v-btn>
              <v-btn color="primary" depressed @click="logout">ထွက်မည်</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <div>
        <v-dialog v-model="passwordModel" persistent max-width="400">
          <v-form ref="form" v-model="valid">
            <v-card>
              <v-card-title class="headline">စကား၀ှက် ပြောင်းတော့မှာလား?</v-card-title>
              <v-card-text class="pb-0">
                <v-text-field
                  :append-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showOld ? 'text' : 'password'"
                  @click:append="showOld = !showOld"
                  :rules="passwordOldRule"
                  v-model="password.old"
                  label="Old Password"
                  name="oldPassword"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showNew ? 'text' : 'password'"
                  @click:append="showNew = !showNew"
                  :rules="passwordNewRule"
                  v-model="password.new"
                  label="New Password"
                  name="newPassword"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="cancelChangePassword">မပြောင်းတော့ပါ</v-btn>
                <v-btn color="primary" :disabled="!valid" depressed @click="changePassword"
                  >ပြောင်းမည်</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </div>
    </div>
    <div>
      <v-overlay :model-value="loading" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
      </v-overlay>
    </div>
  </v-app>
</template>

<script>
import accountUserService from "./service/UserAccountService";
import axios from "../src/config";
export default {
  data() {
    return {
      hiddenToolbar: true,
      logoutModel: false,
      passwordModel: false,
      showOld: false,
      showNew: false,
      password: {},
      valid: true,
      passwordOldRule: [(v) => !!v || "Old Password is required"],
      passwordNewRule: [(v) => !!v || "New Password is required"],
      setting: {},
      limitDialog: false,
      loginUser: "",
      loadingCount: 0,
      loading: false,
      drawer: false,
      mini: true,
      menu: [""],
      selectIndex: "home",
      selectedComputer: "Home",
      clickPath: "About",
      settingHide: true,
      settings: [
        // {
        //   title: "Logout",
        //   icon: "mdi-logout",
        //   value: "/logout",
        //   clickPath: "LogOut",
        // },
      ],
      settingsmenu: [],
      currentYear: "",
      profileList: [
        {
          title: "Change Password",
          icon: "mdi-lock",
          value: "/change_password",
          clickPath: "Change Password",
        },
        {
          title: "Logout",
          icon: "mdi-logout",
          value: "/logout",
          clickPath: "LogOut",
        },
      ],
      profileListMenu: [
        {
          title: "Profile",
          icon: "mdi-emoticon-outline",
          value: "/userform",
          clickPath: "Profile",
        },
        {
          title: "Change Password",
          icon: "mdi-lock",
          value: "/change_password",
          clickPath: "Change Password",
        },
      ],
    };
  },
  props: {},
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    showComputer() {
      switch (this.$vuetify.display.name) {
        case "xs":
          return false;
        case "sm":
          return false;
        case "md":
          return true;
        case "lg":
          return true;
        case "xl":
          return true;
      }
    },
    isLogin: function () {
      let token = this.$store.state.userAccount.password;
      if (token == "") {
        return false;
      } else {
        axios.defaults.headers.common["Authorization"] = `${token}`;
        // this.uiAcceptMethod();
        return true;
      }
    },
  },
  mounted: function () {
    this.uiAccept = this.$store.state.uiAccept;
    this.hiddenToolbar = false;
    this.loginMounted();
    this.setActiveMenuFromRoute();

    axios.interceptors.request.use((config) => {
      this.loadingCount++;
      if (!this.loading) {
        this.loading = true;
      }
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        this.loadingCount--;
        if (this.loadingCount == 0 && this.loading) {
          this.loading = false;
        }
        return response;
      },
      (error) => {
        if (error.isAxiosError && error.message == "Network Error") {
          this.$swal("အင်တာနက် လိုင်းမကောင်းပါ", error.message, "error");
          this.loadingCount = 1;
          this.loading = false;
        }
        if (error.response.data != null && error.response.data.status == 401) {
          this.$swal("Authentication Error", "ထွက်မည် ခလုတ်နှိပ်ပေးပါ", "error");
          this.changeRouter("/logout", "Home");
          this.logout();
        }
        this.loadingCount--;
        if (this.loadingCount == 0 && this.loading) {
          this.loading = false;
        }
        return Promise.reject(error);
      }
    );
  },
  methods: {
    setActiveMenuFromRoute() {
      const currentPath = this.$route.path.replace("/", "").trim().toLowerCase();

      const found = this.menu.find((item) => item.trim().toLowerCase() === currentPath);
      this.selectedComputer = found || "Home";
    },

    clickDrawer: function (item) {
      this.drawer = false;
      this.changeRouter(item.value, item.clickPath);
    },
    changePassword: function () {
      accountUserService.changePassword(this.password.old, this.password.new).then((response) => {
        if (response > 0) {
          this.$swal("Successful", "Change Password", "success");
          this.logout();
        } else {
          this.$swal("unSuccessful", "Change Password", "error");
        }
        this.password = {
          old: "",
          new: "",
        };
      });
      this.passwordModel = false;
    },
    cancelChangePassword: function () {
      this.passwordModel = false;
      this.password = {};
    },
    hideToolbar: function (hide) {
      this.hiddenToolbar = hide;
      this.loginMounted();
    },
    changeRouter: function (path, clickPath) {
      this.drawer = false;

      if (path == "/logout") {
        this.logoutModel = true;
      } else if (path == "/change_password") {
        this.passwordModel = true;
      } else if (path == "/sale") {
        window.location.href = path;
      } else {
        this.clickPath = clickPath;
        document.cookie = "clickPath=" + clickPath;
        this.$router
          .push({
            path: path,
          })
          .catch(() => {});
      }
    },
    logout: function () {
      this.$store.commit("updateUserAccount", {
        userName: "",
        password: "",
        role: "",
      });
      this.changeRouter("/");
      this.logoutModel = false;
      this.hiddenToolbar = true;
    },
    loginMounted() {
      if (this.isLogin) {
        this.loginUser = this.$store.state.userAccount;

        this.hiddenToolbar = false;
        // this.settingHide = true;
      } else {
        this.hiddenToolbar = true;
        // this.$router.push("/login").catch(() => {});
        this.settingHide = false;
      }
    },
  },
  watch: {
    $route() {
      this.setActiveMenuFromRoute();
    },
  },
  components: {},
  name: "App",
};
</script>
<style scope>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html::-webkit-scrollbar {
  width: 0px;
}

html::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.699);
  border-radius: 3px;
}

html::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #084f91;
  padding: 3px;
  -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
}

div::-webkit-scrollbar {
  width: 10px;
  height: 0px;
}

div::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.699);

  border-radius: 3px;
}

div::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #084f91;
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.5);
}

.top-nav {
  background-color: #084f91 !important;
  color: #fff !important;
}

.active-btn {
  background: none !important;
  border-bottom: 3px solid #084f91 !important;
  border-radius: 0px !important;
}

.active-drawer {
  color: #084f91 !important;
}

.hover-effect:hover {
  background: none !important;
  border-bottom: 3px solid #084f91 !important;
  border-radius: 0px !important;
  transition: border-bottom 0.3s linear;
}

.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-page-enter-from,
.fade-page-leave-to {
  opacity: 0;
}
.fade-page-enter-to,
.fade-page-leave-from {
  opacity: 1;
}

.contact-bar {
  gap: 12px;
}
.contact-link {
  margin-left: 4px;
  font-size: 1rem;
  white-space: nowrap;
}
.contact-item {
  margin-bottom: 0;
}
@media (max-width: 960px) {
  .contact-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  .contact-item {
    margin-right: 0 !important;
    margin-bottom: 2px;
  }
  .contact-link {
    font-size: 0.97rem;
  }
}
@media (max-width: 600px) {
  .contact-bar {
    flex-direction: row;
    align-items: flex-start;
    gap: 0;
  }
  .contact-link {
    font-size: 0.93rem;
  }
}
</style>
