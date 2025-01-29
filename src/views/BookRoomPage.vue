<template>
  <div class="book-room-page">
    <h1>Book a Room</h1>
    <p>Here you can book rooms for your use.</p>
    
    <div class="input-container">
      <label for="date">Select Date:</label>
      <select v-model="selectedDate" id="date" @change="updateAvailableRooms" class="input">
        <option v-for="date in availableDates" :key="date" :value="date">{{ date }}</option>
      </select>
    </div>

    <div class="input-container">
      <label for="time">Select Time Slot:</label>
      <select v-model="selectedTime" id="time" class="input">
        <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
      </select>
    </div>

    <div v-for="room in availableRooms" :key="room.id">
      <BookRoomBox :room="room" @room-selected="handleRoomSelection" />
    </div>

    <div class="input-container">
      <label for="purpose">Purpose:</label>
      <input type="text" v-model="bookingPurpose" id="purpose" placeholder="Enter purpose" class="input" />
    </div>

    <button @click="confirmBooking" class="btn login-btn">Confirm Booking</button>
  </div>
</template>

<script>
import BookRoomBox from "../components/BookRoomBox.vue";

export default {
  components: { BookRoomBox },
  data() {
    return {
      availableDates: ['2023-10-01', '2023-10-02'], // Example dates
      selectedDate: null,
      selectedTime: null,
      timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'], // Example time slots
      bookingPurpose: '',
      rooms: [
        { id: 1, name: 'Room A', available: true },
        { id: 2, name: 'Room B', available: true },
        // Add more rooms as needed
      ],
      availableRooms: [],
      selectedRoom: null, // Added to store the selected room
      bookings: [], // Array to store booking information
      userId: 'user', // Default user ID for testing
    };
  },
  methods: {
    updateAvailableRooms() {
      // Logic to filter available rooms based on selected date
      this.availableRooms = this.rooms.filter(room => room.available);
    },
    handleRoomSelection(room) {
      // Logic to handle room selection
      this.selectedRoom = room; // Store the selected room
      console.log('Room selected:', room);
    },
    confirmBooking() {
      // Validate fields
      if (!this.selectedDate || !this.selectedTime || !this.selectedRoom || !this.bookingPurpose) {
        alert("There are empty fields remaining.");
        return;
      }

      // Logic to handle booking confirmation
      const booking = {
        user_id: this.userId, // Use the actual user ID
        room_id: this.selectedRoom.id,
        booking_date: this.selectedDate,
        booking_time: this.selectedTime,
        purpose: this.bookingPurpose,
      };

      console.log('Booking data:', booking); // Log the booking data

      // Send booking request to the backend
      fetch('http://127.0.0.1:8000/booking/book-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Room is already booked for this time slot.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Booking confirmed:', data);
        alert('Booking confirmed!'); // Confirmation message
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error.message);
      });
    },
  },
};
</script>

<style scoped>
.book-room-page {
  background-color: white;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.input-container {
  margin-bottom: 20px; /* Increased margin between fields */
}

.input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #1a73e8;
}

.btn {
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

.btn:hover {
  background-color: #155bb5;
}
</style>
