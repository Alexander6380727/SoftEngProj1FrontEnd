<template>
  <div class="book-room-box" :class="{ selected: isSelected }" @click="toggleSelection">
    <h2>{{ room.name }}</h2>
    <p :class="{'available': room.available, 'unavailable': !room.available}">
      {{ room.available ? 'Available' : 'Unavailable' }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isSelected: false // Track selection state
    };
  },
  methods: {
    toggleSelection() {
      this.isSelected = !this.isSelected; // Toggle selection
      this.$emit('room-selected', this.isSelected ? this.room : null); // Emit selected room or null
    }
  }
};
</script>

<style scoped>
.book-room-box {
  border: 1px solid #1976D2; /* Use primary color */
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;
  transition: background-color 0.3s, box-shadow 0.3s; /* Add transition for shadow */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
}

.book-room-box.selected {
  background-color: #e0f7fa; /* Highlight selected room */
}

.book-room-box:hover {
  background-color: #e0e0e0;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Darker shadow on hover */
}

.available {
  color: green;
}

.unavailable {
  color: red;
}
</style>
