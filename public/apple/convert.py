#!/usr/bin/env python3
import argparse
import subprocess
import sys

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("out")
ap.add_argument("--w", type=int, default=48)
ap.add_argument("--h", type=int, default=36)
ap.add_argument("--fps", type=float, default=12.4)
ap.add_argument("--threshold", type=int, default=128)
a = ap.parse_args()

cmd = [
    "ffmpeg", "-v", "error", "-i", a.video,
    "-vf", f"fps={a.fps},scale={a.w}:{a.h}:flags=area,format=gray",
    "-f", "rawvideo", "-pix_fmt", "gray", "-",
]

try:
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
except FileNotFoundError:
    sys.exit("ffmpeg not found. Install it with: brew install ffmpeg")

n = a.w * a.h
frame_bytes = (n + 7) // 8
frames = 0

with open(a.out, "wb") as out:
    while True:
        raw = proc.stdout.read(n)
        if len(raw) < n:
            break
        packed = bytearray(frame_bytes)
        for i, v in enumerate(raw):
            if v < a.threshold:
                packed[i >> 3] |= 0x80 >> (i & 7)
        out.write(packed)
        frames += 1

proc.wait()
print(f"Wrote {frames} frames ({frames * frame_bytes / 1024:.0f} KB) to {a.out}")
print(f"Grid {a.w} x {a.h}. Set FPS = {a.fps} in BadApple.tsx")