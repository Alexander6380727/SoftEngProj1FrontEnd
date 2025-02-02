<template>
  <div class="inventory-item-card">
    <div class="item-header">
      <h2>
        <span class="item-name">{{ itemName }}</span>
      </h2>
      <span v-if="isAdmin" class="edit-icon" @click="editItem">✏️</span>
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
    itemName: String,
    quantity: Number,
    unit: String,
    isAdmin: Boolean,
  },
  methods: {
    editItem() {
      // Logic to edit the item
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
  font-weight: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.edit-icon {
  cursor: pointer;
}
</style>
