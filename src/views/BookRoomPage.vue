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
      <BookRoomBox
        :room="room"
        :isSelected="selectedRoom && selectedRoom.id === room.id"
        @room-selected="handleRoomSelection"
      />
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
    <button
      :disabled="!selectedDate || !selectedStartTime || !selectedEndTime || !selectedRoom || !bookingPurpose"
      @click="confirmBooking"
      class="btn login-btn"
    >
      Confirm Booking
    </button>
  </div>
</template>

<script>
import BookRoomBox from "../components/BookRoomBox.vue";

export default {
  components: { BookRoomBox },
  data() {
    return {
      availableDates: this.generateDates(30),
      selectedDate: null,
      selectedStartTime: null,
      selectedEndTime: null,
      calculatedDuration: "",
      timeSlots: this.generateHourlyTimeSlots(),
      filteredEndTimeSlots: [],
      bookingPurpose: "",
      availableRooms: [],
      selectedRoom: null,
      bookings: [],
      userId: "user",
    };
  },
  watch: {
    selectedDate: "checkAndFetchRooms",
    selectedStartTime: "checkAndFetchRooms",
    selectedEndTime: "checkAndFetchRooms",
  },
  methods: {
    checkAndFetchRooms() {
      if (this.selectedDate && this.selectedStartTime && this.selectedEndTime) {
        this.updateAvailableRooms();
      }
    },
    generateDates(days) {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split("T")[0]);
      }
      return dates;
    },
    generateHourlyTimeSlots() {
      const slots = [];
      for (let hour = 0; hour <= 24; hour++) {
        const h = hour < 24 ? hour.toString().padStart(2, "0") : "24";
        slots.push(`${h}:00`);
      }
      return slots;
    },
    updateAvailableRooms() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book a room.");
        // Optionally, redirect to the login page
        this.$router.push("/login");
        return;
      }
      if (!this.selectedDate || !this.selectedStartTime) {
        this.availableRooms = [];
        return;
      }
      fetch(
          `http://127.0.0.1:8000/api/room-availability?date=${this.selectedDate}&start_time=${this.selectedStartTime}&end_time=${this.selectedEndTime}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
      )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch room availability.");
            }
            return response.json();
          })
          .then((data) => {
            this.availableRooms = data.available_rooms;
          })
          .catch((err) => console.error("Error fetching room availability:", err));
    },
    handleRoomSelection(room) {
      if (this.selectedRoom && this.selectedRoom.id === room.id) {
        this.selectedRoom = null;
      } else {
        this.selectedRoom = room;
      }
    },
    filterEndTimeSlots() {
      if (this.selectedStartTime) {
        const minEndTimeInMinutes = this.convertTimeToMinutes(this.selectedStartTime) + 60;
        this.filteredEndTimeSlots = this.timeSlots.filter((time) => {
          const timeInMinutes = this.convertTimeToMinutes(time);
          return timeInMinutes >= minEndTimeInMinutes;
        });
        if (this.selectedEndTime && !this.filteredEndTimeSlots.includes(this.selectedEndTime)) {
          this.selectedEndTime = null;
        }
      } else {
        this.filteredEndTimeSlots = [];
      }
    },
    validateTime() {
      if (this.selectedStartTime && this.selectedEndTime) {
        const startMinutes = this.convertTimeToMinutes(this.selectedStartTime);
        const endMinutes = this.convertTimeToMinutes(this.selectedEndTime);
        if (endMinutes <= startMinutes) {
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
    convertTimeToMinutes(time) {
      if (time === "24:00") return 24 * 60;
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    },
    async confirmBooking() {
      // This assumes `loggedInUser` stores the user's data, including their ID
      const payload = {
        user_id: localStorage.getItem("user_id"),        // Ensure user is authenticated and ID is retrieved
        room_id: this.selectedRoom.id,       // ID of the selected room
        booking_date: this.selectedDate,     // Date in "YYYY-MM-DD" format
        start_time: this.startTime,          // Start time in "HH:MM:SS" format
        end_time: this.endTime,              // End time in "HH:MM:SS" format
        purpose: this.bookingPurpose         // Purpose of the booking
      };

      console.log("Payload to be sent:", payload); // Debug: View payload before sending

      try {
        const response = await fetch("http://127.0.0.1:8000/api/book-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Booking Error:", errorData);
          alert("Failed to create booking: " + (errorData.detail || "Unknown error"));
          return;
        }

        const result = await response.json();
        alert("Booking created successfully!");
        console.log("Booking result:", result);
      } catch (err) {
        console.error("Error during booking request:", err);
        alert("An error occurred while trying to book the room.");
      }
    },
  },
};
</script>

<style scoped>
.book-room-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.book-room-page p {
  color: black; /* Ensure paragraph text is black */
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
