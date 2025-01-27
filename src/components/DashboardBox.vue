<template>
  <div class="dashboard-box" @click="navigate">
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
</style>
