import { useEffect, useRef, useState, type ReactElement, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { useModal } from '@react95/core';
import { useWindowsStore } from '../store/windows';
import DesktopIcon from './DesktopIcon.tsx';
import { appleIcon } from '../appleIcon';

const BIN_SRC = '/apple/badapple.bin';
const AUDIO_SRC = '/apple/badapple.mp3';
const GRID_W = 48;
const GRID_H = 36;
const FPS = 12.4;
const TASKBAR_H = 40;
const SELF_NAME = 'Bad Apple';

// What the dark (black) pixels are made of. 'desktop' = your real desktop icons.
const DARK_ICONS: string[] = [
  'desktop',
  '⚙️', '🔧', '🧮', '📦', '🗄️', '🗃️', '📰',
];

// What the light (white) pixels are made of. Set to [] to have no white pixels.
const LIGHT_ICONS: string[] = [
  '📄', '📝', '📋', '📎', '📇', '💽', '📷', '🔍',
];

const DESKTOP_WEIGHT = 3;
const FILL_DENSITY = 0.5;

// 0 = icons keep their original colors, 1 = fully dark / fully light gray.
const DARK_TINT = 0.8;
const LIGHT_TINT = 0.8;
const DARKEN = 0.5;
const LIGHT_BASE = 175;

const SIDE_FLIP_AT = 0.6;
const SIDE_FLIP_BACK = 0.55;
const SIDE_TONE_NORMAL: 'light' | 'dark' = 'light';
const SIDE_TONE_HEAVY: 'light' | 'dark' = 'dark';



const CELLS = GRID_W * GRID_H;
const FRAME_BYTES = Math.ceil(CELLS / 8);

const NOTES: string[] = [
  'The video was shrunk by ffmpeg to a 48 × 36 grid, and every frame was saved as black or white, one bit per cell. That is 216 bytes a frame, roughly 2,700 frames, about 580 KB in total in badapple.bin.',
  'The audio file is the clock. On every animation frame the page reads audio.currentTime, multiplies it by 12.4 frames per second, and draws that frame, so the picture stays locked to the sound even if the browser lags.',
  'Only the cells that changed since the last frame are redrawn, using icon images that are rendered once at the right size before playback. Black cells get darkened icons and white cells get lightened ones. Your desktop icons are rendered from the same components the desktop uses.',
  'The big apple minimizes your windows, sizes the grid to your screen and fills the empty space with extra icons. Those side icons are white, and they switch to dark whenever more than three fifths of the picture is black. The small apple draws the same animation inside this window.',
];

type Mode = 'off' | 'full' | 'window';
type Tone = 'light' | 'dark';
type Source = HTMLImageElement | string;
type DesktopIconSource = string | ReactElement;

interface Layout {
  size: number;
  cell: number;
  padX: number;
  padY: number;
  cols: number;
  rows: number;
  light: boolean;
}

interface Sides {
  x: number[];
  y: number[];
  d: number[];
  l: number[];
}

const EMPTY_LAYOUT: Layout = {
  size: 14,
  cell: 14,
  padX: 0,
  padY: 0,
  cols: GRID_W,
  rows: GRID_H,
  light: false,
};

interface BadAppleProps {
  windowNames: string[];
  desktopIcons?: DesktopIconSource[];
  onPlayingChange?: (playing: boolean) => void;
}

const isImagePath = (entry: string) => entry !== 'desktop' && /[./]/.test(entry);

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function elementToImage(el: Element | null): Promise<HTMLImageElement | null> {
  if (!el) return null;
  if (el instanceof HTMLImageElement) {
    return loadImage(el.currentSrc || el.src || el.getAttribute('src') || '');
  }
  if (el instanceof SVGElement) {
    const clone = el.cloneNode(true) as SVGElement;
    clone.setAttribute('width', '64');
    clone.setAttribute('height', '64');
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const xml = new XMLSerializer().serializeToString(clone);
    return loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml));
  }
  const bg = (el as HTMLElement).style?.backgroundImage ?? '';
  const m = bg.match(/url\(["']?(.*?)["']?\)/);
  return m ? loadImage(m[1]) : null;
}

async function iconToImage(icon: DesktopIconSource): Promise<HTMLImageElement | null> {
  if (typeof icon === 'string') return loadImage(icon);
  try {
    const box = document.createElement('div');
    box.innerHTML = renderToStaticMarkup(icon);
    const el = box.querySelector('img, svg, [style*="background-image"]') ?? box.firstElementChild;
    return await elementToImage(el);
  } catch {
    return null;
  }
}

async function harvestDesktopIcons(): Promise<HTMLImageElement[]> {
  const srcs = new Set<string>();
  document.querySelectorAll<HTMLImageElement>('[data-desktop-icons] img').forEach((img) => {
    const s = img.currentSrc || img.src;
    if (s) srcs.add(s);
  });
  const loaded = await Promise.all([...srcs].map(loadImage));
  return loaded.filter((i): i is HTMLImageElement => i !== null);
}

function makeSprite(source: Source, size: number, tone: Tone): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return c;

  if (typeof source === 'string') {
    ctx.font = `${Math.round(size * 0.85)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(source, size / 2, size / 2 + 1);
  } else {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(source, 0, 0, size, size);
  }

  const strength = tone === 'dark' ? DARK_TINT : LIGHT_TINT;
  if (strength > 0) {
    const data = ctx.getImageData(0, 0, size, size);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      const lum = px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11;
      const target = tone === 'dark' ? Math.min(lum * DARKEN, 90) : Math.min(255, LIGHT_BASE + lum * 0.4);
      px[i] = px[i] * (1 - strength) + target * strength;
      px[i + 1] = px[i + 1] * (1 - strength) + target * strength;
      px[i + 2] = px[i + 2] * (1 - strength) + target * strength;
    }
    ctx.putImageData(data, 0, 0);
  }
  return c;
}

interface LauncherProps {
  mode: Mode;
  loading: boolean;
  error: string;
  warnings: string[];
  layout: Layout;
  wrapRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onFull: () => void;
  onWindow: () => void;
  onStop: () => void;
}

function Launcher({ mode, loading, error, warnings, layout, wrapRef, canvasRef, onFull, onWindow, onStop }: LauncherProps) {
  const choice = (iconSize: number, fontSize: number, bold: boolean, onClick: () => void) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        width: '140px',
      }}
    >
      <img src={appleIcon} alt="Bad Apple" width={iconSize} height={iconSize} />
      <div style={{ fontWeight: bold ? 'bold' : 'normal', fontSize: `${fontSize}px` }}>Bad Apple</div>
    </div>
  );

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        ref={wrapRef}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          color: '#000000',
          padding: '8px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {mode === 'window' ? (
          <canvas
            ref={canvasRef}
            onClick={onStop}
            title="Click to stop"
            width={layout.cols * layout.size}
            height={layout.rows * layout.size}
            style={{
              display: 'block',
              width: layout.cols * layout.cell,
              height: 'auto',
              maxWidth: '100%',
              cursor: 'pointer',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              maxHeight: '100%',
              overflowY: 'auto',
              padding: '4px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px' }}>
              {choice(96, 18, true, onFull)}
              {choice(32, 11, false, onWindow)}
            </div>
            {loading && <div style={{ fontSize: '12px' }}>Loading…</div>}
            {error && <div style={{ color: '#a00000', fontSize: '13px', maxWidth: '420px' }}>{error}</div>}
            {warnings.map((w, i) => (
              <div key={i} style={{ color: '#a00000', fontSize: '12px', maxWidth: '420px' }}>
                {w}
              </div>
            ))}
            <div
              style={{
                border: '1px solid #808080',
                background: '#f4f4f4',
                padding: '8px 10px',
                maxWidth: '520px',
                fontSize: '12px',
                lineHeight: 1.45,
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>How this works</div>
              {NOTES.map((n, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : '6px 0 0' }}>
                  {n}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BadApple({ windowNames, desktopIcons, onPlayingChange }: BadAppleProps) {
  const modalApi = useModal() as unknown as {
    minimize: (id: string) => void;
    restore: (id: string) => void;
  };
  const { minimize, restore } = modalApi;
  const { isWindowOpen } = useWindowsStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const fullCanvasRef = useRef<HTMLCanvasElement>(null);
  const winCanvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const darkPoolRef = useRef<HTMLCanvasElement[]>([]);
  const lightPoolRef = useRef<HTMLCanvasElement[]>([]);
  const sidesRef = useRef<Sides>({ x: [], y: [], d: [], l: [] });
  const sideToneRef = useRef<Tone>(SIDE_TONE_NORMAL);
  const sideHeavyRef = useRef(false);
  const iconsRef = useRef<HTMLImageElement[] | null>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const framesRef = useRef<Uint8Array | null>(null);
  const frameCountRef = useRef(0);
  const cellDarkRef = useRef<Uint16Array>(new Uint16Array(CELLS));
  const cellLightRef = useRef<Uint16Array>(new Uint16Array(CELLS));
  const prevRef = useRef<Uint8Array>(new Uint8Array(CELLS).fill(2));
  const lastFrameRef = useRef(-1);
  const baseRef = useRef(0);
  const layoutRef = useRef<Layout>(EMPTY_LAYOUT);
  const modeRef = useRef<Mode>('off');
  const canvasSeenRef = useRef<HTMLCanvasElement | null>(null);
  const bgDoneRef = useRef(false);
  const missingRef = useRef(0);
  const minimizedRef = useRef<string[]>([]);
  const runningRef = useRef(false);
  const rafRef = useRef(0);

  const [mode, setMode] = useState<Mode>('off');
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [layout, setLayout] = useState<Layout>(EMPTY_LAYOUT);

  const changeMode = (m: Mode) => {
    modeRef.current = m;
    setMode(m);
  };
  const raiseSelf = () => {
    [0, 80, 250].forEach((ms) => window.setTimeout(() => restore(SELF_NAME), ms));
  };

  const stop = () => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    prevRef.current.fill(2);
    lastFrameRef.current = -1;
    canvasSeenRef.current = null;
    bgDoneRef.current = false;
    sideHeavyRef.current = false;
    sideToneRef.current = SIDE_TONE_NORMAL;

    const names = minimizedRef.current;
    minimizedRef.current = [];
    if (names.length > 0) {
      names.filter((n) => n !== SELF_NAME).forEach((n) => restore(n));
      if (names.includes(SELF_NAME)) restore(SELF_NAME);
      raiseSelf();
    }
    changeMode('off');
  };
  const stopRef = useRef(stop);
  stopRef.current = stop;

  const prepare = async () => {
    if (!framesRef.current) {
      const res = await fetch(BIN_SRC);
      if (!res.ok) throw new Error('bin not found');
      const buf = new Uint8Array(await res.arrayBuffer());
      if (buf.length < FRAME_BYTES * 100) {
        throw new Error(`bad bin: ${buf.length} bytes, first byte ${buf[0]}`);
      }
      framesRef.current = buf;
      frameCountRef.current = Math.floor(buf.length / FRAME_BYTES);
    }

    if (!iconsRef.current) {
      let imgs: HTMLImageElement[] = [];
      if (desktopIcons && desktopIcons.length > 0) {
        const loaded = await Promise.all(desktopIcons.map(iconToImage));
        imgs = loaded.filter((i): i is HTMLImageElement => i !== null);
      }
      if (imgs.length === 0) imgs = await harvestDesktopIcons();
      iconsRef.current = imgs;

      const failed: string[] = [];
      const paths = [...new Set([...DARK_ICONS, ...LIGHT_ICONS].filter(isImagePath))];
      await Promise.all(
        paths.map(async (p) => {
          const img = await loadImage(p);
          if (img) imagesRef.current.set(p, img);
          else failed.push(p);
        })
      );

      const w: string[] = [];
      const wantsDesktop = [...DARK_ICONS, ...LIGHT_ICONS].includes('desktop');
      if (wantsDesktop && imgs.length === 0) {
        w.push("Couldn't read the desktop icons, so those slots are empty.");
      }
      failed.forEach((p) => w.push(`Couldn't load ${p}. Check that the file is in public.`));
      setWarnings(w);
    }
  };

  useEffect(() => {
    const id = window.setTimeout(() => {
      prepare().catch(() => {});
    }, 600);
    return () => {
      window.clearTimeout(id);
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onPlayingChange?.(mode === 'full');
    if (mode === 'off') {
      setShown(false);
      return;
    }
    const id = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stopRef.current();
    };
    const onResize = () => stopRef.current();
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const selfOpen = isWindowOpen(SELF_NAME);
  useEffect(() => {
    if (!selfOpen && modeRef.current === 'window') stopRef.current();
  }, [selfOpen]);

  const buildPool = (list: string[], tone: Tone, size: number) => {
    const pool: HTMLCanvasElement[] = [];
    list.forEach((entry) => {
      if (entry === 'desktop') {
        (iconsRef.current ?? []).forEach((img) => {
          const sprite = makeSprite(img, size, tone);
          for (let k = 0; k < DESKTOP_WEIGHT; k++) pool.push(sprite);
        });
      } else if (isImagePath(entry)) {
        const img = imagesRef.current.get(entry);
        if (img) pool.push(makeSprite(img, size, tone));
      } else {
        pool.push(makeSprite(entry, size, tone));
      }
    });
    if (pool.length === 0 && list.length > 0) pool.push(makeSprite('📁', size, tone));
    return pool;
  };

  const buildSides = (l: Layout) => {
    const sides: Sides = { x: [], y: [], d: [], l: [] };
    if (l.light) {
      const dn = Math.max(1, darkPoolRef.current.length);
      const ln = Math.max(1, lightPoolRef.current.length);
      for (let cy = 0; cy < l.rows; cy++) {
        for (let cx = 0; cx < l.cols; cx++) {
          const inside = cx >= l.padX && cx < l.padX + GRID_W && cy >= l.padY && cy < l.padY + GRID_H;
          if (inside) continue;
          if (Math.random() >= FILL_DENSITY) continue;
          sides.x.push(cx * l.size);
          sides.y.push(cy * l.size);
          sides.d.push(Math.floor(Math.random() * dn));
          sides.l.push(Math.floor(Math.random() * ln));
        }
      }
    }
    sidesRef.current = sides;
  };

  const drawSides = (ctx: CanvasRenderingContext2D, clear: boolean) => {
    const L = layoutRef.current;
    const sides = sidesRef.current;
    const tone = sideToneRef.current;
    const pool = tone === 'light' ? lightPoolRef.current : darkPoolRef.current;
    if (pool.length === 0) return;
    const idx = tone === 'light' ? sides.l : sides.d;
    for (let k = 0; k < sides.x.length; k++) {
      if (clear) ctx.clearRect(sides.x[k], sides.y[k], L.size, L.size);
      ctx.drawImage(pool[idx[k]], sides.x[k], sides.y[k]);
    }
  };

  const drawFrame = (canvas: HTMLCanvasElement, index: number) => {
    const frames = framesRef.current;
    if (!frames) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!bgDoneRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSides(ctx, false);
      bgDoneRef.current = true;
    }

    const L = layoutRef.current;
    const offset = index * FRAME_BYTES;
    const prev = prevRef.current;
    const darkCells = cellDarkRef.current;
    const lightCells = cellLightRef.current;
    const darkPool = darkPoolRef.current;
    const lightPool = lightPoolRef.current;
    const hasLight = L.light && lightPool.length > 0;
    let darkCount = 0;

    for (let i = 0; i < CELLS; i++) {
      const dark = (frames[offset + (i >> 3)] >> (7 - (i & 7))) & 1;
      darkCount += dark;
      if (dark !== prev[i]) {
        prev[i] = dark;
        const x = ((i % GRID_W) + L.padX) * L.size;
        const y = (Math.floor(i / GRID_W) + L.padY) * L.size;
        ctx.clearRect(x, y, L.size, L.size);
        if (dark) {
          if (darkPool.length > 0) ctx.drawImage(darkPool[darkCells[i]], x, y);
        } else if (hasLight) {
          ctx.drawImage(lightPool[lightCells[i]], x, y);
        }
      }
    }

    if (L.light) {
      const ratio = darkCount / CELLS;
      if (!sideHeavyRef.current && ratio >= SIDE_FLIP_AT) sideHeavyRef.current = true;
      else if (sideHeavyRef.current && ratio < SIDE_FLIP_BACK) sideHeavyRef.current = false;
      const tone = sideHeavyRef.current ? SIDE_TONE_HEAVY : SIDE_TONE_NORMAL;
      if (tone !== sideToneRef.current) {
        sideToneRef.current = tone;
        drawSides(ctx, true);
      }
    }
  };

  const loop = () => {
    if (!runningRef.current) return;
    const canvas = modeRef.current === 'full' ? fullCanvasRef.current : winCanvasRef.current;
    const a = audioRef.current;
    if (!canvas) {
      missingRef.current += 1;
      if (missingRef.current > 60) {
        stopRef.current();
        return;
      }
    } else if (a) {
      missingRef.current = 0;
      if (canvasSeenRef.current !== canvas) {
        canvasSeenRef.current = canvas;
        prevRef.current.fill(2);
        bgDoneRef.current = false;
        lastFrameRef.current = -1;
      }
      const now = performance.now();
      const audioTime = a.currentTime;
      if (Math.abs((now - baseRef.current) / 1000 - audioTime) > 0.15) {
        baseRef.current = now - audioTime * 1000;
      }
      const t = (now - baseRef.current) / 1000;
      const index = Math.min(Math.floor(t * FPS), frameCountRef.current - 1);
      if (index >= 0 && index !== lastFrameRef.current) {
        lastFrameRef.current = index;
        drawFrame(canvas, index);
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  const startPlay = async (m: 'full' | 'window') => {
    if (loading || modeRef.current !== 'off') return;
    setError('');
    setLoading(true);
    try {
      await prepare();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let cell: number;
      let padX = 0;
      let padY = 0;
      if (m === 'full') {
        const availW = window.innerWidth;
        const availH = window.innerHeight - TASKBAR_H;
        cell = Math.max(8, Math.floor(Math.min(availW / GRID_W, availH / GRID_H)));
        padX = Math.max(0, Math.ceil((availW - GRID_W * cell) / (2 * cell)));
        padY = Math.max(0, Math.ceil((availH - GRID_H * cell) / (2 * cell)));
      } else {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const w = wrap.clientWidth - 16;
        const h = wrap.clientHeight - 16;
        cell = Math.max(4, Math.floor(Math.min(w / GRID_W, h / GRID_H)));
      }
      const size = Math.round(cell * dpr);
      const next: Layout = {
        size,
        cell,
        padX,
        padY,
        cols: GRID_W + padX * 2,
        rows: GRID_H + padY * 2,
        light: m === 'full' && LIGHT_ICONS.length > 0,
      };
      layoutRef.current = next;
      setLayout(next);

      darkPoolRef.current = buildPool(DARK_ICONS, 'dark', size);
      lightPoolRef.current = next.light ? buildPool(LIGHT_ICONS, 'light', size) : [];
      buildSides(next);

      const darkCells = cellDarkRef.current;
      const lightCells = cellLightRef.current;
      for (let i = 0; i < CELLS; i++) {
        darkCells[i] = Math.floor(Math.random() * Math.max(1, darkPoolRef.current.length));
        lightCells[i] = Math.floor(Math.random() * Math.max(1, lightPoolRef.current.length));
      }

      const a = audioRef.current;
      if (!a) return;
      a.currentTime = 0;
      a.volume = 1;
      await a.play();

      if (m === 'full') {
        const names = windowNames.includes(SELF_NAME) ? windowNames : [...windowNames, SELF_NAME];
        const minimized: string[] = [];
        names.forEach((n) => {
          if (isWindowOpen(n)) {
            minimize(n);
            minimized.push(n);
          }
        });
        minimizedRef.current = minimized;
      }

      prevRef.current.fill(2);
      lastFrameRef.current = -1;
      canvasSeenRef.current = null;
      bgDoneRef.current = false;
      sideHeavyRef.current = false;
      sideToneRef.current = SIDE_TONE_NORMAL;
      missingRef.current = 0;
      baseRef.current = performance.now();
      runningRef.current = true;
      changeMode(m);
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      setError(`Couldn't play: ${e instanceof Error ? e.message : 'unknown error'}`);
      stop();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="auto"
        onEnded={() => stopRef.current()}
        onError={() => setError(`Couldn't load the audio at ${AUDIO_SRC}.`)}
      />

      <DesktopIcon
        width={720}
        height={660}
        icon={appleIcon}
        name={SELF_NAME}
        style={{ position: "fixed", right: "8vw", bottom: "12vh" }}
      >
        <Launcher
          mode={mode}
          loading={loading}
          error={error}
          warnings={warnings}
          layout={layout}
          wrapRef={wrapRef}
          canvasRef={winCanvasRef}
          onFull={() => startPlay('full')}
          onWindow={() => startPlay('window')}
          onStop={() => stopRef.current()}
        />
      </DesktopIcon>

      {mode === 'full' &&
        createPortal(
          <div
            onClick={() => stopRef.current()}
            title="Click or press Esc to stop"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: TASKBAR_H,
              zIndex: 9000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
              opacity: shown ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            <canvas
              ref={fullCanvasRef}
              width={layout.cols * layout.size}
              height={layout.rows * layout.size}
              style={{
                display: 'block',
                flexShrink: 0,
                width: layout.cols * layout.cell,
                height: layout.rows * layout.cell,
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}