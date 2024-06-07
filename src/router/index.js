import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Chatbot from '../views/Chatbot.vue';

const routes = [
	{ path: '/', component: Login },
	{ path: '/chat/:chatId?', component: Chatbot },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Gardien de navigation global
router.beforeEach((to, from, next) => {
	const user = JSON.parse(localStorage.getItem('user'));
	if (user) {
		// L'utilisateur est connecté
		if (to.path === '/') {
			// Redirige vers /chat si l'utilisateur est déjà connecté
			next('/chat');
		} else {
			next();
		}
	} else {
		// L'utilisateur n'est pas connecté
		if (to.path !== '/') {
			// Redirige vers / si l'utilisateur n'est pas connecté
			next('/');
		} else {
			next();
		}
	}
});

export default router;
