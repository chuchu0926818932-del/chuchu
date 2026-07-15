import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { formulas, topics } from "../app/topics";

const desktopRoot = "C:\\Users\\USER\\Desktop\\短影音文案\\源源不絕主題庫";
const folderNames: Record<string, string> = {
  "具體數字＋立即好處": "01_具體數字＋立即好處",
  "前後對比": "02_前後對比",
  "反常識迷思": "03_反常識迷思",
  "懶人低門檻": "04_懶人低門檻",
  "真實不專業": "05_真實不專業",
  "情緒故事": "06_情緒故事",
  "案例＋解釋": "07_案例＋解釋",
  "留言關鍵字 CTA": "08_留言關鍵字CTA",
};

function markdownForTopic(topic: (typeof topics)[number]) {
  return [
    `## ${topic.id}｜${topic.title}`,
    `- 內容類型：${topic.contentType}`,
    `- 分類：${topic.category}`,
    `- 前 3 秒鉤子：${topic.hook}`,
    `- 情境：${topic.scene}`,
    `- 同理：${topic.empathy}`,
    `- 白話拆解：${topic.explain}`,
    `- 今天先做：${topic.action}`,
    `- 轉念收尾：${topic.reframe}`,
    `- 單一 CTA：${topic.cta}`,
    `- 拍攝畫面：${topic.visual}`,
    `- 內部公式檢查：${topic.storyline}`,
    `- 發布前確認：${topic.check}`,
  ].join("\n");
}

async function main() {
  const usage = [
    "# 短影音文案庫｜Keep 風格重建版",
    "",
    "這 80 條已完全取代舊版資料庫。文案先以自然口播寫成，再以靶心人七段、故事七元素與三合一結構做內部檢查；公式標籤不直接念進影片。",
    "",
    "## 寫作聲音",
    "",
    "- 真實生活痛點或反常識開場。",
    "- 先同理，不把問題怪成意志力、外貌或人格失敗。",
    "- 用白話拆解，再給 1–3 個能立刻做的選擇。",
    "- 用有力量、不說教的轉念收尾，最後只留一個關鍵字 CTA。",
    "- 涉及個人故事時，請換成自己的真實經歷，不捏造學員或客戶案例。",
  ].join("\n");

  await mkdir(desktopRoot, { recursive: true });
  await writeFile(path.join(desktopRoot, "00_使用方式.md"), usage, "utf8");

  for (const formula of formulas) {
    const entries = topics.filter((topic) => topic.formula === formula);
    const folder = path.join(desktopRoot, folderNames[formula]);
    const content = [
      `# ${formula}｜Keep 風格重建版（${entries.length} 條）`,
      "",
      "每條先寫成自然口播：情境 → 同理 → 白話拆解 → 今天先做 → 轉念 → 單一 CTA。",
      "",
      ...entries.map(markdownForTopic),
    ].join("\n\n");
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, "10條主題.md"), content, "utf8");
  }

  const dataPath = path.join(process.cwd(), ".tmp-keep-style-library.json");
  await writeFile(dataPath, JSON.stringify({ formulas, topics }, null, 2), "utf8");
  process.stdout.write(JSON.stringify({ topics: topics.length, formulas: formulas.length, dataPath }));
}

void main();
