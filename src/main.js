import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCX11Bra_Cg22K8ivTjhVf-zRH7chGiO6w",
  authDomain: "matheo-7a346.firebaseapp.com",
  projectId: "matheo-7a346",
  storageBucket: "matheo-7a346.appspot.com",
  messagingSenderId: "786458767526",
  appId: "1:786458767526:web:00dff742c8b96c475b8467",
  measurementId: "G-CHDWR2K24H"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = createApp(App);
app.config.globalProperties.$db = db;
app.use(router);
app.mount('#app');