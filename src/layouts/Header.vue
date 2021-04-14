<template>
  <a-dropdown class="header">
    <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
      {{ username }} <a-icon type="down" />
    </a>
    <a-menu slot="overlay">
      <a-menu-item key="0">
        <a target="_blank" rel="noopener noreferrer" @click="out_login"
          >退出登陆</a
        >
      </a-menu-item>
      <a-menu-divider />
    </a-menu>
  </a-dropdown>
</template>
<script>
export default {
  data() {
    return {
      username: this.$storage.localGet("username"),
    };
  },
  methods: {
    out_login() {
      this.$storage.sessionRemove("web_token");
      this.$storage.sessionRemove("username");
      this.$storage.sessionRemove("uid");
      this.$storage.localRemove("username");
      this.$router.replace({
        path: "/user",
      });
    },
  },
};
</script>
<style scoped>
.header {
  float: right;
  margin-right: 20px;
}
</style>
