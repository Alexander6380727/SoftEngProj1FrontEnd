<template>
  <div class="user-page">
    <h1 class="welcome-text">User Dashboard</h1>
    <div class="dashboard-grid">
      <DashboardBox route="/book-room" icon="calendar">
        Book Room
      </DashboardBox>
    </div>
  </div>
</template>

<script>
import DashboardBox from "../components/DashboardBox.vue";

export default {
  components: { DashboardBox },
};
</script>

<style scoped>
.user-page {
  background-color: white;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.welcome-text {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: black;
}

.dashboard-grid {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
</style>
