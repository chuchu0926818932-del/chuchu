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

const categoryLeads: Record<string, string> = {
  減肥瘦身知識: "先別急著把它解讀成意志力不夠，生活節奏、壓力與方法能不能持續，都值得一起看。",
  身心靈相關: "你不需要立刻變得正向，先誠實看見現在的感受，就已經是在照顧自己。",
  愛美相關: "這不是要修正或遮住自己，而是多一個更舒服、也更適合今天的選擇。",
  健康相關: "先把這當成日常觀察，不是診斷，也不需要勉強身體完成不適合的動作。",
  飲食知識相關: "食物沒有只靠一個名稱就能判斷好壞，還要放回份量、搭配與個人情況。",
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
  (situation: string, focus: string) => `${situation}之前，先別急著用同一套標準要求自己。`,
  (_situation: string, focus: string) => `${focus}沒有唯一答案，先看完整情境。`,
  (situation: string, focus: string) => `這張提醒卡，是留給每次${situation}就忘了照顧自己的你。`,
  (_situation: string, focus: string) => `今天不需要全部完成，${focus}先做這一步就好。`,
  (situation: string, focus: string) => `${situation}時身體其實有訊號，只是你太忙沒有看見。`,
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
  const categoryLead = categoryLeads[topic.category] ?? "先把問題放回完整情境，再找一個今天做得到的下一步。";
  const audience = plan.audience.trim() || "正在重新開始的人";

  return [
    {
      time: times[0],
      voiceover: sentence(plan.opening || topic.hook),
      visual: "正面近景直接開場；第一句說完前不切鏡，主標同步出現。",
      subtitle: shortSubtitle(plan.opening || topic.hook, 18),
    },
    {
      time: times[1],
      voiceover: sentence(`如果你也是${audience}，遇到「${topic.title}」時，先不要急著把問題全部怪在自己身上`),
      visual: `切生活情境 B-roll：${topic.visual}；保留一個真實、不完美的停頓。`,
      subtitle: "先別急著責怪自己",
    },
    {
      time: times[2],
      voiceover: `${sentence(categoryLead)}${sentence(plan.keyMessage || topic.angle)}`,
      visual: "回到半身口播；核心觀點用一張大字卡固定在畫面側邊。",
      subtitle: shortSubtitle(plan.keyMessage || topic.angle),
    },
    {
      time: times[3],
      voiceover: sentence(`今天先做一個小版本。${topic.structure.replace(/\d+[–-]\d+秒：/g, "").replace(/｜/g, "；")}`),
      visual: `${plan.shots || topic.visual}；依順序切成 2–3 個可跟做的鏡頭。`,
      subtitle: "今天只做一個小版本",
    },
    {
      time: times[4],
      voiceover: sentence(`這不是要用一支影片解決所有狀況。發布前請記得：${topic.check}`),
      visual: "正面近景，語速放慢；右下角顯示「依個人情況調整」與必要的專業提醒。",
      subtitle: "先看個人情況與安全提醒",
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
  return `# ${topic.title}\n\n- 平台：${plan.platform}\n- 長度：${plan.duration}\n- 公式：${topic.formula}\n- 內容類別：${topic.category}\n\n${segmentText}\n\n## 發布前確認\n\n${topic.check}\n`;
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
      angle: `針對「${options.audience}」在「${options.situation}」的真實限制，從${focus}提供一個能完成、能調整的下一步。`,
      structure: "0–5秒：情境鉤子｜5–15秒：承接真實卡點｜15–40秒：示範一個小步驟｜40–55秒：補上安全條件｜55–60秒：單一 CTA",
      visual: `${options.situation}生活畫面＋${focus}三格提醒卡＋正面口播收尾`,
      cta: purposeCtas[options.purpose] ?? "收藏，下一次遇到同樣情境時再回來看",
      risk: guide.risk,
      check: guide.check,
      series: `續題・${options.formula}`,
    });
    usedTitles.add(normalize(title));
    usedHooks.add(normalize(hook));
  }

  return generated;
}
