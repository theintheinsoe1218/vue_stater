import axios from "../config";

class UserAccountService {
  axios;
  constructor() {
    this.axios = axios;
  }

  getUiByUserId() {
    let url = `/ui/userId`;
    return this.axios.get(url).then((request) => request.data);
  }

  getUserList(userType, userName, userId) {
    let url = `/userAccount`;
    return axios
      .get(url, {
        params: {
          userType,
          userName,
          userId,
        },
      })
      .then((request) => request.data);
  }

  addUserList(user) {
    let url = `/userAccount`;
    return this.axios.post(url, user).then((request) => request.data);
  }

  updateUserList(userAccount) {
    let url = `/userAccount/${userAccount.userAccountId}`;
    return this.axios.put(url, userAccount).then((request) => request.data);
  }
  deleteUserList(userAccount) {
    let url = `/userAccount/${userAccount.userAccountId}`;
    return this.axios.delete(url).then((request) => request.data);
  }
  getUserAllList(userType) {
    let url = `/user`;
    return axios
      .get(url, {
        params: {
          userType,
        },
      })
      .then((request) => request.data);
  }
}

const service = new UserAccountService();
export default service;
