import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react'; // Importer Auth0Provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-m2c24nvnz4u707b3.us.auth0.com" // Remplacer par votre domaine Auth0
            clientId="vCScvHnjadZxFbQQ9ftGK8PHHoicb48z" // Remplacer par votre ID client Auth0
            authorizationParams={{
                redirect_uri: window.location.origin // URL de redirection après l'authentification
            }}
        >
            <App /> {/* Envelopper App avec Auth0Provider */}
        </Auth0Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
