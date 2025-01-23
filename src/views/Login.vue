<template>
  <div class="login-page">
    <!-- Circle with Icon -->
    <div class="icon-container">
      <div class="circle">
        <i class="fas fa-user"></i>
      </div>
      <div class="orbit"></div>
    </div>

    <!-- Welcome Text -->
    <div class="welcome-text">
      <h1>LabSolve</h1>
      <p>For all your booking needs</p>
    </div>

    <!-- Login Form -->
    <form class="login-form" @submit.prevent="login">
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit" class="btn login-btn">Log In</button>
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
  background-color: #fff;
  text-align: center;
  font-family: Arial, sans-serif;
}

/* Icon and Circle */
.icon-container {
  position: relative;
  margin-bottom: 20px;
}

.circle {
  width: 80px;
  height: 80px;
  border: 2px solid black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.orbit {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 120px;
  height: 120px;
  border: 2px dotted black;
  border-radius: 50%;
}

/* Welcome Text */
.welcome-text {
  width: 100%; /* Ensures it spans the full width of the parent */
  max-width: 300px; /* Restricts the maximum width for desktop and mobile */
  margin: 0 auto; /* Centers the text within its parent container */
  text-align: center; /* Ensures the text remains centered */
  padding: 0 10px; /* Adds padding for mobile accessibility */
  box-sizing: border-box; /* Includes padding in width calculations */
}

.welcome-text h1 {
  font-size: 24px; /* Adjust as needed for mobile readability */
  margin: 10px 0;
}

.welcome-text p {
  font-size: 14px; /* Smaller font size for the description */
  color: #555; /* Subtle color for text */
  word-wrap: break-word; /* Ensures long words break into a new line */
}

/* Login Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
  width: 100%;
  max-width: 300px;
}

.login-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.login-form input:focus {
  outline: none;
  border-color: black;
}

.login-btn {
  background-color: black;
  color: white;
  padding: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .circle {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .orbit {
    width: 90px;
    height: 90px;
  }

  .welcome-text h1 {
    font-size: 20px;
  }

  .welcome-text p {
    font-size: 12px;
  }

  .login-form {
    max-width: 250px;
  }

  .login-btn {
    padding: 8px 15px;
    font-size: 12px;
  }
}
</style>
