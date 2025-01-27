import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import AdminPage from '@/views/AdminPage.vue';
import UserPage from '@/views/UserPage.vue';
import BookRoomPage from "../views/BookRoomPage.vue";
import InventoryPage from "../views/InventoryPage.vue";

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/admin', name: 'AdminPage', component: AdminPage, meta: { role: 'admin' } },
  { path: '/user', name: 'UserPage', component: UserPage, meta: { role: 'user' } },
  { path: "/book-room", name: "BookRoom", component: BookRoomPage,},
  { path: "/inventory", name: "Inventory", component: InventoryPage,},
  { path: "/", redirect: "/dashboard",},
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
