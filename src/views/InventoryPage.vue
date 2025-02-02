<template>
  <div class="inventory-page">
    <div class="header-container">
      <h1>Inventory</h1>
      <div class="search-container">
        <span class="search-icon">&#x1F50E;&#xFE0E;</span>  <input type="text" v-model="searchQuery" placeholder="Search for items..." />
      </div>
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
    <button v-if="isAdmin" @click="showModal = true" class="add_button">Add Item</button>

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
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: column; /* Vertical layout */
  align-items: center; /* Center horizontally */

}.header-container {
  /*... */
  position: fixed; /* Keep the header fixed at the top */
  top: 0;
  left: 0;
  width: 100%;
  background-color: white; /* White background for the header */
  z-index: 10; /* Ensure header is on top */
  padding: 10px 20px; /* Add some padding to the header */
}

h1 {
  font-size: 150%;
  margin: 0; /* Remove default margin on h1 */
  align-self: flex-start; /* Align the heading to the left */
}

.search-container {
  /*... */
  margin-top: 20px;
  border-radius: 8px;
  padding: 8px;
  display: flex; /* Use flexbox for icon and input */
  align-items: center; /* Vertically center icon and input */
}

.search-icon {
  margin-right: 5px; /* Add space between icon and input */
}

.inventory-list {
  background-color: white;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 20px;
  width: 370px;

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
  align-self: center;
  align-content: center;
  margin: 15% auto;
  padding: 20px;
  width: 80%;
  height: 40%;
  border-radius: 8px;
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

.add_button {
  background-color: #1976D2;
  width: 350px;
  position: fixed; /* Fixed positioning */
  bottom: 20px; /* Distance from the bottom */
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Center horizontally */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  z-index: 10; /* Ensure button is on top */
}

</style>
