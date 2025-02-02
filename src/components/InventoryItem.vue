<template>
  <div class="inventory-item-card">
    <div class="item-header">
      <h2>
        <span class="item-name">{{ itemName }}</span>
      </h2>
      <div class="icon-container">  <span v-if="isAdmin" class="edit-icon" @click="editItem">✏️</span><br>
        <span v-if="isAdmin" class="delete-icon" @click="deleteItem">🗑️</span>
      </div>
    </div>
    <div class="item-details">
      <h4>
        <span>Quantity: {{ quantity }} {{ unit }}</span>
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number, // Add id prop
    itemName: String,
    quantity: Number,
    unit: String,
    isAdmin: Boolean,
  },
  methods: {
    editItem() {
      this.$emit('edit', { id: this.id, name: this.itemName, quantity: this.quantity, unit: this.unit }); // Emit edit event with item data including id
    },
    deleteItem() {
      if (confirm("Are you sure you want to delete this item?")) { // Confirmation prompt
        this.$emit('delete', this.id); // Emit delete event with the item's ID
      }
    }
  }
};
</script>

<style scoped>
.inventory-item-card {
  width: 350px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background-color: white;
}

h2 {
  font-size: medium;
}

h4 {
  font-size: small;
}

.item-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.edit-icon {
  cursor: pointer;
}

.item-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.delete-icon {
  cursor: pointer;
  color: red;
  margin-left: 2px;
}
</style>

