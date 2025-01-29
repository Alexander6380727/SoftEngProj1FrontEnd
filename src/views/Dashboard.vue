<template>
  <div class="user-page">
    <h1>Your Dashboard</h1>
    <div class="dashboard-grid">
      <DashboardBox route="/book-room" icon="calendar">
        Book Room
      </DashboardBox>
      <DashboardBox route="/inventory" icon="inventory">
        View Inventory
      </DashboardBox>
    </div>
    <h2>Upcoming Bookings</h2>
    <div v-if="bookings.length === 0">No upcoming bookings.</div>
    <ul v-else>
      <li v-for="booking in bookings" :key="booking.room_id">
        Room: {{ booking.room_id }}, Date: {{ booking.booking_date }}, Time: {{ booking.booking_time }}
      </li>
    </ul>
  </div>
</template>

<script>

import DashboardBox from "../components/DashboardBox.vue";

export default {
  components: { DashboardBox },
  data() {
    return {
      bookings: [] // Array to store user's bookings
    };
  },
  created() {
    this.fetchUserBookings();
  },
  methods: {
    fetchUserBookings() {
      const userId = 'user'; // Hardcoded user ID for testing
      fetch(`http://127.0.0.1:8000/booking/user-bookings/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch bookings');
          }
          return response.json();
        })
        .then(data => {
          this.bookings = data.bookings; // Store bookings in the component state
        })
        .catch(error => {
          console.error('Error fetching bookings:', error);
        });
    }
  }
};
</script>

<style scoped>
.user-page {
  padding: 2rem;
  text-align: center;
}

.dashboard-grid {
  display: flex;
  flex-direction: column; /* Stack the boxes vertically */
  align-items: center;
  margin-bottom: 20px;
}

.user-page ul {
  list-style-type: none;
  padding: 0;
}

.user-page li {
  margin: 10px 0;
}
</style>
