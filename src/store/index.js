import Vuex from "vuex";
import VuexPersistance from "vuex-persist";
import axios from "../config";

const vuexLocal = new VuexPersistance({
  storage: window.localStorage,
});
export default new Vuex.Store({
  state: {
    userAccount: {
      userName: "",
      password: "",
      role: "",
      profileName: "",
      domain: "",
    },
    wifiCustomer: false,
    uiAccept: {},
  },
  plugins: [vuexLocal.plugin],
  mutations: {
    updateUserAccount: function (state, value) {
      state.userAccount = value;
      if (value.password != undefined) {
        axios.defaults.headers.common["Authorization"] = `${value.password}`;
      } else {
        axios.defaults.headers.common["Authorization"] = ``;
      }
    },
    updateWifiCustomer: function (state, value) {
      state.wifiCustomer = value;
    },
    updateUiAccept: function (state, value) {
      state.uiAccept = value;
    },
  },
  actions: {},
});
