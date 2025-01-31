<template>
  <div class="dashboard-box" @click="navigate">
    <svg v-if="icon" :class="`icon-${icon}`" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <use :xlink:href="`#${icon}`"></use>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    route: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
  },
  methods: {
    navigate() {
      this.$router.push(this.route);
    },
  },
};
</script>

<style scoped>
.dashboard-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 100px;
  margin: 10px;
  border: 1px solid #1976D2; /* Use primary color */
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
}

.dashboard-box:hover {
  background-color: #e0e0e0;
  border-color: #155a8a; /* Darker shade on hover */
}

.icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}
</style>
