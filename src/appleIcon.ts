// A small apple drawn as SVG, exported as an image address so it can be used anywhere an <img src> works.
const svg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
  <path d='M16 9c-2-2-7-2-9 2-2 4 0 11 3 14 2 2 4 1 6 1s4 1 6-1c3-3 5-10 3-14-2-4-7-4-9-2z'
        fill='#d62828' stroke='#600000' stroke-width='1'/>
  <path d='M16 9c0-3 1-5 3-6' stroke='#4a2c0a' stroke-width='2' fill='none'/>
  <path d='M19 4c3-1 5 0 6 1-2 2-5 2-6-1z' fill='#2e9e3a'/>
  <ellipse cx='11' cy='14' rx='2' ry='3' fill='#ffffff' opacity='0.35'/>
</svg>`;

export const appleIcon = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;