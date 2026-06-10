/**
 * patch2.js — applies all requested changes to index.html in one pass:
 *
 *  1. Replaces TEST placeholder words with Paolo's provided words
 *  2. Adds dev-tools colour picker (hidden, revealed by gear button)
 *  3. Slows down black-box animation (0.52s → 0.75s)
 *  4. Centres word in black box (equal padding both sides)
 *  5. Makes alphabet buttons larger + bold; enlarges "Letter:" label
 *  6. Removes #meta-count ("xx words") and #landed ("Your word is xx")
 *
 * Word-list completeness is handled by rebuild-words.js (run separately).
 *
 * Run:  node patch2.js
 */

const fs   = require('fs');
const path = require('path');
const HTML = path.join(__dirname, 'index.html');

let html = fs.readFileSync(HTML, 'utf8');

/* ── 1. Replace TEST placeholder words ─────────────────────────────── */
// Map letter → replacement (N has no provided word → keep TEST)
const TEST_REPLACEMENTS = {
  B: 'Balanced',
  I: 'Ideal',
  K: 'Keen',
  M: 'Made',
  O: 'Objective',
  R: 'Racy',
  U: 'Uber',
};

// The WORDS object has arrays like:   B: [ ... "TEST"  ]
// We do a targeted replacement per letter so we don't touch N's TEST.
Object.entries(TEST_REPLACEMENTS).forEach(([letter, word]) => {
  // Match the specific letter's array and replace its TEST entry
  const re = new RegExp(
    `(  ${letter}: \\[[\\s\\S]*?)(,?\\s*"TEST")(\\s*\\])`,
    ''
  );
  if (re.test(html)) {
    html = html.replace(re, `$1,\n    "${word}"$3`);
    console.log(`  ${letter}: TEST → ${word}`);
  } else {
    console.warn(`  ${letter}: TEST not found — already replaced?`);
  }
});

/* ── 2. Slow down black-box animation ───────────────────────────────── */
html = html.replace(
  /transition: clip-path 0\.52s cubic-bezier\(0\.22, 1, 0\.36, 1\) 0\.08s;/,
  'transition: clip-path 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;'
);

/* ── 3. Centre word in black box (equal left+right padding) ─────────── */
html = html.replace(
  /padding: 4px 14px 8px 0;/,
  'padding: 4px 14px 8px 14px;'
);

/* ── 4. Larger + bolder alphabet buttons ────────────────────────────── */
html = html.replace(
  /\.letter-btn \{([\s\S]*?)font-size: 17px;([\s\S]*?)font-weight: 400;/,
  (m, before, after) =>
    `.letter-btn {${before}font-size: 22px;${after}font-weight: 700;`
);

/* ── 5. Larger "Letter:" meta label ─────────────────────────────────── */
html = html.replace(
  /\.meta-label \{([\s\S]*?)font-size: 12px;([\s\S]*?)letter-spacing: 0\.24em;/,
  (m, before, after) =>
    `.meta-label {${before}font-size: 16px;${after}letter-spacing: 0.18em;`
);

/* ── 6. Hide #meta-count ("xx words") and #landed ("Your word is xx") ─ */
// Hide via CSS rather than removing (safer for JS references)
html = html.replace(
  /\.meta-count \{[\s\S]*?color: rgba\(244, 240, 232, 0\.4\);\s*\}/,
  (m) => m + '\n    #meta-count { display: none; }'
);

// Add display:none to #landed rule
html = html.replace(
  /#landed \{([\s\S]*?)text-align: center;\s*\}/,
  (m, inner) => `#landed {${inner}text-align: center;\n      display: none;\n    }`
);

/* ── 7. Dev-tools colour picker ─────────────────────────────────────── */
// Inject CSS
const devCSS = `
    /* ── Dev-tools colour picker ──────────────────────────────────── */
    #devtools-btn {
      position: fixed;
      bottom: 18px;
      right: 18px;
      z-index: 999;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(0,0,0,0.45);
      border: 1px solid rgba(255,255,255,0.18);
      color: rgba(255,255,255,0.6);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    #devtools-btn:hover { background: rgba(0,0,0,0.75); color: #fff; }

    #devtools-panel {
      display: none;
      position: fixed;
      bottom: 64px;
      right: 18px;
      z-index: 998;
      background: rgba(0,0,0,0.88);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 16px 20px;
      min-width: 200px;
      font-family: 'PT Sans', sans-serif;
      font-size: 13px;
      color: rgba(255,255,255,0.8);
    }
    #devtools-panel.open { display: block; }
    #devtools-panel h4 {
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
      margin-bottom: 14px;
      font-weight: 400;
    }
    .dt-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      gap: 12px;
    }
    .dt-row:last-child { margin-bottom: 0; }
    .dt-row label { flex: 1; }
    .dt-row input[type="color"] {
      width: 36px;
      height: 28px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      padding: 0;
      background: none;
    }`;

html = html.replace(
  /(@media \(max-width: 420px\)[\s\S]*?\})\s*<\/style>/,
  `$1\n${devCSS}\n  </style>`
);

// Inject HTML (before </div> closing #app)
const devHTML = `
  <!-- ── Dev-tools colour picker ──────────────────────────────── -->
  <button id="devtools-btn" title="Developer colour tools" aria-label="Open colour tools">&#9881;</button>
  <div id="devtools-panel">
    <h4>Wheel Colours</h4>
    <div class="dt-row">
      <label>Pink</label>
      <input type="color" id="dt-pink" value="#e73879" />
    </div>
    <div class="dt-row">
      <label>Yellow</label>
      <input type="color" id="dt-yellow" value="#fcc737" />
    </div>
    <div class="dt-row">
      <label>Purple</label>
      <input type="color" id="dt-purple" value="#7e1891" />
    </div>
  </div>`;

html = html.replace('</div>\n\n<script>', devHTML + '\n</div>\n\n<script>');

// Inject JS (before the closing </script>)
const devJS = `
  /* ── Dev-tools colour picker ────────────────────────────────── */
  (function () {
    var btn    = document.getElementById('devtools-btn');
    var panel  = document.getElementById('devtools-panel');
    var dtPink   = document.getElementById('dt-pink');
    var dtYellow = document.getElementById('dt-yellow');
    var dtPurple = document.getElementById('dt-purple');
    var root   = document.documentElement;

    btn.addEventListener('click', function () {
      panel.classList.toggle('open');
    });

    function applyColour(varName, val) {
      root.style.setProperty(varName, val);
      /* Re-draw wheel so segment colours update immediately */
      if (typeof draw === 'function') draw();
    }

    dtPink.addEventListener('input',   function () { applyColour('--pink',   dtPink.value);   });
    dtYellow.addEventListener('input', function () { applyColour('--yellow', dtYellow.value); });
    dtPurple.addEventListener('input', function () { applyColour('--purple', dtPurple.value); });

    /* Sync pickers if colours are changed programmatically */
    var mo = new MutationObserver(function () {
      var s = getComputedStyle(root);
      dtPink.value   = s.getPropertyValue('--pink').trim()   || '#e73879';
      dtYellow.value = s.getPropertyValue('--yellow').trim() || '#fcc737';
      dtPurple.value = s.getPropertyValue('--purple').trim() || '#7e1891';
    });
    mo.observe(root, { attributes: true, attributeFilter: ['style'] });
  }());`;

html = html.replace('</script>\n</body>', devJS + '\n</script>\n</body>');

/* ── Write ──────────────────────────────────────────────────────────── */
fs.writeFileSync(HTML, html, 'utf8');
console.log('\nAll patches applied to index.html.');
