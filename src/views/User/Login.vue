<template>
  <div class="login-container">
    <h3 class="lgin-intro">接口测试平台</h3>
    <a-form id="components-form-demo-normal-login" class="login-form">
      <a-form-item class="user-item">
        <a-input placeholder="Username" v-model="input_username">
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item class="pwd-item">
        <a-input
          type="password"
          placeholder="Password"
          v-model="input_password"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          style="width: 100%"
          class="login-form-button"
          @click="commit_login()"
        >
          Log in
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import service from "../../api";
import { serializeData } from "../../utils/common";
export default {
  data() {
    return {
      uid: "",
      username: "",
      token: "",
      input_username: "",
      input_password: "",
    };
  },
  methods: {
    commit_login() {
      let re = {
        username: this.input_username,
        password: this.input_password,
      };

      service.login(serializeData(re)).then((res) => {
        if (res.code === 200) {
          // 添加用户信息到本地
          this.$storage.sessionSet("web_token", res.data.token);
          this.$storage.localSet("username", res.data.username);
          this.$storage.sessionSet("uid", res.data.uid);
          this.$storage.sessionSet("username", res.data.username);
          this.$router.replace({
            path: "/dashboard/analysis",
          });
        } else {
          console.log("账号或者密码错误");
        }
      });
    },
  },
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 100px;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
</style>
