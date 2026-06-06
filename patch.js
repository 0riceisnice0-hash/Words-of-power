/**
 * patch.js  — applies three fixes to index.html:
 *
 * 1. Text scaling: font size now proportional to segment arc height
 *    (bigger for few words, smaller for many words, floor 7px, cap 18px)
 *
 * 2. Black box animation: only behind #word-title, grows left-to-right via
 *    clip-path.  Whole-panel background removed.
 *
 * 3. Adjacent same-colour fix: adds "Test" to every letter whose word count
 *    is ≡ 1 (mod 3) — B, I, K, M, N, O, R, U.
 *    Paolo will swap each "Test" for a real word from Ingrid.
 *
 * Run: node patch.js
 */

const fs   = require('fs');
const path = require('path');
const HTML = path.join(__dirname, 'index.html');

let html = fs.readFileSync(HTML, 'utf8');

/* ── 1. Text scaling ─────────────────────────────────────────────── */
html = html.replace(
  /function drawSegText \(ctx, word, cx, cy, innerR, outerR, midAngle, hi, SIZE\) \{[\s\S]*?var fs = .*?;/,
  `function drawSegText (ctx, word, cx, cy, innerR, outerR, midAngle, hi, SIZE, n) {
    var textEdge = outerR - SIZE * 0.028;
    var maxW     = textEdge - innerR - SIZE * 0.02;
    /* Scale font to segment arc height so words always fit comfortably */
    var midR     = (innerR + outerR) / 2;
    var segArcH  = midR * (2 * Math.PI / n);
    var fs       = Math.max(7, Math.min(SIZE * 0.032, segArcH * 0.78, 18));`
);

/* Pass n into drawSegText call */
html = html.replace(
  /drawSegText\(ctx, entries\[i\], cx, cy, innerR, ringR, mid, hi, SIZE\);/,
  'drawSegText(ctx, entries[i], cx, cy, innerR, ringR, mid, hi, SIZE, n);'
);

/* ── 2. Black-box animation on word title only ───────────────────── */

/* Remove background/padding from #word-state */
html = html.replace(
  /\/\* Word reveal state \*\/\s+#word-state \{[\s\S]*?#word-state\.visible \{[\s\S]*?\}/,
  `/* Word reveal state */
    #word-state {
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition:
        opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
    }
    #word-state.visible {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }`
);

/* Replace #word-title with clip-path grow animation */
html = html.replace(
  /#word-title \{[\s\S]*?overflow: visible;\s*\}/,
  `#word-title {
      font-family: var(--font-display);
      font-weight: 400;
      font-size: clamp(56px, 8vw, 96px);
      line-height: 1.1;
      color: var(--accent, var(--pink));
      letter-spacing: -0.005em;
      display: inline-block;
      background: #000000;
      padding: 4px 14px 8px 0;
      /* Start fully clipped — grows left-to-right on reveal */
      clip-path: inset(0 100% 0 0);
      transition: clip-path 0.52s cubic-bezier(0.22, 1, 0.36, 1) 0.08s;
    }
    #word-state.visible #word-title {
      clip-path: inset(0 0% 0 0);
    }`
);

/* ── 3. Add "Test" to letters where count ≡ 1 (mod 3) ─────────────
   Letters: B(46), I(88), K(13), M(64), N(28), O(28), R(61), U(49)
   Adding one word makes each count ≡ 2 (mod 3), so first+last differ.
   Paolo to swap "Test" for a real Ingrid-approved word.
─────────────────────────────────────────────────────────────────── */
const NEED_TEST = ['B', 'I', 'K', 'M', 'N', 'O', 'R', 'U'];

NEED_TEST.forEach(function (letter) {
  /* Match the closing of this letter's array: last "word"\n  ], */
  const re = new RegExp(
    '(  ' + letter + ': \\[[\\s\\S]*?)(\\s*\\],)',
    ''
  );
  const before = html.match(re);
  if (!before) { console.warn('Could not find letter ' + letter); return; }
  html = html.replace(re, '$1,\n    "Test"$2');
});

/* ── Write ──────────────────────────────────────────────────────── */
fs.writeFileSync(HTML, html, 'utf8');

/* ── Report ─────────────────────────────────────────────────────── */
console.log('\nPatches applied:');
console.log('  1. drawSegText font scaling by segment arc height');
console.log('  2. #word-title black-box clip-path animation');
console.log('  3. "Test" added to:', NEED_TEST.join(', '));
