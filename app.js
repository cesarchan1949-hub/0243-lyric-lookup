const INITIALS = [
  "gw",
  "kw",
  "ng",
  "b",
  "p",
  "m",
  "f",
  "d",
  "t",
  "n",
  "l",
  "g",
  "k",
  "h",
  "z",
  "c",
  "s",
  "j",
  "w",
];

const CJK_RE = /[\u3400-\u9fff\uf900-\ufaff]/g;
const TONE_RE = /[1-6]$/;
const MAX_NON_PATTERN_RESULTS = 140;

const state = {
  entries: [],
  chars: {},
  metadata: null,
  officialCloud: {},
  patternIndex: new Map(),
  mode: "auto",
  query: "",
  loose: false,
  timer: null,
};

const els = {
  input: document.querySelector("#queryInput"),
  clear: document.querySelector("#clearButton"),
  entryCount: document.querySelector("#entryCount"),
  charCount: document.querySelector("#charCount"),
  resultTitle: document.querySelector("#resultTitle"),
  resultCount: document.querySelector("#resultCount"),
  analysis: document.querySelector("#analysisPanel"),
  results: document.querySelector("#results"),
  empty: document.querySelector("#emptyState"),
  loose: document.querySelector("#looseToggle"),
  segments: Array.from(document.querySelectorAll(".segment")),
  samples: Array.from(document.querySelectorAll("[data-query]")),
};

function cjkOnly(text) {
  return (text.match(CJK_RE) || []).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function finalForSyllable(syllable) {
  let base = syllable.toLowerCase().replace(TONE_RE, "");
  if (base === "ng") return "ng";
  for (const initial of INITIALS) {
    if (base.startsWith(initial) && base.length > initial.length) {
      return base.slice(initial.length);
    }
  }
  return base;
}

function normalizeLatin(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ü/g, "yu")
    .replace(/\s+/g, " ");
}

function prepareEntry(entry, index) {
  const term = entry.t || "";
  const simplified = entry.s || "";
  const jyutping = entry.j || "";
  const noTone = jyutping.replace(/[1-6]/g, "");
  return {
    ...entry,
    id: index,
    pure: cjkOnly(`${term}${simplified}`),
    display: simplified || term,
    q: `${term} ${simplified} ${jyutping} ${noTone} ${entry.p || ""} ${entry.f || ""}`.toLowerCase(),
    jNoTone: noTone,
  };
}

function buildPatternIndex(entries) {
  const index = new Map();
  for (const entry of entries) {
    if (!entry.p) continue;
    const bucket = index.get(entry.p) || [];
    bucket.push(entry);
    index.set(entry.p, bucket);
  }
  return index;
}

async function loadData() {
  const [lexicon, metadata, officialCloud] = await Promise.all([
    fetch("data/lexicon.json").then((response) => response.json()),
    fetch("data/metadata.json").then((response) => response.json()),
    fetch("data/official-cloud.json").then((response) => response.json()).catch(() => ({ patterns: {} })),
  ]);
  state.entries = lexicon.entries.map(prepareEntry);
  state.chars = lexicon.chars || {};
  state.metadata = metadata;
  state.officialCloud = officialCloud.patterns || {};
  state.patternIndex = buildPatternIndex(state.entries);
  els.entryCount.textContent = `${metadata.entryCount.toLocaleString()} 词条`;
  els.charCount.textContent = `${metadata.charCount.toLocaleString()} 单字`;
  render();
}

function detectQuery(query) {
  const raw = query.trim();
  const latin = normalizeLatin(raw);
  const mode = state.mode;
  const leadingPattern = raw.match(/^([0243]+)(.+)$/);

  if (mode !== "auto") return mode;
  if (/^[0243]+$/.test(raw)) return "pattern";
  if (leadingPattern) return "rhyme";
  if (CJK_RE.test(raw)) {
    CJK_RE.lastIndex = 0;
    return "chinese";
  }
  if (/^[a-z0-9\s]+$/.test(latin) && latin) return "jyutping";
  return "auto";
}

function finalsFromSuffix(suffix) {
  const cleaned = suffix.trim();
  const finals = new Set();
  if (!cleaned) return finals;

  if (CJK_RE.test(cleaned)) {
    CJK_RE.lastIndex = 0;
    for (const char of cjkOnly(cleaned)) {
      const readings = state.chars[char] || [];
      readings.forEach((reading) => {
        if (reading.f) finals.add(reading.f);
      });
    }
    return finals;
  }

  const latin = normalizeLatin(cleaned);
  const parts = latin.split(/\s+/).filter(Boolean);
  for (const part of parts.length ? parts : [latin]) {
    finals.add(TONE_RE.test(part) ? finalForSyllable(part) : part.replace(/[1-6]/g, ""));
  }
  return finals;
}

function scorePattern(entry, pattern) {
  if (entry.p === pattern) return 1000 - entry.l * 2;
  if (state.loose && entry.p.includes(pattern)) return 620 - Math.abs(entry.l - pattern.length);
  return 0;
}

function searchPattern(query) {
  const pattern = query.replace(/[^0243]/g, "");
  if (!pattern) return [];
  const official = state.officialCloud[pattern];
  if (official?.length) {
    return official.map((word) => ({
      type: "cloud",
      word: word.s || word.t,
      original: word.t,
      rank: word.rank,
      pattern,
      score: 5000 - word.rank,
    }));
  }

  const results = (state.patternIndex.get(pattern) || []).map((entry, index) => ({
    type: "cloud",
    entry,
    word: entry.display || entry.s || entry.t,
    original: entry.t,
    rank: index + 1,
    pattern,
    score: 2500 - index,
  }));
  if (state.loose) {
    for (const entry of state.entries) {
      if (entry.p !== pattern && entry.p.includes(pattern)) {
        results.push({
          type: "cloud",
          entry,
          word: entry.display || entry.s || entry.t,
          original: entry.t,
          rank: results.length + 1,
          pattern: entry.p,
          score: scorePattern(entry, pattern),
        });
      }
    }
  }

  return results.sort(sortResults);
}

function searchRhyme(query) {
  const match = query.trim().match(/^([0243]+)(.+)$/);
  if (!match) return searchPattern(query);
  const pattern = match[1];
  const suffix = match[2];
  const finals = finalsFromSuffix(suffix);
  if (!finals.size) return [];

  return state.entries
    .map((entry) => {
      const patternScore = scorePattern(entry, pattern);
      if (!patternScore) return { entry, score: 0 };
      const finalScore = finals.has(entry.f) ? 420 : 0;
      return { entry, score: finalScore ? patternScore + finalScore : 0 };
    })
    .filter((item) => item.score > 0)
    .sort(sortResults);
}

function searchChinese(query) {
  const needle = cjkOnly(query);
  if (!needle) return [];
  return state.entries
    .map((entry) => {
      let score = 0;
      if (entry.t === needle || entry.s === needle) score = 1200;
      else if (entry.t.startsWith(needle) || entry.s.startsWith(needle)) score = 930;
      else if (entry.t.includes(needle) || entry.s.includes(needle)) score = 760;
      else if ([...needle].every((char) => entry.pure.includes(char))) score = 420;
      return { entry, score: score - entry.l };
    })
    .filter((item) => item.score > 0)
    .sort(sortResults)
    .slice(0, MAX_NON_PATTERN_RESULTS);
}

function searchJyutping(query) {
  const needle = normalizeLatin(query);
  if (!needle) return [];
  const withoutTone = needle.replace(/[1-6]/g, "");
  return state.entries
    .map((entry) => {
      const jyutping = entry.j.toLowerCase();
      const syllables = jyutping.split(" ");
      let score = 0;
      if (jyutping === needle) score = 1150;
      else if (syllables.includes(needle)) score = 1020;
      else if (jyutping.startsWith(needle)) score = 910;
      else if (jyutping.includes(needle)) score = 780;
      else if (entry.jNoTone.includes(withoutTone)) score = 610;
      else if (entry.f === withoutTone) score = 520;
      return { entry, score: score - entry.l };
    })
    .filter((item) => item.score > 0)
    .sort(sortResults)
    .slice(0, MAX_NON_PATTERN_RESULTS);
}

function sortResults(left, right) {
  if (right.score !== left.score) return right.score - left.score;
  if (left.entry.l !== right.entry.l) return left.entry.l - right.entry.l;
  return left.entry.t.localeCompare(right.entry.t, "zh-Hans");
}

function getResults(query, mode) {
  if (!query.trim()) return [];
  if (mode === "pattern") return searchPattern(query);
  if (mode === "rhyme") return searchRhyme(query);
  if (mode === "chinese") return searchChinese(query);
  if (mode === "jyutping") return searchJyutping(query);
  return [];
}

function charAnalysis(query) {
  const chars = cjkOnly(query);
  if (!chars) return "";
  const chips = [];
  const pattern = [];
  for (const char of chars) {
    const readings = state.chars[char] || [];
    if (!readings.length) {
      chips.push(`<span class="chip warn"><strong>${escapeHtml(char)}</strong>未收录</span>`);
      continue;
    }
    const best = readings[0];
    pattern.push(best.p);
    chips.push(
      `<span class="chip"><strong>${escapeHtml(char)}</strong>${escapeHtml(best.j)} · ${escapeHtml(best.p)} · ${escapeHtml(best.f)}</span>`,
    );
  }
  const patternChip = pattern.length
    ? `<span class="chip"><strong>0243</strong>${escapeHtml(pattern.join(""))}</span>`
    : "";
  return `<div class="analysis-line">${patternChip}${chips.join("")}</div>`;
}

function queryAnalysis(query, mode) {
  const trimmed = query.trim();
  if (!trimmed) return "";
  if (mode === "chinese") return charAnalysis(trimmed);
  if (mode === "pattern") {
    const pattern = trimmed.replace(/[^0243]/g, "");
    return `<div class="analysis-line"><span class="chip"><strong>0243</strong>${escapeHtml(pattern)}</span><span class="chip"><strong>字数</strong>${pattern.length}</span></div>`;
  }
  if (mode === "rhyme") {
    const match = trimmed.match(/^([0243]+)(.+)$/);
    if (!match) return "";
    const finals = Array.from(finalsFromSuffix(match[2]));
    return `<div class="analysis-line"><span class="chip"><strong>0243</strong>${escapeHtml(match[1])}</span><span class="chip"><strong>韵</strong>${escapeHtml(finals.join(" / ") || match[2])}</span></div>`;
  }
  if (mode === "jyutping") {
    const syllables = normalizeLatin(trimmed).split(/\s+/).filter(Boolean);
    const chips = syllables.map((syllable) => {
      const final = TONE_RE.test(syllable) ? finalForSyllable(syllable) : syllable.replace(/[1-6]/g, "");
      return `<span class="chip"><strong>${escapeHtml(syllable)}</strong>${escapeHtml(final)}</span>`;
    });
    return `<div class="analysis-line">${chips.join("")}</div>`;
  }
  return "";
}

function renderResult(item) {
  if (item.type === "cloud") return renderCloudTile(item);
  const entry = item.entry;
  const definition = entry.d ? `<p class="definition">${escapeHtml(entry.d)}</p>` : "";
  const sourceLabel = state.metadata?.sourceLabels?.[entry.src] || entry.src || "";
  const displayTerm = entry.display || entry.s || entry.t;
  return `
    <article class="result-card">
      <div>
        <div class="term-row">
          <span class="term">${escapeHtml(displayTerm)}</span>
          <span class="pattern">${escapeHtml(entry.p)}</span>
          <span class="chip">韵 ${escapeHtml(entry.f || "-")}</span>
        </div>
        <p class="jyutping">${escapeHtml(entry.j)}</p>
        ${definition}
        <p class="source">${escapeHtml(sourceLabel)}</p>
      </div>
      <button class="copy-button" type="button" title="复制" data-copy="${escapeHtml(displayTerm)}">⧉</button>
    </article>
  `;
}

function renderCloudTile(item) {
  return `
    <button class="word-tile" type="button" data-copy="${escapeHtml(item.word)}" title="第 ${escapeHtml(item.rank)} 位">
      <span>${escapeHtml(item.word)}</span>
    </button>
  `;
}

function render() {
  if (!state.entries.length) return;
  const mode = detectQuery(state.query);
  const results = getResults(state.query, mode);

  els.analysis.innerHTML = queryAnalysis(state.query, mode);
  els.empty.classList.toggle("hidden", Boolean(state.query.trim()));
  els.resultTitle.textContent = mode === "pattern" ? "词云" : mode === "rhyme" ? "押韵" : "结果";
  els.resultCount.textContent = state.query.trim() ? `${results.length.toLocaleString()} 条` : "";
  els.results.classList.toggle("cloud-results", mode === "pattern");
  els.results.innerHTML = results.map(renderResult).join("");
}

function scheduleRender() {
  window.clearTimeout(state.timer);
  state.timer = window.setTimeout(render, 90);
}

function setMode(mode) {
  state.mode = mode;
  els.segments.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  render();
}

els.input.addEventListener("input", (event) => {
  state.query = event.target.value;
  scheduleRender();
});

els.clear.addEventListener("click", () => {
  state.query = "";
  els.input.value = "";
  els.input.focus();
  render();
});

els.loose.addEventListener("change", (event) => {
  state.loose = event.target.checked;
  render();
});

els.segments.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

els.samples.forEach((button) => {
  button.addEventListener("click", () => {
    state.query = button.dataset.query;
    els.input.value = state.query;
    els.input.focus();
    render();
  });
});

els.results.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy]");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.textContent = "✓";
    window.setTimeout(() => {
      button.textContent = "⧉";
    }, 900);
  } catch {
    button.textContent = "!";
  }
});

loadData().catch((error) => {
  els.entryCount.textContent = "载入失败";
  els.analysis.innerHTML = `<span class="chip warn">${escapeHtml(error.message)}</span>`;
});
