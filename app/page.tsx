"use client";

import type { Session } from "@supabase/supabase-js";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { buildScriptSegments, formatKeepScript, formatShootingScript, generateUniqueTopics, type ScriptSegment } from "./script-engine";
import { supabase, supabaseConfigured } from "./supabase";
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
  scriptSegments: ScriptSegment[];
  completedAt: string;
  updatedAt: string;
};

type WorkspaceData = {
  favorites: string[];
  plans: Record<string, SavedPlan>;
  activeTopicId: string;
  customTopics: Topic[];
};

type CloudPlanEnvelope = {
  __workspaceVersion: 3;
  items: Record<string, SavedPlan>;
  customTopics: Topic[];
};

type CloudStatus = "local" | "connecting" | "syncing" | "synced" | "error";

// v3 intentionally starts a clean workspace because the prior 80-topic library was retired.
const STORAGE_KEY = "snl-short-video-studio-v3";
const TOPIC_PAGE_SIZE = 18;
const KEEP_LABEL_URL = "https://keep.google.com/#label/28%E5%A4%A9%E5%BD%B1%E7%89%87";
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
  const plan: SavedPlan = {
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
    scriptSegments: [],
    completedAt: "",
    updatedAt: new Date().toISOString(),
  };
  plan.scriptSegments = buildScriptSegments(topic, plan);
  return plan;
}

function packCloudPlans(plans: Record<string, SavedPlan>, customTopics: Topic[]): CloudPlanEnvelope {
  return { __workspaceVersion: 3, items: plans, customTopics };
}

function unpackCloudPlans(value: unknown) {
  if (!value || typeof value !== "object") return { plans: {}, customTopics: [] as Topic[] };
  const candidate = value as Partial<CloudPlanEnvelope>;
  if (candidate.__workspaceVersion === 3 && candidate.items && typeof candidate.items === "object") {
    return {
      plans: candidate.items as Record<string, SavedPlan>,
      customTopics: Array.isArray(candidate.customTopics) ? candidate.customTopics : [],
    };
  }
  // Older workspaces refer to the retired topic library and must not revive old scripts.
  return { plans: {}, customTopics: [] as Topic[] };
}

function downloadText(filename: string, text: string, type = "text/markdown;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function Home() {
  const [view, setView] = useState<View>("library");
  const [query, setQuery] = useState("");
  const [formulaFilter, setFormulaFilter] = useState("全部公式");
  const [categoryFilter, setCategoryFilter] = useState("全部主題");
  const [riskFilter, setRiskFilter] = useState("全部風險");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [visibleTopicCount, setVisibleTopicCount] = useState(TOPIC_PAGE_SIZE);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [plans, setPlans] = useState<Record<string, SavedPlan>>({});
  const [customTopics, setCustomTopics] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState(topics[0].id);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabaseConfigured);
  const [cloudReady, setCloudReady] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>(supabaseConfigured ? "local" : "error");
  const [authOpen, setAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [removeConfirming, setRemoveConfirming] = useState(false);
  const workspaceRef = useRef<WorkspaceData>({
    favorites: [],
    plans: {},
    activeTopicId: topics[0].id,
    customTopics: [],
  });

  const [generatorFormula, setGeneratorFormula] = useState(formulas[0]);
  const [generatorCategory, setGeneratorCategory] = useState(categories[0]);
  const [generatorSituation, setGeneratorSituation] = useState(situations[0]);
  const [generatorAudience, setGeneratorAudience] = useState(audiences[1]);
  const [generatorPurpose, setGeneratorPurpose] = useState(purposes[0]);
  const allTopics = useMemo(() => [...topics, ...customTopics], [customTopics]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<WorkspaceData>;
          const savedCustomTopics = Array.isArray(saved.customTopics) ? saved.customTopics : [];
          if (Array.isArray(saved.favorites)) setFavorites(saved.favorites);
          if (saved.plans && typeof saved.plans === "object") setPlans(saved.plans);
          setCustomTopics(savedCustomTopics);
          if (saved.activeTopicId && [...topics, ...savedCustomTopics].some((topic) => topic.id === saved.activeTopicId)) {
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
    const data: WorkspaceData = { favorites, plans, activeTopicId, customTopics };
    workspaceRef.current = data;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [favorites, plans, activeTopicId, customTopics, hydrated]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let active = true;
    client.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setCloudStatus("error");
      } else {
        setSession(data.session);
      }
      setAuthReady(true);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setCloudReady(false);
      if (!nextSession) setCloudStatus("local");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!hydrated || !authReady) return;
    if (!client || !session) return;

    let cancelled = false;
    const loadCloudWorkspace = async () => {
      setCloudStatus("connecting");
      const { data, error } = await client
        .from("snl_workspaces")
        .select("favorites, plans, active_topic_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        setCloudStatus("error");
        setToast("雲端資料暫時無法讀取，本機資料仍會保存");
        return;
      }

      if (data) {
        const cloudFavorites = Array.isArray(data.favorites) ? data.favorites : [];
        const decoded = unpackCloudPlans(data.plans);
        const cloudActiveTopicId = typeof data.active_topic_id === "string"
          && [...topics, ...decoded.customTopics].some((topic) => topic.id === data.active_topic_id)
          ? data.active_topic_id
          : topics[0].id;
        setFavorites(cloudFavorites);
        setPlans(decoded.plans);
        setCustomTopics(decoded.customTopics);
        setActiveTopicId(cloudActiveTopicId);
      } else {
        const localWorkspace = workspaceRef.current;
        const { error: createError } = await client.from("snl_workspaces").upsert({
          user_id: session.user.id,
          favorites: localWorkspace.favorites,
          plans: packCloudPlans(localWorkspace.plans, localWorkspace.customTopics),
          active_topic_id: localWorkspace.activeTopicId,
          updated_at: new Date().toISOString(),
        });
        if (createError) {
          setCloudStatus("error");
          setToast("首次雲端同步失敗，本機資料仍會保存");
          return;
        }
      }

      setCloudReady(true);
      setCloudStatus("synced");
    };

    void loadCloudWorkspace();
    return () => {
      cancelled = true;
    };
  }, [authReady, hydrated, session]);

  useEffect(() => {
    const client = supabase;
    if (!client || !session || !cloudReady || !hydrated) return;

    const timer = window.setTimeout(async () => {
      setCloudStatus("syncing");
      const { error } = await client.from("snl_workspaces").upsert({
        user_id: session.user.id,
        favorites,
        plans: packCloudPlans(plans, customTopics),
        active_topic_id: activeTopicId,
        updated_at: new Date().toISOString(),
      });
      setCloudStatus(error ? "error" : "synced");
      if (error) setToast("雲端同步暫停，本機資料已保存");
    }, 700);

    return () => window.clearTimeout(timer);
  }, [activeTopicId, cloudReady, customTopics, favorites, hydrated, plans, session]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!hydrated) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [hydrated, view]);

  const activeTopic = allTopics.find((topic) => topic.id === activeTopicId) ?? topics[0];
  const activePlan = plans[activeTopic.id] ?? defaultPlan(activeTopic);
  const activeScript = activePlan.scriptSegments?.length
    ? activePlan.scriptSegments
    : buildScriptSegments(activeTopic, activePlan);

  const filteredTopics = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-Hant");
    return allTopics.filter((topic) => {
      const matchesQuery = !needle || [topic.title, topic.hook, topic.angle, topic.series]
        .join(" ")
        .toLocaleLowerCase("zh-Hant")
        .includes(needle);
      return matchesQuery
        && (formulaFilter === "全部公式" || topic.formula === formulaFilter)
        && (categoryFilter === "全部主題" || topic.category === categoryFilter)
        && (riskFilter === "全部風險" || topic.risk === riskFilter)
        && (!onlyFavorites || favorites.includes(topic.id))
        && (showCompleted || plans[topic.id]?.status !== "已完成");
    });
  }, [allTopics, query, formulaFilter, categoryFilter, riskFilter, onlyFavorites, favorites, plans, showCompleted]);

  const visibleTopics = filteredTopics.slice(0, visibleTopicCount);

  const plannedTopics = useMemo(() => Object.values(plans)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [plans]);
  const completedPlans = plannedTopics.filter((plan) => plan.status === "已完成");
  const completedBaseCount = topics.filter((topic) => plans[topic.id]?.status === "已完成").length;
  const remainingBaseCount = topics.length - completedBaseCount;
  const generatorUnlocked = completedBaseCount === topics.length;
  const inProgressCount = plannedTopics.filter((plan) => plan.status !== "已完成").length;

  function flash(message: string) {
    setToast(message);
  }

  async function copyText(text: string, message: string) {
    await navigator.clipboard.writeText(text);
    flash(message);
  }

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = supabase;
    const email = authEmail.trim();
    if (!client || !email) return;

    setAuthBusy(true);
    setAuthMessage("");
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setAuthBusy(false);
    setAuthMessage(error ? `登入連結寄送失敗：${error.message}` : "登入連結已寄出，請到信箱點一下就會回到工作台。");
  }

  async function signOut() {
    const client = supabase;
    if (!client) return;
    await client.auth.signOut();
    setAuthOpen(false);
    flash("已登出；目前改用本機保存");
  }

  const cloudStatusLabel = !supabaseConfigured
    ? "Supabase 尚未設定"
    : !authReady
      ? "檢查登入狀態"
      : cloudStatus === "connecting"
        ? "正在載入雲端"
        : cloudStatus === "syncing"
          ? "正在同步"
          : cloudStatus === "synced"
            ? "已同步至 Supabase"
            : cloudStatus === "error"
              ? "雲端暫停・本機已保存"
              : "本機保存・可登入同步";

  function toggleFavorite(topicId: string) {
    setFavorites((current) => current.includes(topicId)
      ? current.filter((id) => id !== topicId)
      : [...current, topicId]);
  }

  function openPlanner(topic: Topic) {
    setActiveTopicId(topic.id);
    setRemoveConfirming(false);
    setPlans((current) => {
      const existing = current[topic.id];
      if (!existing) return { ...current, [topic.id]: defaultPlan(topic) };
      if (existing.scriptSegments?.length) return current;
      const normalized = { ...defaultPlan(topic), ...existing };
      return {
        ...current,
        [topic.id]: { ...normalized, scriptSegments: buildScriptSegments(topic, normalized) },
      };
    });
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

  function setPlanStatus(topic: Topic, status: PlanStatus) {
    setPlans((current) => {
      const plan = current[topic.id] ?? defaultPlan(topic);
      return {
        ...current,
        [topic.id]: {
          ...plan,
          status,
          completedAt: status === "已完成" ? (plan.completedAt || new Date().toISOString()) : "",
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  function updateScriptSegment(index: number, key: keyof Omit<ScriptSegment, "time">, value: string) {
    setPlans((current) => {
      const plan = current[activeTopic.id] ?? defaultPlan(activeTopic);
      const segments = plan.scriptSegments?.length
        ? plan.scriptSegments
        : buildScriptSegments(activeTopic, plan);
      return {
        ...current,
        [activeTopic.id]: {
          ...plan,
          scriptSegments: segments.map((segment, segmentIndex) => segmentIndex === index
            ? { ...segment, [key]: value }
            : segment),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  function regenerateActiveScript() {
    setPlans((current) => {
      const plan = current[activeTopic.id] ?? defaultPlan(activeTopic);
      return {
        ...current,
        [activeTopic.id]: {
          ...plan,
          scriptSegments: buildScriptSegments(activeTopic, plan),
          updatedAt: new Date().toISOString(),
        },
      };
    });
    flash("已依最新企劃重新整理完整腳本");
  }

  async function completeActivePlan() {
    // Open the tab first, while this click is still a trusted user gesture, so popup blockers do not interrupt the flow.
    const keepTab = window.open(KEEP_LABEL_URL, "_blank", "noopener,noreferrer");
    const scriptForKeep = formatKeepScript(activeTopic, activePlan, activeScript);
    let copiedToClipboard = false;

    try {
      await navigator.clipboard.writeText(scriptForKeep);
      copiedToClipboard = true;
    } catch {
      // The plan is still safely archived even if a browser has disabled clipboard access.
    }

    setPlans((current) => {
      const plan = current[activeTopic.id] ?? defaultPlan(activeTopic);
      const now = new Date().toISOString();
      return {
        ...current,
        [activeTopic.id]: {
          ...plan,
          status: "已完成",
          completedAt: now,
          scriptSegments: plan.scriptSegments?.length
            ? plan.scriptSegments
            : buildScriptSegments(activeTopic, plan),
          updatedAt: now,
        },
      };
    });
    setShowCompleted(false);
    setView("library");
    if (copiedToClipboard && keepTab) {
      flash("已歸檔，完整文案已複製；Keep 已在新分頁開啟，直接貼上即可");
    } else if (copiedToClipboard) {
      flash("已歸檔，完整文案已複製；請手動開啟 Keep 的 28 天影片標籤貼上");
    } else {
      flash("企劃已完成並歸檔；瀏覽器未允許複製，請在 Keep 中手動複製腳本");
    }
  }

  function setPublishDateAfter(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const localDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    updatePlan("publishDate", localDate);
    flash(days === 1 ? "已排到明天" : "已排到 7 天後");
  }

  function removeActivePlan() {
    setPlans((current) => {
      const next = { ...current };
      delete next[activeTopic.id];
      return next;
    });
    setRemoveConfirming(false);
    setView("library");
    flash("企劃已移除，原始題目仍保留在題庫");
  }

  function clearLibraryFilters() {
    setQuery("");
    setFormulaFilter("全部公式");
    setCategoryFilter("全部主題");
    setRiskFilter("全部風險");
    setOnlyFavorites(false);
    setShowCompleted(false);
    setVisibleTopicCount(TOPIC_PAGE_SIZE);
  }

  function exportWorkspace() {
    const data: WorkspaceData = { favorites, plans, activeTopicId, customTopics };
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
        const importedCustomTopics = Array.isArray(data.customTopics) ? data.customTopics : [];
        setCustomTopics(importedCustomTopics);
        if (data.activeTopicId && [...topics, ...importedCustomTopics].some((topic) => topic.id === data.activeTopicId)) {
          setActiveTopicId(data.activeTopicId);
        }
        flash("備份已匯入");
      } catch {
        flash("這個備份檔無法讀取");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function downloadPlan() {
    const text = formatShootingScript(activeTopic, activePlan, activeScript);
    downloadText(`${activeTopic.id}_${activeTopic.title.replace(/[\\/:*?"<>|]/g, "-")}.md`, text);
    flash("完整拍攝腳本已下載");
  }

  function generateNextTopics() {
    if (!generatorUnlocked) {
      flash(`先完成目前 80 條，還剩 ${remainingBaseCount} 條`);
      return;
    }
    const nextTopics = generateUniqueTopics(allTopics, {
      formula: generatorFormula,
      category: generatorCategory,
      situation: generatorSituation,
      audience: generatorAudience,
      purpose: generatorPurpose,
    }, 10);
    if (nextTopics.length === 0) {
      flash("這組條件暫時沒有可加入的新題目，請換一個旋鈕");
      return;
    }
    setCustomTopics((current) => [...current, ...nextTopics]);
    setQuery("續題");
    setFormulaFilter("全部公式");
    setCategoryFilter("全部主題");
    setRiskFilter("全部風險");
    setOnlyFavorites(false);
    setShowCompleted(false);
    setVisibleTopicCount(TOPIC_PAGE_SIZE);
    setView("library");
    flash(`已加入 ${nextTopics.length} 條去重新題目`);
  }

  return (
    <main className={`app-shell view-${view}`}>
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">SNL CONTENT STUDIO</p>
            <h1>短影音企劃工作台</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <span className={`local-badge sync-${cloudStatus}`}><span className="status-dot" />{cloudStatusLabel}</span>
          {session ? (
            <button className="button ghost small" onClick={signOut} title={session.user.email}>登出雲端</button>
          ) : (
            <button className="button secondary small" onClick={() => setAuthOpen(true)} disabled={!supabaseConfigured}>登入雲端同步</button>
          )}
          <button className="button ghost small" onClick={exportWorkspace}>匯出備份</button>
          <label className="button ghost small file-label">
            匯入備份
            <input type="file" accept="application/json" onChange={importWorkspace} />
          </label>
        </div>
      </header>

      {authOpen && !session && (
        <div className="auth-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false); }}>
          <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="auth-close" aria-label="關閉登入視窗" onClick={() => setAuthOpen(false)}>×</button>
            <p className="eyebrow dark">SUPABASE CLOUD</p>
            <h2 id="auth-title">登入後，換電腦也能接著做</h2>
            <p>輸入 Email，我們會寄一封免密碼登入信。第一次登入會把這台電腦現有的收藏與企劃安全搬到你的雲端工作區。</p>
            <form onSubmit={sendMagicLink}>
              <label><span>Email</span><input type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="name@example.com" autoComplete="email" required /></label>
              <button className="button primary large" type="submit" disabled={authBusy}>{authBusy ? "寄送中…" : "寄送登入連結"}</button>
            </form>
            {authMessage && <p className="auth-message" role="status">{authMessage}</p>}
            <small>雲端資料受使用者權限隔離；即使使用公開的前端金鑰，其他人也無法讀取你的工作區。</small>
          </section>
        </div>
      )}

      <section className="hero-strip">
        <div>
          <p className="eyebrow dark">選好就能直接開拍</p>
          <h2>選一個題目，完整拍攝腳本已經幫你準備好。</h2>
          <p>預覽口播、畫面與字幕，拍完按下完成，題目就會自動歸檔、不再重複出現。</p>
        </div>
        <div className="hero-stats" aria-label="工作區統計">
          <div><strong>{allTopics.length}</strong><span>總題目</span></div>
          <div><strong>{favorites.length}</strong><span>已收藏</span></div>
          <div><strong>{inProgressCount}</strong><span>製作中</span></div>
          <div><strong>{completedPlans.length}</strong><span>已完成</span></div>
        </div>
      </section>

      <section className={`workflow-progress ${generatorUnlocked ? "unlocked" : ""}`} aria-label="首批題庫完成進度">
        <div className="progress-copy">
          <span>{generatorUnlocked ? "首批 80 條已完成" : `首批題庫進度 ${completedBaseCount} / ${topics.length}`}</span>
          <strong>{generatorUnlocked ? "去重新題目已解鎖，可以繼續生產下一批文案。" : `先拍完現有題庫，還有 ${remainingBaseCount} 條；完成的題目會自動從待選區消失。`}</strong>
        </div>
        <div className="progress-track" aria-hidden="true"><span style={{ width: `${(completedBaseCount / topics.length) * 100}%` }} /></div>
        <button className="button secondary small" onClick={() => setView("generator")}>{generatorUnlocked ? "產生下一批 10 條" : "查看續題解鎖進度"}</button>
      </section>

      {!session && favorites.length === 0 && plannedTopics.length === 0 && (
        <aside className="migration-note" aria-label="本機版資料搬移提示">
          <div><strong>已有本機版資料？</strong><span>先在舊版按「匯出備份」，再回正式站用上方「匯入備份」，登入後就會接著同步到雲端。</span></div>
          <button className="button secondary small" onClick={() => setAuthOpen(true)} disabled={!supabaseConfigured}>搬完後登入同步</button>
        </aside>
      )}

      <nav className="view-tabs" aria-label="主要功能">
        <button className={view === "library" ? "active" : ""} onClick={() => setView("library")}><span>01</span>待選題庫</button>
        <button className={view === "planner" ? "active" : ""} onClick={() => setView("planner")}><span>02</span>拍攝腳本</button>
        <button className={view === "generator" ? "active" : ""} onClick={() => setView("generator")}><span>03</span>去重續題</button>
        <button className={view === "board" ? "active" : ""} onClick={() => setView("board")}><span>04</span>完成紀錄</button>
      </nav>

      {view === "library" && (
        <section className="page-section library-view">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">IDEA LIBRARY</p>
              <h2>下一支要拍什麼？</h2>
            </div>
            <p className="result-count">找到 <strong>{filteredTopics.length}</strong> 條題目</p>
          </div>

          <div className="filter-panel">
            <label className="search-field">
              <span>搜尋</span>
              <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleTopicCount(TOPIC_PAGE_SIZE); }} placeholder="輸入情境、問題或關鍵字…" />
            </label>
            <label>
              <span>爆款公式</span>
              <select value={formulaFilter} onChange={(event) => { setFormulaFilter(event.target.value); setVisibleTopicCount(TOPIC_PAGE_SIZE); }}>
                <option>全部公式</option>
                {formulas.map((formula) => <option key={formula}>{formula}</option>)}
              </select>
            </label>
            <label>
              <span>內容主題</span>
              <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setVisibleTopicCount(TOPIC_PAGE_SIZE); }}>
                <option>全部主題</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              <span>風險</span>
              <select value={riskFilter} onChange={(event) => { setRiskFilter(event.target.value); setVisibleTopicCount(TOPIC_PAGE_SIZE); }}>
                <option>全部風險</option>
                <option>低</option><option>中</option><option>高</option>
              </select>
            </label>
            <button className={`favorite-filter ${onlyFavorites ? "active" : ""}`} onClick={() => { setOnlyFavorites((value) => !value); setVisibleTopicCount(TOPIC_PAGE_SIZE); }}>
              {onlyFavorites ? "★" : "☆"} 只看收藏
            </button>
            <button className={`completed-filter ${showCompleted ? "active" : ""}`} onClick={() => { setShowCompleted((value) => !value); setVisibleTopicCount(TOPIC_PAGE_SIZE); }}>
              {showCompleted ? "隱藏已完成" : "顯示已完成"}
            </button>
          </div>

          <div className="topic-grid">
            {visibleTopics.map((topic) => (
              <article className={`topic-card ${plans[topic.id]?.status === "已完成" ? "completed" : ""}`} key={topic.id}>
                <div className="card-topline">
                  <div className="badge-row">
                    <span className={`category-badge ${categoryColors[topic.category]}`}>{topic.category}</span>
                    <span className={`risk-badge risk-${topic.risk}`}>風險 {topic.risk}</span>
                    {plans[topic.id]?.status === "已完成" && <span className="completed-badge">已完成</span>}
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
                  <button className="button primary" onClick={() => openPlanner(topic)}>{plans[topic.id]?.status === "已完成" ? "查看完成腳本 →" : "直接看完整腳本 →"}</button>
                </div>
              </article>
            ))}
          </div>

          {filteredTopics.length > 0 && (
            <div className="library-pagination">
              <p>目前顯示 <strong>{visibleTopics.length}</strong> / {filteredTopics.length} 條</p>
              {visibleTopics.length < filteredTopics.length && (
                <button className="button secondary" onClick={() => setVisibleTopicCount((count) => count + TOPIC_PAGE_SIZE)}>再顯示 {Math.min(TOPIC_PAGE_SIZE, filteredTopics.length - visibleTopics.length)} 條</button>
              )}
            </div>
          )}

          {filteredTopics.length === 0 && (
            <div className="empty-state">
              <div>⌕</div>
              <h3>{completedBaseCount === topics.length && !showCompleted ? "首批待選題目已全部完成" : "目前沒有符合的題目"}</h3>
              <p>{completedBaseCount === topics.length && !showCompleted ? "可以前往去重續題，產生下一批 10 條文案。" : "換一個關鍵字，或清除部分篩選條件。"}</p>
              <button className="button primary" onClick={clearLibraryFilters}>清除篩選</button>
            </div>
          )}
        </section>
      )}

      {view === "planner" && (
        <section className="page-section planner-view">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">SHOOTING SCRIPT</p>
              <h2>完整腳本，打開就能照著拍</h2>
            </div>
            <button className="button ghost" onClick={() => setView("library")}>← 回待選題庫</button>
          </div>

          <div className="planner-layout script-layout">
            <aside className="selected-topic-panel compact-topic-panel">
              <p className="panel-kicker">目前主題</p>
              <div className="badge-row">
                <span className={`category-badge ${categoryColors[activeTopic.category]}`}>{activeTopic.category}</span>
                <span className={`risk-badge risk-${activeTopic.risk}`}>風險 {activeTopic.risk}</span>
                <span className="content-type-badge">{activeTopic.contentType || "信任型"}</span>
                {activePlan.status === "已完成" && <span className="completed-badge">已完成</span>}
              </div>
              <h3>{activeTopic.title}</h3>
              <p className="formula-label">{activeTopic.formula}</p>
              <blockquote>{activeTopic.hook}</blockquote>
              <dl className="topic-facts">
                <div><dt>核心觀點</dt><dd>{activeTopic.angle}</dd></div>
                <div className="warning-fact"><dt>發布前確認</dt><dd>{activeTopic.check}</dd></div>
              </dl>
              {activePlan.completedAt && <p className="completed-at">完成時間：{new Date(activePlan.completedAt).toLocaleString("zh-TW")}</p>}
            </aside>

            <div className="script-workspace">
              <div className="script-workspace-heading">
                <div><p className="panel-kicker">完整拍攝稿</p><h3>{activeTopic.title}</h3><p className="script-framework-label">{activeTopic.contentType || "信任型"} · 靶心人七段故事 · 故事七大元素 · 三合一文案</p><p>{activeScript.length} 段口播、畫面與字幕；內容可直接修改並自動保存。</p></div>
                <button className="button secondary" type="button" onClick={regenerateActiveScript}>依企劃重新生成</button>
              </div>

              <section className="script-preview-panel" aria-label="完整拍攝腳本預覽">
                {activeScript.map((segment, index) => (
                  <article className="script-segment" key={`${segment.time}-${index}`}>
                    <div className="segment-time"><span>{String(index + 1).padStart(2, "0")}</span><strong>{segment.time}</strong></div>
                    <div className="segment-content">
                      <label className="voiceover-field"><span>口播</span><textarea value={segment.voiceover} onChange={(event) => updateScriptSegment(index, "voiceover", event.target.value)} rows={3} /></label>
                      <div className="script-support-fields">
                        <label><span>拍攝畫面</span><textarea value={segment.visual} onChange={(event) => updateScriptSegment(index, "visual", event.target.value)} rows={2} /></label>
                        <label><span>畫面字幕</span><input value={segment.subtitle} onChange={(event) => updateScriptSegment(index, "subtitle", event.target.value)} /></label>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <div className="compact-plan-fields after-script-fields">
                <label><span>製作狀態</span><select value={activePlan.status} onChange={(event) => setPlanStatus(activeTopic, event.target.value as PlanStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                <label><span>發布平台</span><select value={activePlan.platform} onChange={(event) => updatePlan("platform", event.target.value)}><option>Instagram Reels</option><option>Threads</option><option>小紅書</option><option>TikTok</option><option>YouTube Shorts</option></select></label>
                <label><span>影片長度</span><select value={activePlan.duration} onChange={(event) => updatePlan("duration", event.target.value)}><option>30 秒</option><option>45–60 秒</option><option>60–90 秒</option></select></label>
                <label><span>預計發布日期</span><input type="date" value={activePlan.publishDate} onChange={(event) => updatePlan("publishDate", event.target.value)} /><span className="date-shortcuts"><button type="button" onClick={() => setPublishDateAfter(1)}>明天</button><button type="button" onClick={() => setPublishDateAfter(7)}>7 天後</button></span></label>
              </div>

              <details className="advanced-brief">
                <summary>調整腳本來源與內部備註</summary>
                <div className="advanced-brief-grid">
                  <label><span>目標受眾</span><textarea value={activePlan.audience} onChange={(event) => updatePlan("audience", event.target.value)} rows={2} /></label>
                  <label><span>內容目的</span><textarea value={activePlan.objective} onChange={(event) => updatePlan("objective", event.target.value)} rows={2} /></label>
                  <label><span>前 3 秒鉤子</span><textarea value={activePlan.opening} onChange={(event) => updatePlan("opening", event.target.value)} rows={2} /></label>
                  <label><span>唯一核心觀點</span><textarea value={activePlan.keyMessage} onChange={(event) => updatePlan("keyMessage", event.target.value)} rows={2} /></label>
                  <label><span>畫面與鏡頭</span><textarea value={activePlan.shots} onChange={(event) => updatePlan("shots", event.target.value)} rows={3} /></label>
                  <label><span>單一 CTA</span><textarea value={activePlan.cta} onChange={(event) => updatePlan("cta", event.target.value)} rows={3} /></label>
                  <label className="full-field"><span>內部備註</span><textarea value={activePlan.notes} onChange={(event) => updatePlan("notes", event.target.value)} placeholder="素材、場景、服裝或審稿事項" rows={3} /></label>
                </div>
                <button className="button secondary" type="button" onClick={regenerateActiveScript}>套用調整並重新生成腳本</button>
              </details>

              <div className="planner-actions script-actions">
                <div><strong>{session ? cloudStatusLabel : "已自動儲存"}</strong><span>{session ? "雲端同步失敗時仍會保存在本機瀏覽器" : "目前保存在本機；登入後可跨裝置同步"}</span></div>
                {plans[activeTopic.id] && (removeConfirming ? (
                  <span className="remove-confirm"><b>確定移除？</b><button type="button" onClick={removeActivePlan}>確定</button><button type="button" onClick={() => setRemoveConfirming(false)}>取消</button></span>
                ) : <button className="button danger" type="button" onClick={() => setRemoveConfirming(true)}>移除企劃</button>)}
                <button className="button ghost" onClick={downloadPlan}>下載腳本</button>
                <button className="button secondary" onClick={() => copyText(formatShootingScript(activeTopic, activePlan, activeScript), "完整拍攝腳本已複製")}>複製完整腳本</button>
                <button className="button primary large complete-button" onClick={() => void completeActivePlan()} disabled={activePlan.status === "已完成"}>{activePlan.status === "已完成" ? "已完成拍攝 ✓" : "拍攝完成並歸檔・複製到 Keep ✓"}</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "generator" && (
        <section className="page-section generator-view">
          <div className="section-heading">
            <div><p className="eyebrow dark">DEDUPLICATED IDEA ENGINE</p><h2>完成首批 80 條，再接著生產新文案</h2></div>
            <p className="result-count"><strong>{customTopics.length}</strong> 條已新增續題</p>
          </div>
          <div className="generator-layout">
            <div className="generator-controls">
              <div className="step-number">01</div>
              <h3>選下一批內容方向</h3>
              <p>系統會比對目前所有題目的標題與前 3 秒鉤子，避免重複後再一次加入 10 條。</p>
              <label><span>爆款公式</span><select value={generatorFormula} onChange={(event) => setGeneratorFormula(event.target.value)}>{formulas.map((formula) => <option key={formula}>{formula}</option>)}</select></label>
              <label><span>主題分類</span><select value={generatorCategory} onChange={(event) => setGeneratorCategory(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label><span>生活情境</span><select value={generatorSituation} onChange={(event) => setGeneratorSituation(event.target.value)}>{situations.map((situation) => <option key={situation}>{situation}</option>)}</select></label>
              <label><span>受眾狀態</span><select value={generatorAudience} onChange={(event) => setGeneratorAudience(event.target.value)}>{audiences.map((audience) => <option key={audience}>{audience}</option>)}</select></label>
              <label><span>內容目的</span><select value={generatorPurpose} onChange={(event) => setGeneratorPurpose(event.target.value)}>{purposes.map((purpose) => <option key={purpose}>{purpose}</option>)}</select></label>
            </div>
            <div className={`prompt-panel generator-status-panel ${generatorUnlocked ? "unlocked" : "locked"}`}>
              <div className="step-number coral">02</div>
              <div className="prompt-heading">
                <div><h3>{generatorUnlocked ? "去重續題已解鎖" : `還差 ${remainingBaseCount} 條完成`}</h3><p>{generatorUnlocked ? "選好方向後，網站會直接把下一批加入待選題庫。" : "先把目前的 80 條拍攝完成並歸檔，才會開放下一批，避免題庫越堆越多。"}</p></div>
                <span>{generatorUnlocked ? "可以直接產生" : `進度 ${completedBaseCount} / ${topics.length}`}</span>
              </div>
              <div className="generator-summary">
                <p><span>公式</span><strong>{generatorFormula}</strong></p>
                <p><span>領域</span><strong>{generatorCategory}</strong></p>
                <p><span>情境</span><strong>{generatorSituation}</strong></p>
                <p><span>受眾</span><strong>{generatorAudience}</strong></p>
                <p><span>目的</span><strong>{generatorPurpose}</strong></p>
              </div>
              <div className="dedupe-stats">
                <div><strong>{allTopics.length}</strong><span>目前總題目</span></div>
                <div><strong>標題＋鉤子</strong><span>雙重去重</span></div>
                <div><strong>10</strong><span>每批新增</span></div>
              </div>
              <button className="button primary large generator-button" onClick={generateNextTopics} disabled={!generatorUnlocked}>{generatorUnlocked ? "產生 10 條去重新題目 ✦" : `先完成剩下 ${remainingBaseCount} 條`}</button>
              <div className="generator-note"><strong>系統會自動處理</strong><p>新題目會附上完整企劃資料，選取後立即看到可拍攝腳本；已完成過的題目仍保留在完成紀錄，但不會再次出現在待選結果。</p></div>
            </div>
          </div>
        </section>
      )}

      {view === "board" && (
        <section className="page-section board-view">
          <div className="section-heading">
            <div><p className="eyebrow dark">PRODUCTION RECORD</p><h2>企劃進度與拍攝完成紀錄</h2></div>
            <button className="button primary" onClick={() => setView("library")}>＋ 選下一支影片</button>
          </div>
          {plannedTopics.length === 0 ? (
            <div className="empty-state"><div>◎</div><h3>還沒有企劃紀錄</h3><p>回到待選題庫，點開任一題就能看到完整拍攝腳本。</p><button className="button primary" onClick={() => setView("library")}>去選題目</button></div>
          ) : (
            <div className="kanban">
              {statuses.map((status) => {
                const statusPlans = plannedTopics.filter((plan) => plan.status === status);
                return (
                  <section className="kanban-column" key={status}>
                    <header><span className={`column-dot status-${status}`} /> <h3>{status}</h3><b>{statusPlans.length}</b></header>
                    <div className="kanban-list">
                      {statusPlans.map((plan) => {
                        const topic = allTopics.find((item) => item.id === plan.topicId);
                        if (!topic) return null;
                        return (
                          <article className="kanban-card" key={plan.topicId}>
                            <span className={`category-badge ${categoryColors[topic.category]}`}>{topic.category}</span>
                            <h4>{topic.title}</h4>
                            <p>{plan.platform} · {plan.duration}</p>
                            {plan.publishDate && <time>預計 {plan.publishDate}</time>}
                            {plan.completedAt && <time>完成 {new Date(plan.completedAt).toLocaleString("zh-TW")}</time>}
                            <select value={plan.status} aria-label={`${topic.title}的製作狀態`} onChange={(event) => setPlanStatus(topic, event.target.value as PlanStatus)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
                            <button onClick={() => { setActiveTopicId(topic.id); setRemoveConfirming(false); setView("planner"); }}>{plan.status === "已完成" ? "查看完成腳本 →" : "開啟拍攝腳本 →"}</button>
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
        <p>SNL Short Video Studio · 本機優先＋Supabase 雲端同步</p>
        <p>借用爆款結構，但保留真實、尊重與專業。</p>
      </footer>

      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}
