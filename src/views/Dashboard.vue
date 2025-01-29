<template>
  <div class="dashboard-page">
    <h1 class="welcome-text">{{ role }} Dashboard</h1>
    <div class="dashboard-grid">
      <DashboardBox
        v-for="item in dashboardItems"
        :key="item.route"
        :route="item.route"
        :icon="item.icon"
      >
        {{ item.name }}
      </DashboardBox>
    </div>
  </div>
</template>

<script>
import api from "../services/api";
import DashboardBox from "../components/DashboardBox.vue";

export default {
  components: { DashboardBox },
  data() {
    return {
      dashboardItems: [],
      role: localStorage.getItem("role"),
    };
  },
  async created() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard", {params: {token}});
      this.dashboardItems = response.data;
    } catch (error) {
      alert("Failed to fetch dashboard items.");
    }
  },
};
</script>

<style>
.dashboard-page {
  padding: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

</style>