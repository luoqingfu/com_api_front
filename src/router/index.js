import Vue from "vue";
import VueRouter from "vue-router";
import NotFound from "../views/404";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
Vue.use(VueRouter);

const routes = [
  {
    path: "/user",
    hideInMenu: true,
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/UserLayout"),
    children: [
      {
        path: "/user",
        redirect: "/user/login",
      },
      {
        path: "/user/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/User/Login"),
      },
      {
        path: "/user/register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/User/Register"),
      },
    ],
  },
  {
    path: "/",
    meta: { authority: ["user", "admin"] },
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/BasicLayout"),
    children: [
      // dashboard
      {
        path: "/",
        redirect: "/dashboard/analysis",
      },
      {
        path: "/dashboard",
        name: "dashboard",
        meta: { icon: "dashboard", title: "仪表盘" },
        component: { render: (h) => h("router-view") },
        children: [
          {
            path: "/dashboard/analysis",
            name: "analysis",
            meta: { title: "分析页" },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Dashboard/Analysis"
              ),
          },
        ],
      },
      // form
      {
        path: "/form",
        name: "form",
        component: { render: (h) => h("router-view") },
        meta: { icon: "form", title: "资源管理" },
        children: [
          {
            path: "/form/api-form",
            name: "apiform",
            meta: { title: "接口" },
            component: () =>
              import(/* webpackChunkName: "form" */ "../views/Forms/ApiForm"),
          },
          {
            path: "/form/project-form",
            name: "projectform",
            meta: { title: "项目" },
            component: () =>
              import(
                /* webpackChunkName: "form" */ "../views/Forms/ProjectForm"
              ),
          },
        ],
      },
      // form
      {
        path: "/result",
        name: "result",
        component: { render: (h) => h("router-view") },
        meta: { icon: "form", title: "测试结果" },
        children: [
          {
            path: "/result",
            name: "result",
            meta: { title: "测试结果" },
            component: () =>
              import(
                /* webpackChunkName: "form" */ "../views/AutoTest/TestResult"
              ),
          },
        ],
      },

      {
        path: "*",
        name: "404",
        hideInMenu: true,
        component: NotFound,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path != from.path) {
    Nprogress.start();
  }

  next();
});
router.afterEach(() => {
  // to and from are both route objects.
  Nprogress.done();
});
export default router;
