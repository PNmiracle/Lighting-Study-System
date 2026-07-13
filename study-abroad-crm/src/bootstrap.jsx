import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './main.jsx';
import './styles.css';
import './mobile-fix.css';
import './iteration.css';
import './visual-refresh.css';

createRoot(document.getElementById('root')).render(<App />);
