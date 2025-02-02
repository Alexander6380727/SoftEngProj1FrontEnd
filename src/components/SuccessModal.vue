<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <p class="modal-text">{{ message }}</p>
      <button @click="closeModal" class="btn">Okay</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      default: "Action Successful!",
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 300px;
}

/* Add this class to style the modal text */
.modal-content .modal-text {
  font-size: 16px; /* Adjust font size if needed */
  color: black;    /* Force the text to be black */
  margin-bottom: 20px;
}

.btn {
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}

.btn:hover {
  background-color: #155a8a;
}
</style>