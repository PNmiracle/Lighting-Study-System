import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './main.jsx';
import './styles.css';
import './mobile-fix.css';
import './iteration.css';
import './visual-refresh.css';

createRoot(document.getElementById('root')).render(<App />);

if (import.meta.env.BASE_URL !== '/') {
  const fixPublicAssetPaths = root => {
    const images = root instanceof Element && root.matches('img') ? [root] : root.querySelectorAll?.('img') || [];
    for (const image of images) {
      if (image.getAttribute('src') === '/brand-qingxue-dog.png') image.src = `${import.meta.env.BASE_URL}brand-qingxue-dog.png`;
    }
  };
  fixPublicAssetPaths(document);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node instanceof Element) fixPublicAssetPaths(node);
  }))).observe(document.body, { childList: true, subtree: true });
}
