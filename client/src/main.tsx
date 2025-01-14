import './styles/index.css';
import { Router } from './routes/router';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(<Router />);