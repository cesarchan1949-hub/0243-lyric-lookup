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
const THEME_STORAGE_KEY = "0243-theme";
const CLOUD_POS_CATEGORIES = [
  { id: "all", label: "全部" },
  { id: "person", label: "人物关系" },
  { id: "verb", label: "动作状态" },
  { id: "adj", label: "形容评价" },
  { id: "time", label: "时间数量" },
  { id: "place", label: "地点场景" },
  { id: "noun", label: "名物概念" },
  { id: "function", label: "连接虚词" },
];
const CLOUD_EMOTION_CATEGORIES = [
  { id: "all", label: "全部" },
  { id: "positive", label: "美好开心" },
  { id: "sad", label: "伤感痛苦" },
  { id: "love", label: "情爱亲密" },
  { id: "memory", label: "怀念回忆" },
  { id: "conflict", label: "冲突决绝" },
  { id: "anxious", label: "焦虑疑问" },
  { id: "hope", label: "希望理想" },
  { id: "calm", label: "安心放松" },
];
const CLOUD_KEYWORDS = {
  person: ["你", "我", "他", "她", "人", "女人", "男人", "女子", "女生", "先生", "老师", "母亲", "父亲", "妈妈", "老母", "老公", "太太", "朋友", "对方", "自己", "大家", "孩子", "女的"],
  verb: ["记得", "觉得", "看到", "见到", "发生", "变得", "接触", "结束", "说出", "说起", "唱歌", "带走", "放手", "放开", "发出", "发声", "发展", "了解", "理解", "开始", "退出", "进出", "引起", "送给", "拍手", "看清", "看穿", "看出", "转身", "转头", "倒数"],
  adj: ["好", "美", "最佳", "最高", "痛苦", "放心", "勇敢", "彻底", "敏感", "冷清", "细心", "永久", "迅速", "正式", "正经", "理想", "满足", "太短", "太好", "太早", "太少", "太高", "最深", "最早", "最终"],
  time: ["每", "天", "年", "月", "日", "世纪", "时候", "时间", "每天", "那天", "今天", "明天", "昨天", "现在", "过去", "未来", "最初", "最终", "永久", "永不", "瞬间", "半生", "一生", "晚", "早"],
  place: ["香港", "亚洲", "澳洲", "国家", "社会", "政府", "家", "街", "上班", "上山", "上街", "店", "房", "海", "山", "路", "世界", "世间", "教堂", "教室", "法院"],
  noun: ["结果", "咖啡", "汽车", "眼睛", "记忆", "意思", "意识", "唱片", "照片", "作品", "借口", "信心", "背包", "眼光", "眼中", "声音", "讯息", "气氛", "眼镜", "戒指", "脑海", "脑袋", "母亲", "角色", "战争", "政府"],
  function: ["已经", "中的", "到底", "那么", "那些", "这些", "这么", "每一", "有多", "有些", "有的", "有点", "也许", "更多", "至少", "究竟", "对于", "要不", "再不", "再三", "那些", "哪", "各", "某", "由得"],
  positive: ["美好", "美的", "最好", "最佳", "更好", "开心", "快乐", "笑", "庆祝", "满足", "信心", "有心", "勇敢", "喜欢", "理想", "放心", "有福", "祝", "成功"],
  sad: ["痛苦", "痛哭", "痛心", "哭", "泪", "伤", "缺", "失", "孤", "冷清", "叹息", "退缩", "压抑", "废话", "背影", "晚餐", "破", "困苦"],
  love: ["爱", "情", "亲", "母亲", "太太", "女人", "女子", "女生", "约会", "结婚", "对方", "有心", "老公", "朋友", "暗恋", "相亲"],
  memory: ["记得", "记忆", "记起", "回忆", "已经", "曾经", "过去", "最初", "最终", "从前", "当年", "世纪", "半生", "脑海"],
  conflict: ["战争", "决不", "永不", "放手", "对手", "抗争", "禁止", "压迫", "杀", "退出", "戒指", "说谎", "破", "废", "死"],
  anxious: ["究竟", "到底", "也许", "至少", "担心", "怕", "害怕", "困扰", "压抑", "压迫", "紧", "妄想", "暗恋", "敏感"],
  hope: ["希望", "理想", "未来", "梦", "信心", "勇敢", "光", "最高", "最佳", "更好", "了解", "发展", "有机"],
  calm: ["放心", "放松", "安心", "安全", "温柔", "细心", "平静", "轻松", "淡", "自在"],
};
const CLOUD_ROOT_KEYWORDS = {
  person: ["你", "我", "他", "她", "人", "女", "男", "师", "母", "父", "友", "子"],
  verb: ["做", "见", "看", "听", "讲", "说", "唱", "写", "走", "来", "去", "转", "记", "想", "知", "明", "放", "发", "变", "问", "答", "承"],
  adj: ["好", "美", "高", "低", "深", "浅", "真", "假", "正", "快", "慢", "痛", "苦", "甜", "冷", "热", "细", "敏", "勇"],
  time: ["时", "日", "天", "年", "月", "代", "晚", "早", "昨", "今", "明", "曾", "旧", "初", "终", "永", "瞬"],
  place: ["港", "国", "城", "街", "家", "店", "房", "海", "山", "路", "台", "世", "界", "校", "堂", "室", "洲"],
  noun: ["心", "梦", "光", "声", "色", "影", "眼", "手", "口", "脑", "名", "字", "物", "事", "书", "片", "歌", "车"],
  function: ["的", "了", "着", "都", "又", "也", "还", "却", "但", "而", "或", "若", "便", "就", "再", "从", "由", "对", "与"],
  positive: ["好", "美", "喜", "乐", "欢", "笑", "甜", "福", "幸", "满", "勇", "信", "光", "成", "祝", "佳"],
  sad: ["痛", "苦", "哭", "泪", "伤", "失", "孤", "冷", "叹", "憾", "遗", "恨", "奈", "惜", "别", "离", "忘", "缺", "酸"],
  love: ["爱", "情", "亲", "恋", "吻", "抱", "婚", "陪", "念", "心", "友", "女", "男"],
  memory: ["记", "忆", "怀", "念", "旧", "昔", "昨", "曾", "从", "过", "留", "初", "后"],
  conflict: ["战", "争", "决", "绝", "放", "弃", "退", "杀", "破", "断", "敌", "怒", "冲", "压", "离", "别", "恨"],
  anxious: ["怕", "担", "忧", "虑", "疑", "问", "困", "扰", "压", "紧", "急", "迷", "乱", "难", "奈", "究", "竟"],
  hope: ["希", "望", "理", "想", "未", "梦", "信", "勇", "光", "机", "愿", "期", "明", "成"],
  calm: ["安", "心", "放", "松", "静", "柔", "淡", "睡", "稳", "休", "缓", "闲"],
};
const SEMANTIC_TO_EMOTION = {
  regret: "sad",
  happy: "positive",
  sad: "sad",
  love: "love",
  memory: "memory",
  hope: "hope",
  conflict: "conflict",
  anxious: "anxious",
  calm: "calm",
};
const SEMANTIC_GROUPS = [
  {
    id: "regret",
    label: "可惜遗憾",
    roots: ["遗", "憾", "惜", "叹", "奈", "恨", "酸", "失"],
    terms: [
      "可惜",
      "遗憾",
      "无憾",
      "遗恨",
      "遗愿",
      "惋惜",
      "叹惋",
      "叹惜",
      "痛惜",
      "抱歉",
      "失望",
      "无奈",
      "可叹",
      "不舍",
      "心酸",
    ],
  },
  {
    id: "happy",
    label: "开心美好",
    roots: ["开", "心", "乐", "欢", "喜", "笑", "美", "好", "甜", "福", "满"],
    terms: ["开心", "快乐", "高兴", "欢喜", "美好", "最好", "最佳", "满足", "幸福", "甜蜜", "庆祝", "笑话", "笑声", "放心"],
  },
  {
    id: "sad",
    label: "伤感痛苦",
    roots: ["伤", "痛", "苦", "哭", "泪", "失", "孤", "冷", "碎", "酸", "叹", "别", "离"],
    terms: ["伤感", "难过", "痛苦", "痛心", "痛哭", "眼泪", "哭泣", "失落", "孤独", "冷清", "心碎", "苦楚", "叹息"],
  },
  {
    id: "love",
    label: "情爱亲密",
    roots: ["爱", "情", "恋", "念", "亲", "抱", "吻", "婚", "陪", "心"],
    terms: ["爱情", "喜欢", "想念", "怀念", "思念", "亲密", "约会", "结婚", "拥抱", "亲吻", "心动", "情人", "对方", "陪伴"],
  },
  {
    id: "memory",
    label: "回忆过去",
    roots: ["记", "忆", "怀", "念", "旧", "昔", "曾", "过", "留", "初", "后"],
    terms: ["回忆", "记忆", "记得", "记起", "怀旧", "过去", "从前", "当年", "昨日", "曾经", "最初", "后来", "留下"],
  },
  {
    id: "hope",
    label: "希望理想",
    roots: ["希", "望", "理", "想", "未", "梦", "信", "勇", "光", "愿", "期", "明"],
    terms: ["希望", "理想", "未来", "明天", "信心", "勇敢", "机会", "发展", "光明", "愿望", "期待", "梦想", "成功"],
  },
  {
    id: "conflict",
    label: "冲突决绝",
    roots: ["放", "弃", "舍", "离", "别", "断", "退", "罢", "忘", "让", "散", "决", "绝", "怒", "恨"],
    terms: ["愤怒", "生气", "冲突", "争执", "背叛", "放手", "放弃", "不舍", "离别", "分别", "决绝", "退出", "战争", "反抗", "破裂", "绝望", "伤害"],
  },
  {
    id: "anxious",
    label: "焦虑疑问",
    roots: ["怕", "担", "忧", "虑", "疑", "问", "困", "扰", "压", "紧", "急", "迷", "乱", "难"],
    terms: ["担心", "害怕", "焦虑", "疑问", "困扰", "压抑", "紧张", "究竟", "到底", "也许", "难道", "迷惘", "不安"],
  },
  {
    id: "calm",
    label: "安心放松",
    roots: ["安", "心", "放", "松", "静", "柔", "淡", "睡", "稳", "休", "缓", "闲"],
    terms: ["安心", "放心", "放松", "平静", "温柔", "舒服", "自在", "安全", "休息", "睡觉", "安稳", "淡然", "从容"],
  },
];
const cloudClassCache = new Map();

const state = {
  entries: [],
  chars: {},
  metadata: null,
  officialCloud: {},
  patternIndex: new Map(),
  cloudSearch: "",
  cloudFacet: "all",
  cloudCategory: "all",
  theme: "light",
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
  themeToggle: document.querySelector("#themeToggle"),
  resultTitle: document.querySelector("#resultTitle"),
  resultCount: document.querySelector("#resultCount"),
  analysis: document.querySelector("#analysisPanel"),
  cloudTools: document.querySelector("#cloudTools"),
  cloudSearch: document.querySelector("#cloudSearchInput"),
  clearCloudSearch: document.querySelector("#clearCloudSearchButton"),
  cloudFacetButtons: Array.from(document.querySelectorAll("[data-cloud-facet]")),
  cloudCategoryBar: document.querySelector("#cloudCategoryBar"),
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

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function categoryMatchesWord(word, category) {
  return includesAny(word, CLOUD_KEYWORDS[category] || []) || includesAny(word, CLOUD_ROOT_KEYWORDS[category] || []);
}

function pushUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

function cloudItemText(item) {
  return `${item.word || ""} ${item.original || ""} ${item.pattern || ""} ${item.final || ""} ${item.jyutping || ""}`.toLowerCase();
}

function semanticBundleForSearch(value) {
  const raw = value.trim().toLowerCase();
  if (!raw) return { raw: "", terms: [], roots: [], labels: [] };
  const cjk = cjkOnly(raw);
  const terms = new Set([raw]);
  const roots = new Set();
  const labels = new Set();

  if (cjk) terms.add(cjk);
  for (const group of SEMANTIC_GROUPS) {
    const hit = group.terms.some((term) => {
      const normalized = term.toLowerCase();
      return raw.includes(normalized) || normalized.includes(raw) || (cjk && (cjk.includes(term) || term.includes(cjk)));
    }) || (cjk.length === 1 && group.roots.includes(cjk));
    if (!hit) continue;
    labels.add(group.label);
    group.terms.forEach((term) => terms.add(term.toLowerCase()));
    group.roots.forEach((root) => roots.add(root.toLowerCase()));
  }

  return {
    raw,
    terms: Array.from(terms).filter((term) => term.length > 1),
    roots: Array.from(roots).filter(Boolean),
    labels: Array.from(labels),
  };
}

function cloudSearchScore(item, bundle) {
  const fullText = cloudItemText(item);
  const word = `${item.word || ""} ${item.original || ""}`.toLowerCase();
  let score = fullText.includes(bundle.raw) ? 600 : 0;
  for (const term of bundle.terms) {
    if (term !== bundle.raw && fullText.includes(term)) score += 260;
  }
  if (bundle.labels.length) {
    for (const root of bundle.roots) {
      if (word.includes(root)) score += 48;
    }
  }
  return score;
}

function cloudSearchHint(mode) {
  const bundle = semanticBundleForSearch(state.cloudSearch);
  if (!bundle.raw) {
    return mode === "rhyme"
      ? "按0243与韵母匹配排序，可用搜索或近义意图缩小范围"
      : "按官方词频排序，可用搜索或近义意图缩小范围";
  }
  if (!bundle.labels.length) return "正在按字面搜索当前词云";
  const preview = bundle.terms.filter((term) => term !== bundle.raw).slice(0, 7);
  const roots = bundle.roots.slice(0, 8).join("、");
  return `近义扩展：${bundle.labels.join("、")} · ${preview.join("、")}${roots ? ` · 字根 ${roots}` : ""}`;
}

function classifyCloudWord(word) {
  if (cloudClassCache.has(word)) return cloudClassCache.get(word);
  const pos = [];
  const emotion = [];

  for (const category of ["function", "person", "time", "place", "verb", "adj", "noun"]) {
    if (categoryMatchesWord(word, category)) pushUnique(pos, category);
  }
  if (!pos.length) pos.push("noun");

  for (const category of ["positive", "sad", "love", "memory", "conflict", "anxious", "hope", "calm"]) {
    if (categoryMatchesWord(word, category)) pushUnique(emotion, category);
  }
  for (const group of SEMANTIC_GROUPS) {
    const category = SEMANTIC_TO_EMOTION[group.id];
    if (!category) continue;
    if (includesAny(word, group.terms) || includesAny(word, group.roots)) pushUnique(emotion, category);
  }
  if (!emotion.length) emotion.push("neutral");

  const result = { pos, emotion };
  cloudClassCache.set(word, result);
  return result;
}

function cloudCategoriesFor(item, facet) {
  if (facet === "pos" || facet === "emotion") {
    return classifyCloudWord(item.word || "")[facet] || [];
  }
  return ["all"];
}

function cloudCategoryDefs() {
  if (state.cloudFacet === "pos") return CLOUD_POS_CATEGORIES;
  if (state.cloudFacet === "emotion") return CLOUD_EMOTION_CATEGORIES;
  return [{ id: "all", label: "全部" }];
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

function applyTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.style.colorScheme = state.theme;
  if (!els.themeToggle) return;
  els.themeToggle.textContent = state.theme === "dark" ? "☀" : "☾";
  els.themeToggle.title = state.theme === "dark" ? "切换浅色模式" : "切换深色模式";
  els.themeToggle.setAttribute("aria-label", els.themeToggle.title);
}

function initTheme() {
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(saved === "dark" ? "dark" : "light");
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

function cloudResultFromEntry(entry, rank, score) {
  return {
    type: "cloud",
    entry,
    word: entry.display || entry.s || entry.t,
    original: entry.t,
    rank,
    pattern: entry.p,
    final: entry.f,
    jyutping: entry.j,
    score,
  };
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
    .sort(sortResults)
    .map((item, index) => cloudResultFromEntry(item.entry, index + 1, item.score));
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

function isCloudMode(mode) {
  return mode === "pattern" || mode === "rhyme";
}

function filterCloudBySearch(results) {
  const bundle = semanticBundleForSearch(state.cloudSearch);
  if (!bundle.raw) return results;
  return results
    .map((item) => ({ ...item, semanticScore: cloudSearchScore(item, bundle) }))
    .filter((item) => item.semanticScore > 0)
    .sort((left, right) => {
      if (right.semanticScore !== left.semanticScore) return right.semanticScore - left.semanticScore;
      return left.rank - right.rank;
    });
}

function applyCloudFilters(results) {
  const searched = filterCloudBySearch(results);
  if (state.cloudFacet === "all" || state.cloudCategory === "all") return searched;
  const hasCategory = searched.some((item) => cloudCategoriesFor(item, state.cloudFacet).includes(state.cloudCategory));
  if (!hasCategory) {
    state.cloudCategory = "all";
    return searched;
  }
  return searched.filter((item) => cloudCategoriesFor(item, state.cloudFacet).includes(state.cloudCategory));
}

function categoryCounts(results) {
  const counts = new Map([["all", results.length]]);
  if (state.cloudFacet === "all") return counts;
  for (const item of results) {
    for (const category of cloudCategoriesFor(item, state.cloudFacet)) {
      counts.set(category, (counts.get(category) || 0) + 1);
    }
  }
  return counts;
}

function renderCloudTools(mode, rawResults) {
  const shouldShow = isCloudMode(mode) && Boolean(state.query.trim()) && rawResults.some((item) => item.type === "cloud");
  els.cloudTools.classList.toggle("hidden", !shouldShow);
  if (!shouldShow) return;

  if (els.cloudSearch.value !== state.cloudSearch) {
    els.cloudSearch.value = state.cloudSearch;
  }
  els.cloudFacetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.cloudFacet === state.cloudFacet);
  });

  const searchedResults = filterCloudBySearch(rawResults);
  const counts = categoryCounts(searchedResults);
  const categories = cloudCategoryDefs();
  const hint = `<span class="category-hint">${escapeHtml(cloudSearchHint(mode))}</span>`;
  if (!categories.some((category) => category.id === state.cloudCategory) || (state.cloudCategory !== "all" && !counts.get(state.cloudCategory))) {
    state.cloudCategory = "all";
  }
  const visibleCategories = categories.filter((category) => category.id === "all" || (counts.get(category.id) || 0) > 0);

  if (state.cloudFacet === "all") {
    els.cloudCategoryBar.innerHTML = hint;
    return;
  }

  els.cloudCategoryBar.innerHTML =
    visibleCategories
      .map((category) => {
        const count = counts.get(category.id) || 0;
        const active = category.id === state.cloudCategory ? " active" : "";
        return `<button class="category-chip${active}" type="button" data-cloud-category="${escapeHtml(category.id)}">${escapeHtml(category.label)} <span>${count.toLocaleString()}</span></button>`;
      })
      .join("") + hint;
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
  const classes = classifyCloudWord(item.word || "");
  const rhyme = item.final ? ` · 韵 ${item.final}` : "";
  const jyutping = item.jyutping ? ` · ${item.jyutping}` : "";
  const title = `第 ${item.rank} 位 · ${item.pattern || ""}${rhyme}${jyutping} · ${classes.pos.join("/")} · ${classes.emotion.join("/")}`;
  return `
    <button class="word-tile" type="button" data-copy="${escapeHtml(item.word)}" title="${escapeHtml(title)}">
      <span>${escapeHtml(item.word)}</span>
    </button>
  `;
}

function render() {
  if (!state.entries.length) return;
  const mode = detectQuery(state.query);
  const rawResults = getResults(state.query, mode);
  const cloudMode = isCloudMode(mode);
  const results = cloudMode ? applyCloudFilters(rawResults) : rawResults;

  els.analysis.innerHTML = queryAnalysis(state.query, mode);
  renderCloudTools(mode, rawResults);
  els.empty.classList.toggle("hidden", Boolean(state.query.trim()));
  els.resultTitle.textContent = mode === "pattern" ? "词云" : mode === "rhyme" ? "押韵词云" : "结果";
  els.resultCount.textContent =
    state.query.trim() && cloudMode && results.length !== rawResults.length
      ? `${results.length.toLocaleString()} / ${rawResults.length.toLocaleString()} 条`
      : state.query.trim()
        ? `${results.length.toLocaleString()} 条`
        : "";
  els.results.classList.toggle("cloud-results", cloudMode);
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

els.themeToggle?.addEventListener("click", () => {
  const nextTheme = state.theme === "dark" ? "light" : "dark";
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
});

els.loose.addEventListener("change", (event) => {
  state.loose = event.target.checked;
  render();
});

els.cloudSearch.addEventListener("input", (event) => {
  state.cloudSearch = event.target.value;
  scheduleRender();
});

els.clearCloudSearch.addEventListener("click", () => {
  state.cloudSearch = "";
  els.cloudSearch.value = "";
  els.cloudSearch.focus();
  render();
});

els.cloudFacetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.cloudFacet = button.dataset.cloudFacet;
    state.cloudCategory = "all";
    render();
  });
});

els.cloudCategoryBar.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cloud-category]");
  if (!button) return;
  state.cloudCategory = button.dataset.cloudCategory;
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
    if (button.classList.contains("word-tile")) {
      button.classList.add("copied");
      window.setTimeout(() => button.classList.remove("copied"), 900);
    } else {
      button.textContent = "✓";
      window.setTimeout(() => {
        button.textContent = "⧉";
      }, 900);
    }
  } catch {
    button.textContent = "!";
  }
});

initTheme();
loadData().catch((error) => {
  els.entryCount.textContent = "载入失败";
  els.analysis.innerHTML = `<span class="chip warn">${escapeHtml(error.message)}</span>`;
});
