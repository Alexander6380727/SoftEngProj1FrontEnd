<template>
  <div class="book-room-page">
    <h1>Book a Room</h1>
    <p>Here you can book rooms for your use.</p>

    <!-- DATE SELECTION -->
    <div class="input-container">
      <label for="date" class="label">Select Date:</label>
      <select v-model="selectedDate" id="date" @change="updateAvailableRooms" class="input">
        <option disabled value="">Select Date</option>
        <option v-for="date in availableDates" :key="date" :value="date">{{ date }}</option>
      </select>
    </div>

    <!-- START TIME SELECTION -->
    <div class="input-container">
      <label for="start-time" class="label">Select Start Time:</label>
      <select v-model="selectedStartTime" id="start-time" class="input" @change="filterEndTimeSlots">
        <option disabled value="">Select Start Time</option>
        <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
      </select>
    </div>

    <!-- END TIME SELECTION -->
    <div class="input-container" v-if="filteredEndTimeSlots.length > 0">
      <label for="end-time" class="label">Select End Time:</label>
      <select v-model="selectedEndTime" id="end-time" class="input" @change="validateTime">
        <option disabled value="">Select End Time</option>
        <option v-for="time in filteredEndTimeSlots" :key="time" :value="time">{{ time }}</option>
      </select>
    </div>

    <!-- DISPLAY SELECTED DURATION -->
    <div v-if="calculatedDuration" class="duration-display">
      <p>Selected Time Duration: {{ calculatedDuration }}</p>
    </div>

    <!-- AVAILABLE ROOMS SELECTION -->
    <div v-for="room in availableRooms" :key="room.id">
      <BookRoomBox :room="room" @room-selected="handleRoomSelection" />
    </div>

    <!-- PURPOSE INPUT -->
    <div class="input-container">
      <label for="purpose" class="label">Purpose:</label>
      <input
        type="text"
        v-model="bookingPurpose"
        id="purpose"
        placeholder="Enter purpose"
        class="input"
      />
    </div>

    <!-- CONFIRM BOOKING BUTTON -->
    <button @click="confirmBooking" class="btn login-btn">Confirm Booking</button>
  </div>
</template>

<script>
import BookRoomBox from "../components/BookRoomBox.vue";

export default {
  components: { BookRoomBox },
  data() {
    return {
      availableDates: ["2023-10-01", "2023-10-02"],
      selectedDate: null,
      selectedStartTime: null, // Start time selection
      selectedEndTime: null,
      calculatedDuration: "", // Time duration
      timeSlots: this.generateHourlyTimeSlots(), // Dynamically generate hourly time slots including 24:00
      filteredEndTimeSlots: [], // Dynamically filtered end time slots
      bookingPurpose: "",
      rooms: [
        { id: 1, name: "Room A", available: true },
        { id: 2, name: "Room B", available: true },
      ],
      availableRooms: [],
      selectedRoom: null, // Selected room
      bookings: [], // Stored booking information
      userId: "user",
    };
  },
  methods: {
    // Generate 24-hour time slots, including 24:00
    generateHourlyTimeSlots() {
      const slots = [];
      for (let hour = 0; hour <= 24; hour++) {
        const h = hour < 24 ? hour.toString().padStart(2, "0") : "24";
        slots.push(`${h}:00`); // Push time in HH:00 format
      }
      return slots;
    },

    // Update available rooms based on the selected date
    updateAvailableRooms() {
      this.availableRooms = this.rooms.filter((room) => room.available);
    },

    // Handle room selection
    handleRoomSelection(room) {
      this.selectedRoom = room;
    },

    // Filter valid end times: only show times >=1 hour after the start time
    filterEndTimeSlots() {
      if (this.selectedStartTime) {
        const minEndTimeInMinutes = this.convertTimeToMinutes(this.selectedStartTime) + 60; // Start time + 60min
        this.filteredEndTimeSlots = this.timeSlots.filter((time) => {
          const timeInMinutes = this.convertTimeToMinutes(time);
          return timeInMinutes >= minEndTimeInMinutes;
        });

        // Reset end time if it's not a valid filtered option
        if (
          this.selectedEndTime &&
          !this.filteredEndTimeSlots.includes(this.selectedEndTime)
        ) {
          this.selectedEndTime = null;
        }
      } else {
        this.filteredEndTimeSlots = [];
      }
    },

    // Validate start and end times, then calculate duration
    validateTime() {
      if (this.selectedStartTime && this.selectedEndTime) {
        const startMinutes = this.convertTimeToMinutes(this.selectedStartTime);
        const endMinutes = this.convertTimeToMinutes(this.selectedEndTime);
        if (endMinutes <= startMinutes) {
          alert("End time must be at least 1 hour after the start time.");
          this.calculatedDuration = "";
          return;
        }
        const durationMinutes = endMinutes - startMinutes;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        this.calculatedDuration = minutes
          ? `${hours} Hours and ${minutes} Minutes`
          : `${hours} Hours`;
      }
    },

    // Convert time in HH:mm to total minutes
    convertTimeToMinutes(time) {
      if (time === "24:00") return 24 * 60;
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    },

    // Confirm and send the booking data to the backend
    confirmBooking() {
      if (
        !this.selectedDate ||
        !this.selectedStartTime ||
        !this.selectedEndTime ||
        !this.selectedRoom ||
        !this.bookingPurpose
      ) {
        alert("Please complete all fields.");
        return;
      }
      const booking = {
        user_id: this.userId,
        room_id: this.selectedRoom.id,
        booking_date: this.selectedDate,
        booking_start_time: this.selectedStartTime,
        booking_end_time: this.selectedEndTime,
        duration: this.calculatedDuration,
        purpose: this.bookingPurpose,
      };
      console.log("Booking:", booking);
      // Example POST request
      fetch("http://127.0.0.1:8000/booking/book-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Time slot unavailable.");
          return res.json();
        })
        .then(() => alert("Booking confirmed!"))
        .catch((err) => console.error(err.message));
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

/* Style for "Here you can book rooms for your use." */
.book-room-page p {
  color: black; /* Ensure paragraph text is black */
}

/* Display calculated duration style */
.duration-display p {
  color: black; /* Ensure duration text is black */
  font-size: 16px; /* Optional: Adjust text size */
  font-weight: bold; /* Optional: Add emphasis if needed */
}

.input-container {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-weight: bold;
  font-size: 14px;
  color: black; /* Make labels above dropdowns black */
  margin-bottom: 5px;
}

.input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  text-align: center;
}

.input:focus {
  outline: none;
  border-color: #1976D2;
}

.btn {
  background-color: #1976D2;
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
  background-color: #155a8a;
}
</style>