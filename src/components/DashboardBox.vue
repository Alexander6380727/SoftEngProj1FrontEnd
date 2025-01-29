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
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 100px;
  margin: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: 0.3s;
}

.dashboard-box:hover {
  background-color: #e0e0e0;
  border-color: #007bff;
}

.icon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}
</style>
