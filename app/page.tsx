"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { categories, formulas, Topic, topics } from "./topics";

type View = "library" | "planner" | "generator" | "board";
type PlanStatus = "待規劃" | "撰稿中" | "待拍攝" | "後製中" | "已完成";

type SavedPlan = {
  topicId: string;
  status: PlanStatus;
  platform: string;
  duration: string;
  audience: string;
  objective: string;
  opening: string;
  keyMessage: string;
  shots: string;
  cta: string;
  publishDate: string;
  notes: string;
  updatedAt: string;
};

type WorkspaceData = {
  favorites: string[];
  plans: Record<string, SavedPlan>;
  activeTopicId: string;
};

const STORAGE_KEY = "snl-short-video-studio-v1";
const statuses: PlanStatus[] = ["待規劃", "撰稿中", "待拍攝", "後製中", "已完成"];
const situations = ["下班很累", "週末聚餐", "半夜想吃東西", "照鏡子很焦慮", "社群比較後低落", "久坐上班", "早上趕時間", "旅行或出差", "生理期前後", "重新開始的第一週"];
const audiences = ["剛開始改變", "知道方法但做不到", "反覆減肥很疲累", "害怕失敗", "容易自責", "想穩定照顧自己"];
const purposes = ["提高收藏", "引發留言", "建立信任", "破解迷思", "導向免費工具"];

const categoryColors: Record<string, string> = {
  減肥瘦身知識: "mint",
  身心靈相關: "lavender",
  愛美相關: "rose",
  健康相關: "sky",
  飲食知識相關: "amber",
};

function defaultPlan(topic: Topic): SavedPlan {
  return {
    topicId: topic.id,
    status: "待規劃",
    platform: "Instagram Reels",
    duration: "45–60 秒",
    audience: "反覆努力、容易自責，想用溫和方式重新開始的人",
    objective: "建立信任與提高收藏",
    opening: topic.hook,
    keyMessage: topic.angle,
    shots: topic.visual,
    cta: topic.cta,
    publishDate: "",
    notes: `建議結構：${topic.structure}\n發布前確認：${topic.check}`,
    updatedAt: new Date().toISOString(),
  };
}

function buildCodexPrompt(topic: Topic, plan: SavedPlan) {
  return `請依照以下企劃，為 SNL 製作一支可直接拍攝的短影音內容。\n\n【主題】${topic.title}\n【公式】${topic.formula}\n【內容類別】${topic.category}\n【平台】${plan.platform}\n【長度】${plan.duration}\n【目標受眾】${plan.audience}\n【內容目的】${plan.objective}\n【前 3 秒鉤子】${plan.opening}\n【唯一核心觀點】${plan.keyMessage}\n【畫面與鏡頭】${plan.shots}\n【CTA】${plan.cta}\n【補充備註】${plan.notes || "無"}\n【健康／真實性風險】${topic.risk}；${topic.check}\n\n請輸出：\n1. 45–60 秒口語腳本，逐句分段。\n2. 每一段對應的畫面與字幕重點。\n3. 封面文字 3 個版本。\n4. 貼文說明與單一 CTA。\n5. 發布前需要人工確認的健康宣稱、個資或素材授權。\n\n語氣請溫柔、誠實、清楚、專業，不訓話、不責備、不製造身材羞恥；不捏造學員、數字、對話、成果或健康宣稱。每支影片只保留一個主軸。`;
}

function downloadText(filename: string, text: string, type = "text/markdown;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [view, setView] = useState<View>("library");
  const [query, setQuery] = useState("");
  const [formulaFilter, setFormulaFilter] = useState("全部公式");
  const [categoryFilter, setCategoryFilter] = useState("全部主題");
  const [riskFilter, setRiskFilter] = useState("全部風險");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [plans, setPlans] = useState<Record<string, SavedPlan>>({});
  const [activeTopicId, setActiveTopicId] = useState(topics[0].id);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("");

  const [generatorFormula, setGeneratorFormula] = useState(formulas[0]);
  const [generatorCategory, setGeneratorCategory] = useState(categories[0]);
  const [generatorSituation, setGeneratorSituation] = useState(situations[0]);
  const [generatorAudience, setGeneratorAudience] = useState(audiences[1]);
  const [generatorPurpose, setGeneratorPurpose] = useState(purposes[0]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<WorkspaceData>;
          if (Array.isArray(saved.favorites)) setFavorites(saved.favorites);
          if (saved.plans && typeof saved.plans === "object") setPlans(saved.plans);
          if (saved.activeTopicId && topics.some((topic) => topic.id === saved.activeTopicId)) {
            setActiveTopicId(saved.activeTopicId);
          }
        }
      } catch {
        setToast("舊資料讀取失敗，已使用空白工作區");
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const data: WorkspaceData = { favorites, plans, activeTopicId };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [favorites, plans, activeTopicId, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? topics[0];
  const activePlan = plans[activeTopic.id] ?? defaultPlan(activeTopic);

  const filteredTopics = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-Hant");
    return topics.filter((topic) => {
      const matchesQuery = !needle || [topic.title, topic.hook, topic.angle, topic.series]
        .join(" ")
        .toLocaleLowerCase("zh-Hant")
        .includes(needle);
      return matchesQuery
        && (formulaFilter === "全部公式" || topic.formula === formulaFilter)
        && (categoryFilter === "全部主題" || topic.category === categoryFilter)
        && (riskFilter === "全部風險" || topic.risk === riskFilter)
        && (!onlyFavorites || favorites.includes(topic.id));
    });
  }, [query, formulaFilter, categoryFilter, riskFilter, onlyFavorites, favorites]);

  const plannedTopics = useMemo(() => Object.values(plans)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [plans]);

  const generatorPrompt = `請用「${generatorFormula}」短影音公式，針對「${generatorCategory}」，鎖定「${generatorAudience}」的受眾，在「${generatorSituation}」情境，以「${generatorPurpose}」為內容目的，產出 10 條不重複短影音主題。每條提供：主題名稱、前 3 秒鉤子、單一核心觀點、45–60 秒結構、畫面建議、低壓力 CTA。語氣溫柔、誠實、清楚，不責備、不製造身材羞恥，不捏造案例，不保證減重或療效；健康與飲食宣稱需列出發布前查證項目。`;

  function flash(message: string) {
    setToast(message);
  }

  async function copyText(text: string, message: string) {
    await navigator.clipboard.writeText(text);
    flash(message);
  }

  function toggleFavorite(topicId: string) {
    setFavorites((current) => current.includes(topicId)
      ? current.filter((id) => id !== topicId)
      : [...current, topicId]);
  }

  function openPlanner(topic: Topic) {
    setActiveTopicId(topic.id);
    setPlans((current) => current[topic.id]
      ? current
      : { ...current, [topic.id]: defaultPlan(topic) });
    setView("planner");
  }

  function updatePlan<K extends keyof SavedPlan>(key: K, value: SavedPlan[K]) {
    setPlans((current) => ({
      ...current,
      [activeTopic.id]: {
        ...(current[activeTopic.id] ?? defaultPlan(activeTopic)),
        [key]: value,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function exportWorkspace() {
    const data: WorkspaceData = { favorites, plans, activeTopicId };
    downloadText(`SNL短影音企劃備份_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), "application/json;charset=utf-8");
    flash("工作區備份已匯出");
  }

  function importWorkspace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as WorkspaceData;
        setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
        setPlans(data.plans ?? {});
        if (data.activeTopicId) setActiveTopicId(data.activeTopicId);
        flash("備份已匯入");
      } catch {
        flash("這個備份檔無法讀取");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function downloadPlan() {
    const prompt = buildCodexPrompt(activeTopic, activePlan);
    const text = `# ${activeTopic.title}\n\n- 公式：${activeTopic.formula}\n- 主題：${activeTopic.category}\n- 狀態：${activePlan.status}\n- 預計發布：${activePlan.publishDate || "未設定"}\n\n## 交給 Codex 的製作指令\n\n${prompt}\n`;
    downloadText(`${activeTopic.id}_${activeTopic.title.replace(/[\\/:*?"<>|]/g, "-")}.md`, text);
    flash("企劃檔已下載");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">SNL CONTENT STUDIO</p>
            <h1>短影音企劃工作台</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="local-badge"><span className="status-dot" />資料只存在這台電腦</span>
          <button className="button ghost small" onClick={exportWorkspace}>匯出備份</button>
          <label className="button ghost small file-label">
            匯入備份
            <input type="file" accept="application/json" onChange={importWorkspace} />
          </label>
        </div>
      </header>

      <section className="hero-strip">
        <div>
          <p className="eyebrow dark">從靈感到可以開拍</p>
          <h2>把散落的想法，變成一支有方向的短影音。</h2>
          <p>挑題目、補企劃、複製給 Codex，接著就能寫腳本與安排拍攝。</p>
        </div>
        <div className="hero-stats" aria-label="工作區統計">
          <div><strong>80</strong><span>原創題目</span></div>
          <div><strong>{favorites.length}</strong><span>已收藏</span></div>
          <div><strong>{plannedTopics.length}</strong><span>企劃進行中</span></div>
          <div><strong>{plannedTopics.filter((plan) => plan.status === "已完成").length}</strong><span>已完成</span></div>
        </div>
      </section>

      <nav className="view-tabs" aria-label="主要功能">
        <button className={view === "library" ? "active" : ""} onClick={() => setView("library")}><span>01</span>靈感題庫</button>
        <button className={view === "planner" ? "active" : ""} onClick={() => setView("planner")}><span>02</span>企劃工作區</button>
        <button className={view === "generator" ? "active" : ""} onClick={() => setView("generator")}><span>03</span>主題生成器</button>
        <button className={view === "board" ? "active" : ""} onClick={() => setView("board")}><span>04</span>製作看板</button>
      </nav>

      {view === "library" && (
        <section className="page-section library-view">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">IDEA LIBRARY</p>
              <h2>今天想做哪一種內容？</h2>
            </div>
            <p className="result-count">找到 <strong>{filteredTopics.length}</strong> 條題目</p>
          </div>

          <div className="filter-panel">
            <label className="search-field">
              <span>搜尋</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="輸入情境、問題或關鍵字…" />
            </label>
            <label>
              <span>爆款公式</span>
              <select value={formulaFilter} onChange={(event) => setFormulaFilter(event.target.value)}>
                <option>全部公式</option>
                {formulas.map((formula) => <option key={formula}>{formula}</option>)}
              </select>
            </label>
            <label>
              <span>內容主題</span>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option>全部主題</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              <span>風險</span>
              <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
                <option>全部風險</option>
                <option>低</option><option>中</option><option>高</option>
              </select>
            </label>
            <button className={`favorite-filter ${onlyFavorites ? "active" : ""}`} onClick={() => setOnlyFavorites((value) => !value)}>
              {onlyFavorites ? "★" : "☆"} 只看收藏
            </button>
          </div>

          <div className="topic-grid">
            {filteredTopics.map((topic) => (
              <article className="topic-card" key={topic.id}>
                <div className="card-topline">
                  <div className="badge-row">
                    <span className={`category-badge ${categoryColors[topic.category]}`}>{topic.category}</span>
                    <span className={`risk-badge risk-${topic.risk}`}>風險 {topic.risk}</span>
                  </div>
                  <button className="icon-button" aria-label={favorites.includes(topic.id) ? "取消收藏" : "收藏題目"} onClick={() => toggleFavorite(topic.id)}>
                    {favorites.includes(topic.id) ? "★" : "☆"}
                  </button>
                </div>
                <p className="formula-label">{topic.formula}</p>
                <h3>{topic.title}</h3>
                <blockquote>{topic.hook}</blockquote>
                <details>
                  <summary>查看內容骨架</summary>
                  <div className="detail-list">
                    <p><strong>核心：</strong>{topic.angle}</p>
                    <p><strong>結構：</strong>{topic.structure}</p>
                    <p><strong>畫面：</strong>{topic.visual}</p>
                    <p><strong>CTA：</strong>{topic.cta}</p>
                    <p><strong>確認：</strong>{topic.check}</p>
                  </div>
                </details>
                <div className="card-actions">
                  <span>{topic.id} · {topic.series}</span>
                  <button className="button primary" onClick={() => openPlanner(topic)}>開始企劃 →</button>
                </div>
              </article>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <div className="empty-state">
              <div>⌕</div>
              <h3>目前沒有符合的題目</h3>
              <p>換一個關鍵字，或清除部分篩選條件。</p>
              <button className="button primary" onClick={() => { setQuery(""); setFormulaFilter("全部公式"); setCategoryFilter("全部主題"); setRiskFilter("全部風險"); setOnlyFavorites(false); }}>清除篩選</button>
            </div>
          )}
        </section>
      )}

      {view === "planner" && (
        <section className="page-section planner-view">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">PRODUCTION BRIEF</p>
              <h2>把主題補成可製作的企劃</h2>
            </div>
            <button className="button ghost" onClick={() => setView("library")}>← 回題庫換題目</button>
          </div>

          <div className="planner-layout">
            <aside className="selected-topic-panel">
              <p className="panel-kicker">目前主題</p>
              <div className="badge-row">
                <span className={`category-badge ${categoryColors[activeTopic.category]}`}>{activeTopic.category}</span>
                <span className={`risk-badge risk-${activeTopic.risk}`}>風險 {activeTopic.risk}</span>
              </div>
              <h3>{activeTopic.title}</h3>
              <p className="formula-label">{activeTopic.formula}</p>
              <blockquote>{activeTopic.hook}</blockquote>
              <dl className="topic-facts">
                <div><dt>核心觀點</dt><dd>{activeTopic.angle}</dd></div>
                <div><dt>建議畫面</dt><dd>{activeTopic.visual}</dd></div>
                <div><dt>原始 CTA</dt><dd>{activeTopic.cta}</dd></div>
                <div className="warning-fact"><dt>發布前確認</dt><dd>{activeTopic.check}</dd></div>
              </dl>
            </aside>

            <div className="brief-form">
              <div className="form-row three">
                <label><span>製作狀態</span><select value={activePlan.status} onChange={(event) => updatePlan("status", event.target.value as PlanStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                <label><span>發布平台</span><select value={activePlan.platform} onChange={(event) => updatePlan("platform", event.target.value)}><option>Instagram Reels</option><option>Threads</option><option>小紅書</option><option>TikTok</option><option>YouTube Shorts</option></select></label>
                <label><span>影片長度</span><select value={activePlan.duration} onChange={(event) => updatePlan("duration", event.target.value)}><option>30 秒</option><option>45–60 秒</option><option>60–90 秒</option></select></label>
              </div>
              <div className="form-row two">
                <label><span>目標受眾</span><textarea value={activePlan.audience} onChange={(event) => updatePlan("audience", event.target.value)} rows={3} /></label>
                <label><span>內容目的</span><textarea value={activePlan.objective} onChange={(event) => updatePlan("objective", event.target.value)} rows={3} /></label>
              </div>
              <label className="full-field"><span>前 3 秒鉤子</span><textarea value={activePlan.opening} onChange={(event) => updatePlan("opening", event.target.value)} rows={3} /></label>
              <label className="full-field"><span>唯一核心觀點</span><textarea value={activePlan.keyMessage} onChange={(event) => updatePlan("keyMessage", event.target.value)} rows={3} /></label>
              <div className="form-row two">
                <label><span>畫面與鏡頭</span><textarea value={activePlan.shots} onChange={(event) => updatePlan("shots", event.target.value)} rows={5} /></label>
                <label><span>單一 CTA</span><textarea value={activePlan.cta} onChange={(event) => updatePlan("cta", event.target.value)} rows={5} /></label>
              </div>
              <div className="form-row two compact">
                <label><span>預計發布日期</span><input type="date" value={activePlan.publishDate} onChange={(event) => updatePlan("publishDate", event.target.value)} /></label>
                <label><span>內部備註</span><input value={activePlan.notes} onChange={(event) => updatePlan("notes", event.target.value)} placeholder="素材、場景、服裝或審稿事項" /></label>
              </div>
              <div className="planner-actions">
                <div><strong>已自動儲存</strong><span>這份企劃保存在本機瀏覽器</span></div>
                <button className="button secondary" onClick={downloadPlan}>下載企劃</button>
                <button className="button primary large" onClick={() => copyText(buildCodexPrompt(activeTopic, activePlan), "已複製，可直接貼給 Codex")}>複製給 Codex ✦</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "generator" && (
        <section className="page-section generator-view">
          <div className="section-heading">
            <div><p className="eyebrow dark">IDEA ENGINE</p><h2>換幾個條件，就長出下一批題目</h2></div>
            <p className="result-count"><strong>12,000</strong> 種可組合方向</p>
          </div>
          <div className="generator-layout">
            <div className="generator-controls">
              <div className="step-number">01</div>
              <h3>選擇五個內容旋鈕</h3>
              <p>每次只要換其中一項，同一個核心觀點就能長出不同題目。</p>
              <label><span>爆款公式</span><select value={generatorFormula} onChange={(event) => setGeneratorFormula(event.target.value)}>{formulas.map((formula) => <option key={formula}>{formula}</option>)}</select></label>
              <label><span>主題分類</span><select value={generatorCategory} onChange={(event) => setGeneratorCategory(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label><span>生活情境</span><select value={generatorSituation} onChange={(event) => setGeneratorSituation(event.target.value)}>{situations.map((situation) => <option key={situation}>{situation}</option>)}</select></label>
              <label><span>受眾狀態</span><select value={generatorAudience} onChange={(event) => setGeneratorAudience(event.target.value)}>{audiences.map((audience) => <option key={audience}>{audience}</option>)}</select></label>
              <label><span>內容目的</span><select value={generatorPurpose} onChange={(event) => setGeneratorPurpose(event.target.value)}>{purposes.map((purpose) => <option key={purpose}>{purpose}</option>)}</select></label>
            </div>
            <div className="prompt-panel">
              <div className="step-number coral">02</div>
              <div className="prompt-heading"><div><h3>交給 Codex 的產題指令</h3><p>複製後貼到對話，就能再產出 10 條。</p></div><span>已套用 SNL 安全語氣</span></div>
              <pre>{generatorPrompt}</pre>
              <button className="button primary large" onClick={() => copyText(generatorPrompt, "產題指令已複製")}>複製產題指令 ✦</button>
              <div className="generator-note"><strong>建議節奏</strong><p>先一次產 10 條 → 選 2 條進企劃 → 寫腳本 → 拍攝後回看數據，再決定下一批要換哪個旋鈕。</p></div>
            </div>
          </div>
        </section>
      )}

      {view === "board" && (
        <section className="page-section board-view">
          <div className="section-heading">
            <div><p className="eyebrow dark">PRODUCTION BOARD</p><h2>所有企劃現在走到哪裡？</h2></div>
            <button className="button primary" onClick={() => setView("library")}>＋ 新增企劃</button>
          </div>
          {plannedTopics.length === 0 ? (
            <div className="empty-state"><div>▦</div><h3>還沒有加入企劃的題目</h3><p>先到靈感題庫挑一條，按下「開始企劃」。</p><button className="button primary" onClick={() => setView("library")}>前往題庫</button></div>
          ) : (
            <div className="kanban">
              {statuses.map((status) => {
                const statusPlans = plannedTopics.filter((plan) => plan.status === status);
                return (
                  <section className="kanban-column" key={status}>
                    <header><span className={`column-dot status-${status}`} /> <h3>{status}</h3><b>{statusPlans.length}</b></header>
                    <div className="kanban-list">
                      {statusPlans.map((plan) => {
                        const topic = topics.find((item) => item.id === plan.topicId);
                        if (!topic) return null;
                        return (
                          <article className="kanban-card" key={plan.topicId}>
                            <span className={`category-badge ${categoryColors[topic.category]}`}>{topic.category}</span>
                            <h4>{topic.title}</h4>
                            <p>{plan.platform} · {plan.duration}</p>
                            {plan.publishDate && <time>預計 {plan.publishDate}</time>}
                            <select value={plan.status} aria-label={`${topic.title}的製作狀態`} onChange={(event) => setPlans((current) => ({ ...current, [topic.id]: { ...plan, status: event.target.value as PlanStatus, updatedAt: new Date().toISOString() } }))}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
                            <button onClick={() => { setActiveTopicId(topic.id); setView("planner"); }}>開啟企劃 →</button>
                          </article>
                        );
                      })}
                      {statusPlans.length === 0 && <p className="empty-column">目前沒有內容</p>}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      )}

      <footer>
        <p>SNL Short Video Studio · 本地工作區</p>
        <p>借用爆款結構，但保留真實、尊重與專業。</p>
      </footer>

      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}
