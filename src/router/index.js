import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import BookRoom from "../views/BookRoomPage.vue";
import Inventory from "../views/InventoryPage.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/dashboard", component: Dashboard },
  { path: "/book-room", component: BookRoom },
  { path: "/inventory", component: Inventory },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token && to.name !== 'Login') {
    next({ name: 'Login' });
  } else if (to.meta.role && to.meta.role !== role) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
