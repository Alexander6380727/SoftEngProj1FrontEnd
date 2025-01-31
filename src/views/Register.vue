<template>
  <div class="register-page">
    <form @submit.prevent="register" class="register-form">
      <div style="text-align: center;">
        <div style="text-align: center;">
        <h1>LabSolve</h1>
        </div>
        <h2> Register New User </h2>
      </div>
      <label>Username</label>
      <input v-model="username" placeholder="Enter username" required class="input" />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="Enter password" required class="input" />

      <label>Role</label>
      <select v-model="role" class="input">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" class="btn login-btn">Register</button>
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

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 70px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
}

label {
  margin-bottom: 5px;
  text-align: left;
  width: 100%;
}

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
  border-color: #1976D2; /* Use primary color */
}

.btn {
  background-color: #1976D2; /* Use primary color */
  color: white;
  width: 100%;
  max-width: 300px;
  padding: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.btn:hover {
  background-color: #155a8a; /* Darker shade on hover */
}
</style>
