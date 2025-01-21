<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return { username: "", password: "" };
  },
  methods: {
    async login() {
      const response = await api.post("/auth/login", { username: this.username, password: this.password });
      const { access_token, role } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      this.$router.push(role === "admin" ? "/admin" : "/user");
    },
  },
};
</script>
