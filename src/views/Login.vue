<template>
  <div class="login-page">
    <!-- Logo -->
    <div class="logo-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="80"
        height="80"
        fill="currentColor"
        class="logo"
      >
        <path d="M5 22h14l-4-12V4h1a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2h1v6L5 22Zm7-12.586L14.586 18H9.414L12 9.414ZM9.414 20h5.172l.5 1H8.914l.5-1ZM13 6h-2V4h2v2Z" />
      </svg>
    </div>

    <!-- Title -->
    <h1 class="title">Lab Management System</h1>

    <!-- Login Form -->
    <form class="login-form" @submit.prevent="login">
      <label for="email" class="label">Email</label>
      <input id="email" v-model="username" placeholder="Enter your email" class="input" />

      <label for="password" class="label">Password</label>
      <input
        id="password"
        type="password"
        v-model="password"
        placeholder="Enter your password"
        class="input"
      />

      <button type="submit" class="btn login-btn">Sign In</button>
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
        const { access_token, role } = response.data;

        // Store token and role in local storage
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role);

        // Navigate to the appropriate page based on the role
        this.$router.push(role === "admin" ? "/admin" : "/user");
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
