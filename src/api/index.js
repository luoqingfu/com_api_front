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
  //新建接口
  create_api(obj) {
    return request.post("api", obj).then((res) => res.data);
  },
  //类postman接口测试，
  postman_api(obj) {
    return request.post("/api/sendRequest", obj).then((res) => res.data);
  },
  //获取项目列表
  project_get(obj) {
    return request.get("/project", { params: obj }).then((res) => res.data);
  },
  //删除项目
  project_del(obj) {
    return request.post("project/del", obj).then((res) => res.data);
  },
  //搜索项目
  project_search(obj) {
    return request
      .get("project/search", { params: obj })
      .then((res) => res.data);
  },
  //新建项目
  project_create(obj) {
    return request.post("/project", obj).then((res) => res.data);
  },
  //获取项目测试结果
  project_get_testsummary(obj) {
    return request
      .get("apitest/summary", { params: obj })
      .then((res) => res.data);
  },
};
