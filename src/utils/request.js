import axios from "axios";
import Vue from "vue";
import router from "../router";
// 创建axios实例
const service = axios.create({
  baseURL: "http://127.0.0.1:8000", // api的base_url
  timeout: 300000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求头中加入Jwt验证
    config.headers.Authorization =
      "JWT " + Vue.prototype.$storage.sessionGet("web_token");
    console.log("拦截request");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  // console.log('响应', response)
  (response) => {
    if (response.status === 200) {
      console.log("响应response");
    }
    return response;
  },
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      router.replace({
        path: "/user",
      });
      console.log("111" + error); // for debug
    } else {
      console.log("err" + error);
    }
    return Promise.reject(error);
  }
);

export default service;
