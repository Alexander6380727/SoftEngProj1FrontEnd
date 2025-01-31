<template>
  <div class="user-page">
    <h1>Your Dashboard</h1>
    <div class="dashboard-grid">
      <DashboardBox route="/book-room" icon="calendar">
        Book Room
      </DashboardBox>
      <DashboardBox route="/inventory" icon="box">
        View Inventory
      </DashboardBox>
    </div>
    <h2>Upcoming Bookings</h2>
    <div v-if="bookings.length === 0">No upcoming bookings.</div>
    <ul v-else>
      <li v-for="booking in bookings" :key="booking.room_id">
        Room: {{ booking.room_id }}, Date: {{ booking.booking_date }}, Time: {{ booking.start_time }} - {{ booking.end_time }}
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
      const token = localStorage.getItem('access_token'); // Retrieve the token from local storage
      if (!token) {
        console.error('No access token found');
        return;
      }

      // Fetch bookings using the token
      fetch(`http://127.0.0.1:8000/booking/user-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
  padding: 5rem;
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
