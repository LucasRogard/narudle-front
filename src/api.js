import axios from 'axios';

const api = axios.create({
    baseURL: 'https://narudle-back.onrender.com', // URL de base de votre API
    timeout: 10000, // Temps d'attente maximum pour chaque requête (en millisecondes)
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
