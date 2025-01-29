<template>
  <div class="login-page">
    <h1>Lab Management System</h1>

    <form @submit.prevent="login">
      <label>Username</label>
      <input v-model="username" placeholder="Enter your username" required />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="Enter your password" required />

      <button type="submit">Sign In</button>
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
    };
  },
  methods: {
    async login() {
      try {
        const response = await api.post("/auth/login", {
          username: this.username,
          password: this.password,
        });
        const {access_token, role} = response.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role);

        this.$router.push("/dashboard");
      } catch (error) {
        alert("Login failed. Please check your credentials.");
      }
    },
  },
};
</script>

<style scoped>
/* General Styles */
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

/* Logo */
.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  fill: #1a73e8;
}

/* Title */
.title {
  font-size: 24px;
  color: black; /* Set title color to black */
  margin: 10px 0 20px;
  font-weight: bold;
}

/* Labels */
.label {
  font-size: 14px;
  color: black; /* Set label color to black */
  margin-bottom: 5px;
  text-align: left;
  display: block;
}

/* Input Fields */
.input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #1a73e8;
}

/* Login Button */
.login-btn {
  background-color: #1a73e8;
  color: white;
  width: 100%;
  max-width: 300px;
  padding: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #155bb5;
}
</style>
