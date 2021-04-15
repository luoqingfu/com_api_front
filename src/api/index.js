import request from "../utils/request";
export default {
  list(obj = {}) {
    return request.get("/api/dashboard/chart", obj).then((res) => res.data);
  },
  //登陆
  login(obj = {}) {
    return request.post("/login/", obj).then((res) => res.data);
  },
  //获取所有接口
  get_api(obj) {
    return request.get("/api", { params: obj }).then((res) => res.data);
  },
  //获取所有项目
  get_project(obj) {
    return request.get("/project", { params: obj }).then((res) => res.data);
  },
  //筛选接口
  search_api(obj) {
    return request.get("/api/search", { params: obj }).then((res) => res.data);
  },
  //删除接口
  delete_api(obj) {
    return request.post("/api/del", obj).then((res) => res.data);
  },
  //修改接口
  edit_api(obj) {
    return request.post("/api/edit", obj).then((res) => res.data);
  },
};
