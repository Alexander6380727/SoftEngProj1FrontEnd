<template>
  <div class="dashboard-page">
    <h1 class="welcome-text">{{ role }} Dashboard</h1>

    <!-- Display Dashboard Items for All Roles -->
    <div class="dashboard-grid">
      <DashboardBox
          v-for="item in dashboardItems"
          :key="item.route"
          :route="item.route"
          :icon="item.icon"
          :name="item.name"
      />
    </div>

    <!-- User-Specific Upcoming Bookings -->
    <div v-if="role === 'user'" class="user-dashboard-section">
      <h2>Upcoming Bookings</h2>
      <div v-if="bookings.length === 0">No upcoming bookings.</div>
      <ul v-else>
        <li v-for="booking in bookings" :key="booking.room_id">
          Room: {{ booking.room_id }}, Date: {{ booking.booking_date }},
          Time: {{ booking.start_time }} - {{ booking.end_time }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "../services/api";
import DashboardBox from "../components/DashboardBox.vue";

export default {
  components: {DashboardBox},
  data() {
    return {
      dashboardItems: [], // Items fetched from backend
      bookings: [], // User-specific bookings fetched for "user" role
      role: localStorage.getItem("role"), // User's role
    };
  },
  async created() {
    const token = localStorage.getItem("token");

    // Fetch dashboard items for all roles
    try {
      const response = await api.get("/dashboard", {params: {token}});
      this.dashboardItems = response.data;
    } catch (error) {
      alert("Failed to fetch dashboard items.");
    }

    // Fetch bookings if the role is "user"
    if (this.role === "user") {
      this.fetchUserBookings(token);
    }
  },
  methods: {
    async fetchUserBookings(token) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/booking/user-bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        this.bookings = data.bookings; // Populate bookings array
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    },
  },
};
</script>

<style>
.dashboard-page {
  padding: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.user-dashboard-section {
  margin-top: 40px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}
</style>