import { useEffect, useState } from 'react';

export const useJsDos = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://v8.js-dos.com/latest/js-dos.css';
    link.rel = 'stylesheet';
    link.id = 'js-dos-css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://v8.js-dos.com/latest/js-dos.js';
    script.id = 'js-dos-js';
    script.onload = () => setIsReady(true);
    document.head.appendChild(script);

    return () => {
      document.getElementById('js-dos-css')?.remove();
      document.getElementById('js-dos-js')?.remove();
    };
  }, []);

  return isReady;
};