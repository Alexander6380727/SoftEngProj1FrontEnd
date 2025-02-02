<template>
  <div class="dashboard-page">
    <h1 class="welcome-text">{{ role }} Dashboard</h1>

    <!-- Dashboard Items -->
    <div class="dashboard-grid">
      <DashboardBox
        v-for="item in dashboardItems"
        :key="item.route"
        :route="item.route"
        :icon="item.icon"
        :name="item.name"
      />
    </div>

    <!-- User Dashboard View -->
    <div v-if="role === 'user'" class="user-dashboard-section">
      <h2 class="upcoming-bookings-title">Your Upcoming Bookings</h2>
      <div v-if="bookings.length === 0">No upcoming bookings.</div>
      <ul v-else>
        <li v-for="booking in bookings" :key="booking.id" class="booking-item">
          Room: {{ booking.room_id }}, Date: {{ booking.booking_date }},
          Time: {{ booking.start_time }} - {{ booking.end_time }}
        </li>
      </ul>
    </div>

    <!-- Admin Dashboard View -->
    <div v-if="role === 'admin'" class="admin-dashboard-section">
      <h2 class="upcoming-bookings-title">Today's Bookings</h2>
      <div v-if="bookings.length === 0">No bookings for today.</div>
      <ul v-else>
        <li v-for="booking in bookings" :key="booking.id" class="booking-item">
          User: {{ booking.user_id }}, Room: {{ booking.room_id }},
          Date: {{ booking.booking_date }}, Time: {{ booking.start_time }} - {{ booking.end_time }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "../services/api";
import DashboardBox from "../components/DashboardBox.vue";

export default {
  components: { DashboardBox },
  data() {
    return {
      dashboardItems: [], // Items fetched from the backend
      bookings: [], // Bookings fetched for both user and admin roles
      role: localStorage.getItem("role"), // User role
    };
  },
  async created() {
    const token = localStorage.getItem("token");

    // Fetch dashboard items (for all roles)
    try {
      const response = await api.get("/dashboard", { params: { token } });
      this.dashboardItems = response.data;
    } catch (error) {
      alert("Failed to fetch dashboard items.");
    }

    // Fetch bookings based on the role
    if (this.role === "user") {
      this.fetchUserBookings(token);
    } else if (this.role === "admin") {
      this.fetchAdminBookings(token);
    }
  },
  methods: {
    async fetchUserBookings(token) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user-bookings/${localStorage.getItem("user_id")}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user bookings.");
        }

        const data = await response.json();
        this.bookings = data.bookings;
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    },

    async fetchAdminBookings(token) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/admin-bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admin bookings.");
        }

        const data = await response.json();
        this.bookings = data.bookings;
      } catch (error) {
        console.error("Error fetching admin bookings:", error);
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

.upcoming-bookings-title {
  color: #1976D2;
  font-size: 1.5em;
}

.booking-item {
  color: black;
  font-size: 1em;
}

.no-bookings-text {
  color: gray;
  font-style: italic;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}
</style>