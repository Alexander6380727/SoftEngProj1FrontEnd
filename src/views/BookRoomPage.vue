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

    <!-- AVAILABLE ROOMS SELECTION -->
    <div v-for="room in availableRooms" :key="room.id">
      <BookRoomBox
        :room="room"
        :isSelected="selectedRoom && selectedRoom.id === room.id"
        @room-selected="handleRoomSelection"
      />
    </div>

    <!-- START TIME SELECTION -->
    <div class="input-container">
      <label for="start-time" class="label">Select Start Time:</label>
      <select v-model="selectedStartTime" id="start-time" class="input" @change="filterEndTimeSlots">
        <option disabled value="">Select Start Time</option>
        <option
            v-for="time in selectedRoom?.available_times || []"
            :key="time"
            :value="time"
        >
          {{ time }}
        </option>
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

    <!-- SUCCESS MODAL -->
    <SuccessModal
      :isVisible="showModal"
      :message="modalMessage"
      @close="closeModal"
    />
  </div>
</template>

<script>
import BookRoomBox from "../components/BookRoomBox.vue";
import SuccessModal from "../components/SuccessModal.vue";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  components: {
    BookRoomBox,
    SuccessModal
  },
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
      successMessage: "",
      userId: localStorage.getItem("user_id") || null,
      showModal: false,
      modalMessage: "", // Message to show in the modal
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
      for (let hour = 0; hour < 24; hour++) {
        const h = hour < 24 ? hour.toString().padStart(2, "0") : "24";
        slots.push(`${h}:00`);
      }
      return slots;
    },
    handleRoomSelection(room) {
      // If the clicked room is already selected, deselect it
      if (this.selectedRoom && this.selectedRoom.id === room.id) {
        this.selectedRoom = null;
      } else {
        // Otherwise, select the new room
        this.selectedRoom = room;
      }
    },
    filterEndTimeSlots() {
      // Ensure a start time and selected room exist
      if (this.selectedStartTime && this.selectedRoom) {
        const startTimeInMinutes = this.convertTimeToMinutes(this.selectedStartTime);
        const minEndTimeInMinutes = startTimeInMinutes + 60; // Minimum time difference of 1 hour

        // Get room's available times
        const roomAvailableTimes = this.selectedRoom.available_times || [];

        // Filter based on conditions
        this.filteredEndTimeSlots = roomAvailableTimes.filter((time) => {
          const timeInMinutes = this.convertTimeToMinutes(time);
          return timeInMinutes >= minEndTimeInMinutes;
        });

        // If end time is no longer valid, reset it
        if (
            this.selectedEndTime &&
            !this.filteredEndTimeSlots.includes(this.selectedEndTime)
        ) {
          this.selectedEndTime = null;
        }
      } else {
        // Reset if no valid start time or room is selected
        this.filteredEndTimeSlots = [];
        this.selectedEndTime = null;
      }
    },
    updateAvailableRooms() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book a room.");
        this.$router.push("/login");
        return;
      }

      if (!this.selectedDate) {
        this.availableRooms = [];
        return;
      }

      // Fetch room availability from the backend
      fetch(
          `${apiBaseUrl}/api/room-availability?date=${this.selectedDate}`,
          {
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
            console.log("Room Availability API Response:", data);

            const roomAvailability = data.room_availability || {};

            // Map and process available rooms
            this.availableRooms = Object.entries(roomAvailability).map(
                ([roomId, roomData]) => ({
                  id: parseInt(roomId, 10),
                  name: `Room ${roomId}`,
                  available_times: roomData.available_times || [], // Use only available_times
                  booked_times: roomData.booked_times || [], // Keep booked_times for reference only
                })
            );

            console.log("Processed Available Rooms:", this.availableRooms);

            // Ensure selectedRoom is valid after fetching new data
            if (this.selectedRoom) {
              const matchingRoom = this.availableRooms.find(
                  (room) => room.id === this.selectedRoom.id
              );
              if (!matchingRoom || matchingRoom.available_times.length === 0) {
                // If the selected room is no longer valid, reset state
                this.selectedRoom = null;
                this.selectedStartTime = null;
                this.selectedEndTime = null;
              }
            }

            if (this.availableRooms.length === 0) {
              alert("No rooms are available for the selected date and time.");
            }
          })
          .catch((err) => {
            console.error("Error fetching room availability:", err);
          });
    },
    convertTimeToMinutes(time) {
      if (time === "24:00") return 24 * 60;
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    },
    async confirmBooking() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book a room.");
        return;
      }

      // Validate user ID
      const parsedUserId = parseInt(this.userId, 10);
      if (isNaN(parsedUserId)) {
        alert("User ID is invalid. Please log in again.");
        return;
      }

      // Build the payload
      const payload = {
        user_id: parsedUserId,
        room_id: this.selectedRoom ? this.selectedRoom.id : null,
        booking_date: this.selectedDate,
        start_time: this.selectedStartTime + ":00",
        end_time: this.selectedEndTime + ":00",
        purpose: this.bookingPurpose,
      };

      try {
        const response = await fetch(`${apiBaseUrl}/api/book-room`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        console.log("Booking result:", result);

        // Display success modal and clear form fields
        this.modalMessage = "Booking was successful!";
        this.showModal = true; // Open the modal
        this.clearForm(); // Clear form fields
      } catch (err) {
        console.error("Error during booking request:", err);
        alert("An error occurred while trying to book the room.");
      }
    },

    clearForm() {
      this.selectedDate = null;
      this.selectedStartTime = null;
      this.selectedEndTime = null;
      this.calculatedDuration = "";
      this.bookingPurpose = "";
      this.availableRooms = [];
      this.selectedRoom = null;
      this.filteredEndTimeSlots = [];
    },

    closeModal() {
      this.showModal = false; // Close the modal
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