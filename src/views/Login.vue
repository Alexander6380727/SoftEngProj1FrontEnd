<template>
  <div class="page">

    <form @submit.prevent="login" class="sections">
      <div style="text-align: center;">
        <h1>LabSolve</h1>
      </div>
      
      <label>Username</label>
      <input v-model="username" placeholder="Enter your username" required />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="Enter your password" required />

      <button type="submit" class="login-btn">Sign In</button>
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
      console.log("Attempting to log in with:", this.username, this.password); // Debugging line
      try {
        const response = await api.post("/auth/login", {
          username: this.username,
          password: this.password,
        });

        const { access_token, role, user_id } = response.data;

        // Store user information
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("user_id", user_id); // Store the user ID

        console.log("Login successful. Token:", access_token, "User ID:", user_id);

        // Navigate to dashboard
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please check your credentials.");
      }
    },
  },
};
</script>

<style scoped>
/* Labels */
label {
  font-size: 14px;
  color: black; /* Set label color to black */
  margin-bottom: 5px;
  text-align: left;
  display: block;
}

/* Input Fields */
input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #1976D2; /* Use primary color */
}

/* Login Button */
.login-btn {
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

.login-btn:hover {
  background-color: #155a8a; 
}
</style>
