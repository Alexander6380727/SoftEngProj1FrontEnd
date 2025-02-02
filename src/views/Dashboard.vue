<template>
  <div class="page">
    <h1 class="welcome-text">{{ capitalizedRole }} Dashboard</h1>
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
    <div class="sections">
      <!-- User Dashboard View -->
      <div v-if="role === 'user'" class="user-dashboard-section">
        <h2>Your Upcoming Bookings</h2>
        <div v-if="bookings.length === 0">No upcoming bookings.</div>
        <ul v-else>
          <li v-for="booking in bookings" :key="booking.id">
            Room: {{ booking.room_id }}, Date: {{ booking.booking_date }},
            Time: {{ booking.start_time }} - {{ booking.end_time }}
          </li>
        </ul>
      </div>

      <!-- Admin Dashboard View -->
      <div v-if="role === 'admin'" class="admin-dashboard-section">
        <h2>Today's Bookings</h2>
        <div v-if="bookings.length === 0">No bookings for today.</div>
        <ul v-else>
          <li v-for="booking in bookings" :key="booking.id">
            User: {{ booking.user_id }}, Room: {{ booking.room_id }},
            Date: {{ booking.booking_date }}, Time: {{ booking.start_time }} - {{ booking.end_time }}
          </li>
        </ul>
      </div>
      <!-- Admin Dashboard View -->
      <div v-if="role === 'admin'" class="admin-dashboard-section">
        <h2>Today's Bookings</h2>
        <div v-if="bookings.length === 0">No bookings for today.</div>
        <ul v-else>
          <li v-for="booking in bookings" :key="booking.id">
            User: {{ booking.user_id }}, Room: {{ booking.room_id }},
            Date: {{ booking.booking_date }}, Time: {{ booking.start_time }} - {{ booking.end_time }}
          </li>
        </ul>
      </div>
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
  computed: {
    capitalizedRole() {
      return this.role ? this.role.charAt(0).toUpperCase() + this.role.slice(1) : '';
    }
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
        const response = await fetch(`http://127.0.0.1:8000/booking/user-bookings/${localStorage.getItem("user_id")}`, {
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
        const response = await fetch("http://127.0.0.1:8000/booking/admin-bookings", {
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

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.dashboard-grid {
  align-items: center;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.input-container {
  margin: 20px 0;
}

.btn {
  background-color: #1976D2; /* Primary color */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #155a8a; /* Darker shade on hover */
}

.input-container {
  margin: 20px 0;
}

.btn {
  background-color: #1976D2; /* Primary color */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #155a8a; /* Darker shade on hover */
}

.user-dashboard-section {
  margin-top: 40px;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>