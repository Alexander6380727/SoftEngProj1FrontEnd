<template>
  <div class="dashboard-box" @click="navigate">
    <i :class="['fa', icon]" class="dashboard-icon"></i>
    <p class="dashboard-text">{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: "DashboardBox",
  props: {
    route: {
      type: String,
      required: true, // The route to navigate to, like "/book-room"
    },
    name: {
      type: String,
      required: true, // The name of the dashboard item, like "Book Room"
    },
    icon: {
      type: String,
      required: true, // FontAwesome icon to show, like "fa-calendar"
    },
  },
  methods: {
    navigate() {
      this.$router.push(this.route); // Navigate to the route when clicked
    },
  },
};
</script>

<style scoped>
.dashboard-box {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  margin: 10px;
  width: 170px;
  height: 170px;
  transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.1);
}

.dashboard-box:hover {
  background-color: #e3f2fd; /* Light blue on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Darker shadow on hover */
}

.dashboard-text {
  font-size: 16px; /* Adjust font size as needed */
  font-weight: bold; /* Optional: make the text bold */
  color: black; /* Make the font color explicitly black */
  margin-top: 10px;
}

.dashboard-icon {
  font-size: 30px;
  color: #1976D2; /* Primary color for icons */
  margin-bottom: 10px;
}
</style>