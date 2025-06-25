import axios from "../config";

class LoginService {
  axios;
  constructor() {
    this.axios = axios;
  }
  loginAccount(userAccount) {
    console.log(userAccount);

    let url = "/user/login";
    return axios
      .get(url, {
        params: {
          userName: userAccount.userName,
          password: userAccount.password,
        },
      })
      .then((request) => request.data);
  }
}

const service = new LoginService();
export default service;
