<template>
  <div class="inventory-page">
    <h1>Inventory</h1>
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Search for items..." />
    </div>
    <div class="inventory-list">
      <InventoryItem
        v-for="item in filteredItems"
        :key="item.id"
        :itemName="item.name"
        :quantity="item.quantity"
        :unit="item.unit"
        :isAdmin="isAdmin"
      />
    </div>
    <button v-if="isAdmin" @click="addItem" class="btn">Add Item</button>
  </div>
</template>

<script>
import InventoryItem from "../components/InventoryItem.vue";
import api from "../services/api"; // Import the API service

export default {
  components: { InventoryItem },
  data() {
    return {
      searchQuery: "",
      items: [], // This will be populated with inventory items
      isAdmin: localStorage.getItem("role") === "admin", // Check if the user is an admin
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => 
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    }
  },
  methods: {
    addItem() {
      // Logic to add a new item
    },
    async fetchItems() {
      try {
        const response = await api.get("/"); // Fetch inventory items from the backend
        this.items = response.data; // Populate the items array
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    }
  },
  created() {
    this.fetchItems(); // Fetch inventory items when the component is created
  }
};
</script>

<style scoped>
.inventory-page {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.inventory-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  background-color: #1976D2; /* Primary color */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #155a8a; /* Darker shade on hover */
}
</style>
