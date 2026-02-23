// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
let currentLang = 'html';
const inputCode = document.getElementById('inputCode');
const outputCode = document.getElementById('outputCode');

// ──────────────────────────────────────────────
// TABS
// ──────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentLang = tab.dataset.lang;
    updateDots();
    updateInputStats();
});
});

function updateDots() {
const dotClass = { html: 'dot-html', css: 'dot-css', js: 'dot-js' };
const label = currentLang.toUpperCase();
['inputDot','outputDot'].forEach(id => {
    const el = document.getElementById(id);
    el.className = 'panel-label-dot ' + dotClass[currentLang];
});
document.getElementById('inputLabel').textContent = label;
document.getElementById('outputLabel').textContent = label;
}

// ──────────────────────────────────────────────
// STATS
// ──────────────────────────────────────────────
function updateInputStats() {
const val = inputCode.value;
const lines = val ? val.split('\n').length : 0;
document.getElementById('inputLines').textContent = lines + ' lines';
document.getElementById('inputChars').textContent = val.length + ' chars';
const badge = document.getElementById('inputBadge');
if (val.trim()) {
    badge.className = 'status-badge badge-ready';
    badge.textContent = 'Has Input';
} else {
    badge.className = 'status-badge badge-idle';
    badge.textContent = 'Idle';
}
}

function updateOutputStats(original, beautified) {
const lines = beautified ? beautified.split('\n').length : 0;
document.getElementById('outputLines').textContent = lines + ' lines';
const diff = original.length - beautified.length;
const saved = document.getElementById('savedChars');
if (diff > 0) {
    saved.textContent = '−' + diff + ' chars saved';
    saved.style.color = 'var(--accent)';
} else if (diff < 0) {
    saved.textContent = '+' + Math.abs(diff) + ' chars added';
    saved.style.color = 'var(--accent2)';
} else {
    saved.textContent = 'No size change';
    saved.style.color = '';
}
}

inputCode.addEventListener('input', updateInputStats);

// ──────────────────────────────────────────────
// BEAUTIFIERS
// ──────────────────────────────────────────────

function getIndent() {
const v = document.getElementById('indentSize').value;
return v === 'tab' ? '\t' : ' '.repeat(parseInt(v));
}

// ── HTML Beautifier ──
function beautifyHTML(code) {
const INDENT = getIndent();
const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const inlineTags = new Set(['a','abbr','acronym','b','bdo','big','br','button','cite','code','dfn','em','i','img','input','kbd','label','map','object','output','q','samp','select','small','span','strong','sub','sup','textarea','time','tt','u','var']);
const rawTags = new Set(['script','style','pre','code']);

let indent = 0;
let result = '';
let i = 0;
const lines = [];

function pad() { return INDENT.repeat(Math.max(0, indent)); }

while (i < code.length) {
    // Comment
    if (code.startsWith('<!--', i)) {
    const end = code.indexOf('-->', i);
    if (end === -1) { lines.push(pad() + code.slice(i)); break; }
    const comment = code.slice(i, end + 3).trim();
    const commentLines = comment.split('\n');
    commentLines.forEach(cl => lines.push(pad() + cl.trim()));
    i = end + 3;
    continue;
    }

    // DOCTYPE
    if (code.slice(i).match(/^<!DOCTYPE/i)) {
    const end = code.indexOf('>', i);
    lines.push(code.slice(i, end + 1).trim());
    i = end + 1;
    continue;
    }

    // Tag
    if (code[i] === '<') {
    const end = code.indexOf('>', i);
    if (end === -1) { lines.push(pad() + code.slice(i)); break; }
    const tag = code.slice(i, end + 1).trim();
    const tagName = (tag.match(/^<\/?([a-z0-9-]+)/i) || [])[1];
    const isClose = tag.startsWith('</');
    const isSelfClose = tag.endsWith('/>');
    const isVoid = tagName && voidTags.has(tagName.toLowerCase());
    const isRaw = tagName && rawTags.has(tagName.toLowerCase());
    const isInline = tagName && inlineTags.has(tagName.toLowerCase());

    if (isClose) indent = Math.max(0, indent - 1);

    lines.push(pad() + tag);

    if (!isClose && !isSelfClose && !isVoid) {
        if (isRaw) {
        // grab raw content until closing tag
        i = end + 1;
        const closeTag = '</' + tagName;
        const rawEnd = code.toLowerCase().indexOf(closeTag.toLowerCase(), i);
        if (rawEnd === -1) { lines.push(code.slice(i)); break; }
        const rawContent = code.slice(i, rawEnd).trim();
        if (rawContent) {
            indent++;
            rawContent.split('\n').forEach(l => lines.push(pad() + l));
            indent--;
        }
        const closingEnd = code.indexOf('>', rawEnd);
        lines.push(pad() + code.slice(rawEnd, closingEnd + 1).trim());
        i = closingEnd + 1;
        continue;
        }
        indent++;
    }

    i = end + 1;
    // skip whitespace
    while (i < code.length && code[i] === '\n') i++;
    continue;
    }

    // Text
    const nextTag = code.indexOf('<', i);
    const text = (nextTag === -1 ? code.slice(i) : code.slice(i, nextTag)).trim();
    if (text) lines.push(pad() + text);
    i = nextTag === -1 ? code.length : nextTag;
}

return lines.filter(l => l !== undefined).join('\n');
}

// ── CSS Beautifier ──
function beautifyCSS(code) {
const INDENT = getIndent();
let result = '';
let depth = 0;

// Normalize
code = code
    .replace(/\/\*[\s\S]*?\*\//g, m => m) // preserve comments
    .replace(/\s*\{\s*/g, ' {\n')
    .replace(/\s*\}\s*/g, '\n}\n')
    .replace(/\s*;\s*/g, ';\n')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\n{3,}/g, '\n\n');

const lines = code.split('\n');
const out = [];

for (let line of lines) {
    line = line.trim();
    if (!line) { out.push(''); continue; }

    if (line.includes('}')) {
    depth = Math.max(0, depth - 1);
    }

    out.push(INDENT.repeat(depth) + line);

    if (line.endsWith('{')) depth++;
}

return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ── JS Beautifier ──
function beautifyJS(code) {
const INDENT = getIndent();
const addSemicolons = document.getElementById('jsSemicolons').checked;

let result = '';
let depth = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;
let output = [];
let current = '';

function pushLine(s) {
    const trimmed = s.trim();
    if (!trimmed) return;
    output.push(INDENT.repeat(Math.max(0, depth)) + trimmed);
}

// Simplified tokenizer approach
// First: normalize spacing around operators and braces
code = code
    // Remove excess whitespace
    .replace(/[ \t]+/g, ' ')
    // Space after comma
    .replace(/,(?!\n)/g, ', ')
    // Space around operators (rough)
    .replace(/\s*=>\s*/g, ' => ')
    .replace(/\s*===\s*/g, ' === ')
    .replace(/\s*!==\s*/g, ' !== ')
    .replace(/\s*==\s*/g, ' == ')
    .replace(/\s*!=\s*/g, ' != ')
    .replace(/\s*\+=\s*/g, ' += ')
    .replace(/\s*-=\s*/g, ' -= ')
    .replace(/\s*\*=\s*/g, ' *= ');

// Split into logical lines by ; { }
const lines = [];
let cur = '';
let strMode = false;
let strChar = '';
let esc = false;
let templateDepth = 0;

for (let ci = 0; ci < code.length; ci++) {
    const ch = code[ci];
    const next = code[ci + 1];

    if (esc) { cur += ch; esc = false; continue; }
    if (ch === '\\' && strMode) { cur += ch; esc = true; continue; }

    if (!strMode && (ch === '"' || ch === "'" || ch === '`')) {
    strMode = true; strChar = ch;
    cur += ch; continue;
    }
    if (strMode && ch === strChar) {
    strMode = false; cur += ch; continue;
    }
    if (strMode) { cur += ch; continue; }

    if (ch === '{' || ch === '(') {
    cur += ch;
    lines.push({ text: cur.trim(), open: ch });
    cur = '';
    continue;
    }
    if (ch === '}' || ch === ')') {
    if (cur.trim()) lines.push({ text: cur.trim(), open: null });
    cur = '';
    lines.push({ text: ch, close: ch });
    continue;
    }
    if (ch === ';') {
    cur += ch;
    lines.push({ text: cur.trim(), open: null });
    cur = '';
    continue;
    }
    if (ch === '\n') {
    if (cur.trim()) lines.push({ text: cur.trim(), open: null });
    cur = '';
    continue;
    }
    cur += ch;
}
if (cur.trim()) lines.push({ text: cur.trim() });

// Reconstruct with indentation
let d = 0;
const outLines = [];

for (const token of lines) {
    if (!token.text) continue;
    const text = token.text;

    if (token.close) {
    d = Math.max(0, d - 1);
    const prev = outLines[outLines.length - 1];
    // Try to join closing paren on same line for short stuff
    outLines.push(INDENT.repeat(d) + text);
    continue;
    }

    outLines.push(INDENT.repeat(d) + text);

    if (token.open === '{') d++;
}

let joined = outLines.join('\n');

// Clean up blank lines
joined = joined.replace(/\n{3,}/g, '\n\n').trim();

return joined;
}

// ──────────────────────────────────────────────
// BEAUTIFY BUTTON
// ──────────────────────────────────────────────
document.getElementById('beautifyBtn').addEventListener('click', () => {
const raw = inputCode.value;
if (!raw.trim()) return;

const outputBadge = document.getElementById('outputBadge');
const outputPanel = document.getElementById('outputPanel');

try {
    let beautified = '';
    if (currentLang === 'html') beautified = beautifyHTML(raw);
    else if (currentLang === 'css') beautified = beautifyCSS(raw);
    else beautified = beautifyJS(raw);

    outputCode.value = beautified;
    outputCode.classList.remove('beautified');
    void outputCode.offsetWidth;
    outputCode.classList.add('beautified');

    outputPanel.classList.add('glowing');
    setTimeout(() => outputPanel.classList.remove('glowing'), 600);

    outputBadge.className = 'status-badge badge-ready';
    outputBadge.textContent = '✓ Done';

    updateOutputStats(raw, beautified);

} catch (e) {
    outputBadge.className = 'status-badge badge-error';
    outputBadge.textContent = '✗ Error';
    outputCode.value = 'Error: ' + e.message;
}
});

// ──────────────────────────────────────────────
// CLEAR
// ──────────────────────────────────────────────
document.getElementById('clearBtn').addEventListener('click', () => {
inputCode.value = '';
outputCode.value = '';
document.getElementById('inputBadge').className = 'status-badge badge-idle';
document.getElementById('inputBadge').textContent = 'Idle';
document.getElementById('outputBadge').className = 'status-badge badge-idle';
document.getElementById('outputBadge').textContent = 'Ready';
document.getElementById('inputLines').textContent = '0 lines';
document.getElementById('inputChars').textContent = '0 chars';
document.getElementById('outputLines').textContent = '0 lines';
document.getElementById('savedChars').textContent = '';
updateInputStats();
});

// ──────────────────────────────────────────────
// COPY
// ──────────────────────────────────────────────
document.getElementById('copyBtn').addEventListener('click', () => {
if (!outputCode.value) return;
navigator.clipboard.writeText(outputCode.value).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
    btn.textContent = 'Copy';
    btn.classList.remove('copied');
    }, 2000);
});
});

// ──────────────────────────────────────────────
// PASTE
// ──────────────────────────────────────────────
document.getElementById('pasteBtn').addEventListener('click', async () => {
try {
    const text = await navigator.clipboard.readText();
    inputCode.value = text;
    updateInputStats();
} catch(e) {
    inputCode.focus();
}
});

// ──────────────────────────────────────────────
// SWAP
// ──────────────────────────────────────────────
document.getElementById('swapBtn').addEventListener('click', () => {
const tmp = inputCode.value;
inputCode.value = outputCode.value;
outputCode.value = tmp;
updateInputStats();
updateOutputStats(outputCode.value, inputCode.value);
});

// ──────────────────────────────────────────────
// KEYBOARD SHORTCUT
// ──────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('beautifyBtn').click();
}
});

// Tab key support in textarea
inputCode.addEventListener('keydown', (e) => {
if (e.key === 'Tab') {
    e.preventDefault();
    const start = inputCode.selectionStart;
    const end = inputCode.selectionEnd;
    const indent = document.getElementById('indentSize').value === 'tab' ? '\t' : '  ';
    inputCode.value = inputCode.value.substring(0, start) + indent + inputCode.value.substring(end);
    inputCode.selectionStart = inputCode.selectionEnd = start + indent.length;
    updateInputStats();
}
});

updateInputStats();