import { useEffect, useRef } from 'react';

export default function Doom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosInstance = useRef<any>(null);

  useEffect(() => {
    // 1. Get the Dos library
    const Dos = (window as any).Dos;
    if (!Dos || !containerRef.current) return;

    // 2. Initialize with the options object instead of .run()
    dosInstance.current = Dos(containerRef.current, {
      url: "https://v8.js-dos.com/bundles/doom.jsdos", // Use a .jsdos bundle
      autoStart: true, // This replaces the need to call .run()
    });

    return () => {
      if (dosInstance.current) {
        dosInstance.current.stop();
      }
    };
  }, []);

  return (
    <div>
    <div style={{ display: 'flex', flexDirection: 'row',gap: '20px',alignItems: 'flex-start'}}>
    <div style={{ width: '640px', height: '400px', border: '2px solid red' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
    <img src="/assets/controls.png" alt="Controls" style={{ width: '350px', height: 'auto' }} />
    </div>
    <p style = {{color: "black"}}> You can resize the window to fit your screen! (And Use ESC to catch mouse movement)</p>
    </div>

  );
}