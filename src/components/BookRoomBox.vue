<template>
  <div
    class="book-room-box"
    :class="{ selected: isSelected }"
    @click="emitSelection"
  >
    <h2>{{ room.name }}</h2>
    <p :class="{ available: room.available_times.length > 0, unavailable: room.available_times.length === 0 }">
      {{ room.available_times.length > 0 ? "Available" : "Unavailable" }}
    </p>
  </div>
</template>

<script>
export default {
props: {
 room: {
   type: Object,
   required: true
 },
 isSelected: {
   type: Boolean,
   default: false // Now required since parent controls the state
 }
},
methods: {
 // Emit the selected room to the parent
 emitSelection() {
   this.$emit('room-selected', this.room);
 }
}
};
</script>

<style scoped>
.book-room-box {
border: 1px solid blue;
border-radius: 8px;
padding: 20px;
margin: 15px auto;
text-align: center;
cursor: pointer;
transition: background-color 0.3s, box-shadow 0.3s;
}

.book-room-box:hover {
background-color: #f5f5f5;
}

.book-room-box.selected {
background-color: #e0f7fa;
border-color: #007c91;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.available {
color: green;
}

.unavailable {
color: red;
}
</style>