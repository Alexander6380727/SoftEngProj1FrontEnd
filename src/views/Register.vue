<template>
  <div class="register-page">
    <h1>Register New User</h1>

    <form @submit.prevent="register">
      <label>Username</label>
      <input v-model="username" placeholder="Enter username" required />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="Enter password" required />

      <label>Role</label>
      <select v-model="role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      username: "",
      password: "",
      role: "user",
    };
  },
  methods: {
    async register() {
      try {
        await api.post("/register", {
          username: this.username,
          password: this.password,
          role: this.role,
        });
        alert("User registered successfully!");
      } catch (error) {
        alert("Registration failed!");
      }
    },
  },
};
</script>

<style>
.register-page {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
</style>
