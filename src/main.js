// import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
// Vuetify
import vuetify from "./plugins/vuetify";

const app = createApp(App);

app.use(VueAxios, axios);
app.use(router);
app.use(vuetify);
app.use(store);
app.mount("#app");
