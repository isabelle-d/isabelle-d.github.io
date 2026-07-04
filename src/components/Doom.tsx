import { useEffect, useRef } from 'react';
import { useJsDos } from '../hooks/useJsDos';

export default function Doom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosInstance = useRef<any>(null);

  const isReady = useJsDos();

  useEffect(() => {

    if (!isReady || !containerRef.current) return;

    const Dos = (window as any).Dos;

    dosInstance.current = Dos(containerRef.current, {
      url: "https://v8.js-dos.com/bundles/doom.jsdos",
      autoStart: true,
    });

    return () => {
      if (dosInstance.current) {
        dosInstance.current.stop();
      }
    };
  }, [isReady]);



  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{ width: '640px', height: '400px', border: '2px solid red' }}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
        <img src="/assets/controls.png"alt="Controls"style={{ width: '350px', height: 'auto' }}
        />
      </div>

      <p style={{ color: "black" }}>
        You can resize the window to fit your screen! (And Use ESC to catch mouse movement)
      </p>

    </div>
  );
}