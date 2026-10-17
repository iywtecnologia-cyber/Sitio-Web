import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { TeroSecurity } from './pages/TeroSecurity';
import './index.css';

// Página propia de TERO Security en /tero-security (Render ya reescribe todas las rutas a index.html).
const esTero = window.location.pathname.replace(/\/+$/, '') === '/tero-security';

createRoot(document.getElementById('root')!).render(esTero ? <TeroSecurity /> : <App />);
