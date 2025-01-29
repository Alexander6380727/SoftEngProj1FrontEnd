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
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.book-room-box.selected {
  background-color: #e0f7fa; /* Highlight selected room */
}

.book-room-box:hover {
  background-color: #f0f0f0;
}

.available {
  color: green;
}

.unavailable {
  color: red;
}
</style>
