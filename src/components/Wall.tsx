import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import { Button, Tab, Tabs } from '@react95/core';
import { addDoc, collection, doc, increment, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const MAX_NAME = 24;
const MAX_NOTE = 280;
const CANVAS_W = 320;
const CANVAS_H = 200;
const COOLDOWN_MS = 30000; // wait between posts (per browser)

const PALETTE = [
  '#000000', '#808080', '#c0c0c0', '#ffffff', '#800000', '#ff0000', '#808000', '#ffff00',
  '#008000', '#00ff00', '#008080', '#00ffff', '#000080', '#0000ff', '#800080', '#ff00ff',
];
const SIZES = [2, 5, 10];

// Windows 95 bevels
const bevelOut = {
  borderTop: '2px solid #ffffff',
  borderLeft: '2px solid #ffffff',
  borderRight: '2px solid #404040',
  borderBottom: '2px solid #404040',
} as const;
const bevelIn = {
  borderTop: '2px solid #808080',
  borderLeft: '2px solid #808080',
  borderRight: '2px solid #ffffff',
  borderBottom: '2px solid #ffffff',
} as const;

const fieldStyle = {
  ...bevelIn,
  background: '#ffffff',
  color: '#000000',
  padding: '4px 6px',
  fontSize: '14px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
} as const;

type Post = {
  id: string;
  type: 'note' | 'drawing';
  name: string;
  text?: string;
  drawing?: string;
  likes: number;
  dislikes: number;
  ms: number;
};

type Status = { ok: boolean; text: string } | null;

function cooledDown() {
  try {
    const last = Number(localStorage.getItem('wall:last') || 0);
    return Date.now() - last > COOLDOWN_MS;
  } catch {
    return true;
  }
}
function stampPost() {
  try {
    localStorage.setItem('wall:last', String(Date.now()));
  } catch {
    /* storage can be unavailable; ignore */
  }
}

/* ---------------- Drawing pad ---------------- */

function DrawPad({ onSubmit, busy }: { onSubmit: (dataUrl: string) => void; busy: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const [dirty, setDirty] = useState(false);

  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    setDirty(false);
  };

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const point = (e: RPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * CANVAS_W) / r.width,
      y: ((e.clientY - r.top) * CANVAS_H) / r.height,
    };
  };

  const down = (e: RPointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const p = point(e);
    last.current = p;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    setDirty(true);
  };

  const move = (e: RPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !last.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = point(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const up = () => {
    drawingRef.current = false;
    last.current = null;
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        style={{
          ...bevelIn,
          display: 'block',
          width: '100%',
          maxWidth: '480px',
          height: 'auto',
          background: '#ffffff',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', margin: '10px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 22px)', gap: '2px' }}>
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              style={{
                width: '22px',
                height: '22px',
                background: c,
                cursor: 'pointer',
                padding: 0,
                ...(color === c
                  ? { border: '2px solid #000', outline: '2px solid #fff' }
                  : bevelOut),
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {SIZES.map((s) => (
            <Button key={s} onClick={() => setSize(s)} style={size === s ? { fontWeight: 'bold' } : undefined}>
              {s === 2 ? 'S' : s === 5 ? 'M' : 'L'}
            </Button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button onClick={() => setColor('#ffffff')}>Eraser</Button>
          <Button onClick={clear}>Clear</Button>
        </div>
      </div>

      <Button
        disabled={!dirty || busy}
        onClick={() => {
          if (canvasRef.current) onSubmit(canvasRef.current.toDataURL('image/png'));
        }}
      >
        {busy ? 'Sending…' : 'Post Drawing'}
      </Button>
    </div>
  );
}

/* ---------------- Main window ---------------- */

export default function Wall() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [paneH, setPaneH] = useState(400);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [drawKey, setDrawKey] = useState(0);
  // Remember which posts this browser already voted on (one vote per post).
  const [myVotes, setMyVotes] = useState<Record<string, 1 | -1>>(() => {
    try {
      return JSON.parse(localStorage.getItem('wall:votes') || '{}');
    } catch {
      return {};
    }
  });

  const vote = async (id: string, value: 1 | -1) => {
    if (!db || myVotes[id]) return;
    try {
      await updateDoc(doc(db, 'wall', id), value === 1 ? { likes: increment(1) } : { dislikes: increment(1) });
      const next = { ...myVotes, [id]: value };
      setMyVotes(next);
      try {
        localStorage.setItem('wall:votes', JSON.stringify(next));
      } catch {
        /* storage can be unavailable; ignore */
      }
    } catch {
      /* vote failed; ignore */
    }
  };

  // Size the tab panes to the window (and keep them in sync when it is resized).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const strip = el.querySelector('[role="tablist"]') as HTMLElement | null;
      const stripH = strip ? strip.offsetHeight : 40;
      setPaneH(Math.max(150, el.clientHeight - stripH - 24));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Live-load approved posts only (the security rules enforce this too).
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'wall'), where('approved', '==', true));
    const unsub = onSnapshot(
      q,
      (snap: QuerySnapshot<DocumentData>) => {
        const list: Post[] = snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => {
          const x = d.data();
          return {
            id: d.id,
            type: x.type === 'drawing' ? 'drawing' : 'note',
            name: typeof x.name === 'string' ? x.name : 'Anonymous',
            text: typeof x.text === 'string' ? x.text : undefined,
            drawing: typeof x.drawing === 'string' ? x.drawing : undefined,
            likes: typeof x.likes === 'number' ? x.likes : 0,
            dislikes: typeof x.dislikes === 'number' ? x.dislikes : 0,
            ms: x.createdAt?.toMillis?.() ?? 0,
          };
        });
        list.sort((a, b) => b.ms - a.ms);
        setPosts(list);
        setLoadError(false);
      },
      () => setLoadError(true),
    );
    return unsub;
  }, []);

  const submit = async (type: 'note' | 'drawing', body: { text?: string; drawing?: string }) => {
    if (!db) return;
    if (!cooledDown()) {
      setStatus({ ok: false, text: 'Please wait a little bit between posts.' });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await addDoc(collection(db, 'wall'), {
        type,
        name: (name.trim() || 'Anonymous').slice(0, MAX_NAME),
        approved: true, // posts go live right away. Set this to false in the Firebase console to hide one.
        likes: 0,
        dislikes: 0,
        createdAt: serverTimestamp(),
        ...body,
      });
      stampPost();
      setStatus({ ok: true, text: 'Thanks! Your post is now on the wall.' });
      if (type === 'note') setNote('');
      else setDrawKey((k) => k + 1);
    } catch {
      setStatus({ ok: false, text: 'Sorry, that could not be sent. Please try again later.' });
    } finally {
      setBusy(false);
    }
  };

  // Hide posts the community has voted down.
  const visible = posts.filter((p) => p.likes - p.dislikes > -3);

  const pane = {
    overflowY: 'auto',
    height: `${paneH}px`,
    boxSizing: 'border-box',
    padding: '8px 14px',
  } as const;

  const nameField = (
    <label style={{ display: 'block', marginBottom: '10px' }}>
      <div style={{ marginBottom: '3px' }}>Your name (optional)</div>
      <input
        type="text"
        value={name}
        maxLength={MAX_NAME}
        onChange={(e) => setName(e.target.value)}
        placeholder="Anonymous"
        style={{ ...fieldStyle, width: '220px' }}
      />
    </label>
  );

  const statusBox = status && (
    <div
      role="status"
      style={{
        ...bevelIn,
        background: '#ffffff',
        color: status.ok ? '#006400' : '#a00000',
        padding: '8px 10px',
        margin: '10px 0',
      }}
    >
      {status.text}
    </div>
  );

  const rulesNote = (
    <p style={{ fontSize: '13px', margin: '0 0 10px 0' }}>
      Please keep it friendly and appropriate. Posts appear right away, and posts that get disliked a lot are hidden.
    </p>
  );

  if (!db) {
    return (
      <div style={{ padding: '16px' }}>
        <h3>Guestbook</h3>
        <p>The guestbook isn't set up yet. Add your Firebase settings to <code>src/firebase.ts</code> to turn it on.</p>
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ height: '100%', width: '100%' }}>
      <Tabs defaultActiveTab="Wall">
        <Tab title="Wall">
          <div style={pane}>
            <h3 style={{ margin: '0 0 8px 0' }}>The Wall</h3>
            <p style={{ margin: '0 0 12px 0' }}>Notes and drawings left by visitors. Leave one in the other tabs!</p>

            {loadError && <p style={{ color: '#a00000' }}>Couldn't load the wall right now. Try again later.</p>}
            {!loadError && visible.length === 0 && <p>Nothing here yet. Be the first to leave something!</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
              {visible.map((p) => (
                <div key={p.id} style={{ background: '#c0c0c0', ...bevelOut, boxShadow: '1px 1px 0 #000', padding: '3px' }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #000080, #1084d0)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    padding: '2px 6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                    <span style={{ fontWeight: 'normal' }}>{p.ms ? new Date(p.ms).toLocaleDateString() : ''}</span>
                  </div>
                  <div style={{ ...bevelIn, background: '#ffffff', color: '#000', margin: '6px', padding: '8px', minHeight: '40px' }}>
                    {p.type === 'note' ? (
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.4 }}>{p.text}</p>
                    ) : p.drawing?.startsWith('data:image/png;base64,') ? (
                      <img
                        src={p.drawing}
                        alt={`Drawing by ${p.name}`}
                        style={{ display: 'block', width: '100%', height: 'auto', maxWidth: `${CANVAS_W}px` }}
                      />
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', padding: '0 6px 6px 6px' }}>
                    <Button
                      disabled={!!myVotes[p.id]}
                      onClick={() => vote(p.id, 1)}
                      style={myVotes[p.id] === 1 ? { fontWeight: 'bold' } : undefined}
                    >
                      👍 {p.likes}
                    </Button>
                    <Button
                      disabled={!!myVotes[p.id]}
                      onClick={() => vote(p.id, -1)}
                      style={myVotes[p.id] === -1 ? { fontWeight: 'bold' } : undefined}
                    >
                      👎 {p.dislikes}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tab>

        <Tab title="Write a Note">
          <div style={pane}>
            <h3 style={{ margin: '0 0 8px 0' }}>Leave a Note</h3>
            {rulesNote}
            {nameField}
            <label style={{ display: 'block' }}>
              <div style={{ marginBottom: '3px' }}>Your note</div>
              <textarea
                value={note}
                maxLength={MAX_NOTE}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                style={{ ...fieldStyle, width: '100%', maxWidth: '480px', resize: 'vertical' }}
              />
            </label>
            <div style={{ fontSize: '12px', margin: '3px 0 10px 0' }}>{note.length}/{MAX_NOTE}</div>
            <Button disabled={busy || note.trim().length === 0} onClick={() => submit('note', { text: note.trim() })}>
              {busy ? 'Sending…' : 'Post Note'}
            </Button>
            {statusBox}
          </div>
        </Tab>

        <Tab title="Draw">
          <div style={pane}>
            <h3 style={{ margin: '0 0 8px 0' }}>Draw Something</h3>
            {rulesNote}
            {nameField}
            <DrawPad key={drawKey} busy={busy} onSubmit={(dataUrl) => submit('drawing', { drawing: dataUrl })} />
            {statusBox}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}