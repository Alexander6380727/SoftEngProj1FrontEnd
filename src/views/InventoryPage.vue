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
        :id="item.id"
        @edit="openEditModal(item)"
        @delete="deleteItem"
      />
    </div>
    <button v-if="isAdmin" @click="showModal = true" class="button">Add Item</button>

    <!-- Modal for Adding/Editing Item -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal()">&times;</span>
        <h2>{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h2>
        <input v-model="newItemName" placeholder="Item Name" />
        <input v-model="newItemQuantity" type="number" placeholder="Quantity" />
        <select v-model="newItemUnit">
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="L">L</option>
          <option value="mL">mL</option>
        </select>
        <button @click="isEditing ? updateItem() : submitNewItem()" class="button">{{ isEditing ? 'Update' : 'Submit' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import InventoryItem from "../components/InventoryItem.vue";
import _ from 'lodash';
import api from "../services/api"; // Import the API service

export default {
  components: { InventoryItem },
  data() {
    return {
      searchQuery: "",
      items: [], // This will be populated with inventory items
      isAdmin: localStorage.getItem("role") === "admin", // Check if the user is an admin
      newItemName: "",
      newItemQuantity: 0,
      newItemUnit: "g",
      showModal: false,
      isEditing: false, // Flag to determine if editing
      currentItem: null, // Store the item being edited
      errorMessage: "", // To display error messages
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
    openEditModal(item) {
      console.log("Editing item:", item); // Debugging line
      this.currentItem = _.cloneDeep(item); // Deep copy!
      console.log("Cloned item's id:", this.currentItem.id); // Debugging line
      this.newItemName = this.currentItem.name;
      this.newItemQuantity = this.currentItem.quantity;
      this.newItemUnit = this.currentItem.unit;
      this.isEditing = true;
      this.showModal = true;
    }, 
    
    closeModal() {
      this.showModal = false; // Close the modal
      this.isEditing = false; // Reset editing flag
      this.fetchItems(); // Refresh the inventory items
    },

    async updateItem() {
      // Input validation
      if (!this.newItemName || this.newItemQuantity <= 0 || !this.newItemUnit) {
        this.errorMessage = "Please fill in all fields correctly.";
        return;
      }
      console.log("Updating items with new values:", {
        id: this.currentItem.id,
        name: this.newItemName,
        quantity: this.newItemQuantity,
        unit: this.newItemUnit,
      });
      try {
        const response = await api.put(`inventory/${this.currentItem.id}`, {
          name: this.newItemName,
          quantity: this.newItemQuantity,
          unit: this.newItemUnit,
        });
        if (response.status === 200) {
          const updatedItem = response.data;
          this.items = this.items.map(item => {  
              if (item.id === updatedItem.id) {
                  return updatedItem;
              }
              return item;
          });
          this.showModal = false;
          this.resetForm();
      } else {
            console.error("Error updating item:", response.status, response.data);
            this.errorMessage = `Failed to update item: ${response.status}`; 
        }
      } catch (error) {
        console.error("Error updating item:", error);
        this.errorMessage = "Failed to update item. Please try again.";
      }
    },

    async submitNewItem() {
      if (!this.newItemName || this.newItemQuantity <= 0 || !this.newItemUnit) {
        this.errorMessage = "Please fill in all fields correctly.";
        return;
      }
      console.log("Submitting new item with values:", {
        name: this.newItemName,
        quantity: this.newItemQuantity,
        unit: this.newItemUnit,
      });
      try {
        const response = await api.post("/inventory", {
          name: this.newItemName,
          quantity: this.newItemQuantity,
          unit: this.newItemUnit,
        });
        if (response.status === 200) { 
            const newItem = response.data; 
            this.items = [...this.items, newItem]; // Use spread to create the new array
            this.resetForm();
            this.showModal = false;
            await this.fetchItems(); 
        } else {
            console.error("Error adding item:", response.status, response.data);
            this.errorMessage = `Failed to add item: ${response.status}`; // More informative error
        }
      } catch (error) {
        console.error("Error adding new item:", error);
        this.errorMessage = "Failed to add item. Please try again.";
      }
    },

    async deleteItem(id) {
      try {
        console.log("Attempting to delete item with ID:", id);
        const response = await api.delete(`/inventory/${id}`);
        if (response.status === 200) {
          console.log("Item deleted successfully:", response.data);
          await this.fetchItems(); // Refresh the item list
        } else {
          console.error("Error deleting item:", response.status, response.data);
          this.errorMessage = `Failed to delete item: ${response.status}`;
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        this.errorMessage = "Failed to delete item. Please try again.";
      }
    },

    resetForm() {
      this.newItemName = "";
      this.newItemQuantity = 0;
      this.newItemUnit = "g";
      this.isEditing = false; // Reset editing flag
      this.currentItem = null; // Clear current item
      this.errorMessage = ""; // Clear error message
    },
    async fetchItems() {
      try {
        const response = await api.get("/inventory");
        console.log(response.data); // Debugging line

        if (response.status === 200) { // Check the status code!
        if (Array.isArray(response.data)) {
                this.items = response.data;
                console.log(this.items); // Debugging line
            } else {
                console.error("Expected an array, but got:", response.data);
                this.errorMessage = "Invalid data from server."; // Handle the error
            }
        } else {
            console.error("Error fetching items:", response.status, response.data);
            this.errorMessage = `Failed to fetch items: ${response.status}`; // More informative error
        }

      } catch (error) {
        console.error("Error fetching inventory items:", error);
        this.errorMessage = "Error fetching items."; // General error message
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
  display: flex;
  flex-direction: column; /* Vertical layout */
  align-items: center; /* Center horizontally */

}.header-container {  display: flex;
  flex-direction: column; /* Stack title and search vertically */
  align-items: center; /* Center horizontally */
  width: 100%; /* Take full width */
  margin-bottom: 20px; /* Space between header and list */

}.search-container {
  width: 350px;
  margin-top: 10px; /* Space between title and search */

}.inventory-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 20px;
  width: 100%;

}

.button {
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
