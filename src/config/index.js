import axios from "axios";

let baseURL;
if (process.env.NODE_ENV == "development") {
  baseURL = `http://localhost:8088/api/v1`;
} else {
  baseURL = `//${location.hostname}:${location.port}/api/v1`;
}
const instance = axios.create({
  baseURL: baseURL,
  timeout: 0,
  headers: { "info-client": "express" },
});
export default instance;
