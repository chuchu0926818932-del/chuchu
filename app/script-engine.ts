import { formulas, type Topic } from "./topics";

export type ScriptSegment = {
  time: string;
  voiceover: string;
  visual: string;
  subtitle: string;
};

export type ScriptPlanInput = {
  audience: string;
  cta: string;
  duration: string;
  keyMessage: string;
  opening: string;
  platform: string;
  shots: string;
};

export type TopicGenerationOptions = {
  formula: string;
  category: string;
  situation: string;
  audience: string;
  purpose: string;
};

const categoryGuides: Record<string, { focus: string[]; risk: string; check: string }> = {
  減肥瘦身知識: {
    focus: ["失控時段", "重新開始", "體重焦慮", "補償衝動", "可持續節奏", "睡眠壓力", "外食選擇", "運動門檻", "自我責備", "進度判斷"],
    risk: "中",
    check: "避免保證減重成果、製造身材羞恥或提供個人化醫療處方",
  },
  身心靈相關: {
    focus: ["情緒命名", "自我批評", "社群比較", "休息界線", "身體感受", "失敗焦慮", "睡前停下來", "重新開始", "安慰自己的方式", "求助訊號"],
    risk: "中",
    check: "不替代心理治療；若持續影響生活，應鼓勵尋求專業協助",
  },
  愛美相關: {
    focus: ["氣色選擇", "穿搭舒適", "保養基本版", "新品測試", "妝容失手", "鏡頭自信", "場合搭配", "膚況觀察", "外貌比較", "照顧儀式"],
    risk: "中",
    check: "避免製造新的外貌標準；皮膚症狀需由醫療專業者評估",
  },
  健康相關: {
    focus: ["久坐提醒", "睡眠不足", "疼痛觀察", "活動門檻", "壓力訊號", "補充品查證", "運動恢復", "疲勞分辨", "生活節奏", "就醫時機"],
    risk: "高",
    check: "內容只作一般健康教育，不診斷、不治療；有症狀時應諮詢合格專業者",
  },
  飲食知識相關: {
    focus: ["餐盤搭配", "飢餓線索", "外食備案", "澱粉迷思", "便利商店組合", "聚餐壓力", "份量彈性", "飲料選擇", "標示判讀", "食物好壞標籤"],
    risk: "中",
    check: "營養需求因人而異；特殊疾病、過敏或飲食需求需由專業者評估",
  },
};

const titleFrames = [
  (situation: string, focus: string) => `${situation}時，${focus}先做這一個小調整`,
  (_situation: string, focus: string) => `${focus}卡住時，先問自己這一題`,
  (situation: string, focus: string) => `${situation}也能用的${focus}低門檻版本`,
  (_situation: string, focus: string) => `別急著怪自己：${focus}真正要看的三件事`,
  (situation: string, focus: string) => `${situation}前後，${focus}可以怎麼更有彈性`,
  (_situation: string, focus: string) => `${focus}不是只有一種標準答案`,
  (situation: string, focus: string) => `給${situation}的你：一張${focus}提醒卡`,
  (_situation: string, focus: string) => `我把${focus}縮小成今天做得到的一步`,
  (situation: string, focus: string) => `${situation}最容易忽略的${focus}訊號`,
  (_situation: string, focus: string) => `從「又失敗了」回到${focus}的安全下一步`,
];

const hookFrames = [
  (situation: string, focus: string) => `${situation}一來，${focus}是不是又被你放到最後？`,
  (_situation: string, focus: string) => `如果${focus}只靠更努力，為什麼你已經這麼累了？`,
  (situation: string, focus: string) => `${situation}不用做到滿分，先把${focus}縮小一點。`,
  (_situation: string, focus: string) => `你不是做不到，可能只是把${focus}的門檻設得太高。`,
  (situation: string, focus: string) => { void focus; return `${situation}之前，先別急著用同一套標準要求自己。`; },
  (_situation: string, focus: string) => `${focus}沒有唯一答案，先看完整情境。`,
  (situation: string, focus: string) => { void focus; return `這張提醒卡，是留給每次${situation}就忘了照顧自己的你。`; },
  (_situation: string, focus: string) => `今天不需要全部完成，${focus}先做這一步就好。`,
  (situation: string, focus: string) => { void focus; return `${situation}時身體其實有訊號，只是你太忙沒有看見。`; },
  (_situation: string, focus: string) => `又覺得自己失敗了？先用${focus}把節奏接回來。`,
];

const purposeCtas: Record<string, string> = {
  提高收藏: "先收藏，下一次遇到同樣情境時直接照著做",
  引發留言: "留言告訴我，你最常卡在哪一個時刻",
  建立信任: "如果這個說法讓你鬆一口氣，分享給也需要的人",
  破解迷思: "把這支傳給還在用舊標準責怪自己的人",
  導向免費工具: "留言『工具』，把這張提醒卡留在身邊",
};

function sentence(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /[。！？!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
}

function shortSubtitle(value: string, max = 22) {
  const compact = value.replace(/[，。！？!?；;：:「」『』]/g, "").replace(/\s+/g, "");
  return compact.length > max ? `${compact.slice(0, max)}…` : compact;
}

function timecodes(duration: string) {
  if (duration === "30 秒") return ["0–3 秒", "3–8 秒", "8–15 秒", "15–22 秒", "22–27 秒", "27–30 秒"];
  if (duration === "60–90 秒") return ["0–5 秒", "5–18 秒", "18–38 秒", "38–60 秒", "60–75 秒", "75–90 秒"];
  return ["0–5 秒", "5–15 秒", "15–30 秒", "30–45 秒", "45–55 秒", "55–60 秒"];
}

export function buildScriptSegments(topic: Topic, plan: ScriptPlanInput): ScriptSegment[] {
  const times = timecodes(plan.duration);

  return [
    {
      time: times[0],
      voiceover: sentence(plan.opening || topic.hook),
      visual: "正面近景直接開場；第一句說完前不切鏡，主標同步出現。",
      subtitle: shortSubtitle(plan.opening || topic.hook, 18),
    },
    {
      time: times[1],
      voiceover: `${sentence(topic.scene)}${sentence(topic.empathy)}`,
      visual: `切生活情境 B-roll：${topic.visual}；保留一個真實、不完美的停頓。`,
      subtitle: shortSubtitle(topic.empathy, 18),
    },
    {
      time: times[2],
      voiceover: sentence(plan.keyMessage || topic.explain || topic.angle),
      visual: "回到半身口播；核心觀點用一張大字卡固定在畫面側邊。",
      subtitle: shortSubtitle(plan.keyMessage || topic.angle),
    },
    {
      time: times[3],
      voiceover: sentence(`今天你先這樣做：${topic.action}`),
      visual: `${plan.shots || topic.visual}；依順序切成 2–3 個可跟做的鏡頭。`,
      subtitle: shortSubtitle(topic.action, 18),
    },
    {
      time: times[4],
      voiceover: sentence(topic.reframe),
      visual: "正面近景，語速放慢；右下角顯示「依個人情況調整」與必要的專業提醒。",
      subtitle: shortSubtitle(topic.reframe, 18),
    },
    {
      time: times[5],
      voiceover: sentence(plan.cta || topic.cta),
      visual: "定鏡 2 秒；CTA 單獨放大，不再加入第二個行動要求。",
      subtitle: shortSubtitle(plan.cta || topic.cta, 16),
    },
  ];
}

export function formatShootingScript(topic: Topic, plan: ScriptPlanInput, segments: ScriptSegment[]) {
  const segmentText = segments.map((segment) => `## ${segment.time}\n\n口播：${segment.voiceover}\n\n畫面：${segment.visual}\n\n字幕：${segment.subtitle}`).join("\n\n---\n\n");
  return `# ${topic.title}\n\n- 平台：${plan.platform}\n- 長度：${plan.duration}\n- 公式：${topic.formula}\n- 內容類別：${topic.category}\n- 文案類型：${topic.contentType || "信任型"}\n\n## 靶心人故事線\n\n${topic.storyline || topic.structure}\n\n## 故事七大元素\n\n${topic.storyElements || "請補上時間地點、動作、想法、情緒、對話、轉折、行動。"}\n\n## 三合一文案結構\n\n${topic.threeLayer || "心理學痛點＋銷售學使命感＋故事學轉化與希望。"}\n\n${segmentText}\n\n## 發布前確認\n\n${topic.check}\n`;
}

// Keep uses this clean shooting version: it is meant for review and filming, not for exposing the internal writing framework.
export function formatKeepScript(topic: Topic, plan: ScriptPlanInput, segments: ScriptSegment[]) {
  const voiceover = segments.map((segment) => `【${segment.time}】\n${segment.voiceover}`).join("\n\n");
  const visuals = segments.map((segment) => `【${segment.time}】${segment.visual}`).join("\n");
  const subtitles = segments.map((segment) => `【${segment.time}】${segment.subtitle}`).join("\n");

  return `【28天影片】${topic.title}\n\n平台：${plan.platform}\n長度：${plan.duration}\n主題：${topic.category}\n\n🎙 完整口播\n\n${voiceover}\n\n🎬 拍攝畫面\n\n${visuals}\n\n💬 字幕\n\n${subtitles}\n\n📌 發布前確認\n\n${topic.check}\n`;
}

function normalize(value: string) {
  return value.toLocaleLowerCase("zh-Hant").replace(/[^\p{L}\p{N}]/gu, "");
}

export function generateUniqueTopics(existingTopics: Topic[], options: TopicGenerationOptions, count = 10) {
  const guide = categoryGuides[options.category] ?? categoryGuides.身心靈相關;
  const usedTitles = new Set(existingTopics.map((topic) => normalize(topic.title)));
  const usedHooks = new Set(existingTopics.map((topic) => normalize(topic.hook)));
  const generated: Topic[] = [];
  const maxId = existingTopics.reduce((max, topic) => {
    const numeric = Number(topic.id.replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);
  const customOffset = Math.max(0, existingTopics.length - 80);

  for (let attempt = 0; attempt < 500 && generated.length < count; attempt += 1) {
    const sequence = customOffset + attempt;
    const focus = guide.focus[sequence % guide.focus.length];
    const frameIndex = Math.floor(sequence / guide.focus.length) % titleFrames.length;
    const round = Math.floor(sequence / (guide.focus.length * titleFrames.length));
    const baseTitle = titleFrames[frameIndex](options.situation, focus);
    const title = round > 0 ? `${baseTitle}｜延伸 ${round + 1}` : baseTitle;
    const hook = hookFrames[sequence % hookFrames.length](options.situation, focus);
    if (usedTitles.has(normalize(title)) || usedHooks.has(normalize(hook))) continue;

    const nextNumber = maxId + generated.length + 1;
    generated.push({
      id: `T${String(nextNumber).padStart(3, "0")}`,
      formula: options.formula,
      formulaOrder: Math.max(1, formulas.indexOf(options.formula) + 1),
      formulaIndex: sequence + 1,
      category: options.category,
      title,
      hook,
      angle: `先看見「${options.situation}」裡的真實限制，再用${focus}找一個做得到的下一步。`,
      structure: "情境鉤子 → 同理卡點 → 白話拆解 → 一個可做步驟 → 轉念 → 單一 CTA",
      visual: `${options.situation}生活畫面；先拍真實片段，再用${focus}提醒卡收尾。`,
      cta: purposeCtas[options.purpose] ?? "收藏，下一次遇到同樣情境時再回來看",
      risk: guide.risk,
      check: guide.check,
      series: `續題・${options.formula}`,
      contentType: options.purpose === "導向免費工具" ? "賺錢型" : options.formula === "情緒故事" ? "心情型" : "信任型",
      scene: `${options.situation}時，你發現自己又卡在「${focus}」。`,
      empathy: `不是你做不好，很多${options.audience}都會因為壓力和生活節奏，在這個時刻不知道怎麼選。`,
      explain: `真正要看的不是你夠不夠努力，而是${focus}有沒有一個能出現在真實生活裡的版本。`,
      action: `先把${focus}縮小成一件今天做得到的小事，完成後再決定下一步。`,
      reframe: `你不需要一次改完全部，先讓自己在這個情境裡少一點自責、多一點選擇。`,
      storyline: `目標：在「${options.situation}」裡調整${focus} → 阻礙：${options.audience}容易被壓力與生活節奏卡住 → 努力：先把${focus}縮小成一件今天做得到的小事 → 結果：讓下一步更容易開始 → 意外：不必完美也能持續 → 轉彎：從自責改為看見需要 → 結局：${purposeCtas[options.purpose] ?? "把這個提醒留給下次的自己"}`,
      storyElements: `時間地點：${options.situation}；動作：先停下來完成一個小步驟；想法：「我現在真正需要的是什麼？」；情緒：疲累、焦慮或期待；對話：「我先不用把全部做好。」；轉折：看見壓力背後的需要；行動：完成低門檻版本。`,
      threeLayer: `心理學：理解${options.audience}的卡點；銷售學：提供可直接照做的版本；故事學：從卡住轉向下一步。`,
    });
    usedTitles.add(normalize(title));
    usedHooks.add(normalize(hook));
  }

  return generated;
}
