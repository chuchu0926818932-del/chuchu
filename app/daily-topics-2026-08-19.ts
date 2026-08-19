import type { Topic } from "./topics";
import { dailyTopics20260818 } from "./daily-topics-2026-08-18";

type Category = "女性成長" | "金錢價值觀" | "親子關係";

type Draft = Pick<
  Topic,
  "category" | "title" | "hook" | "scene" | "empathy" | "explain" | "action" | "reframe" | "singleCta" | "contentType"
>;

const formulaConfig = dailyTopics20260818.slice(0, 8).map(({ formula, formulaOrder }) => ({ formula, formulaOrder }));

const guardrails: Record<Category, Pick<Topic, "risk" | "check">> = {
  女性成長: {
    risk: "只談職涯與事業發展，不延伸到感情、外貌或泛自我成長。",
    check: "確認內容聚焦職場界線、談薪升遷、轉職、定位、創業、協作、領導或工作自信。",
  },
  金錢價值觀: {
    risk: "不提供投資、借貸、金融商品或報酬保證建議。",
    check: "確認內容只談日常選擇、情緒與金錢價值觀，不引導任何金融行動。",
  },
  親子關係: {
    risk: "不替孩子貼標籤，不承諾孩子會因此改變。",
    check: "確認內容以照顧者可選擇的回應為主，保留孩子當下的感受與差異。",
  },
};

const drafts: Draft[] = [
  { category: "女性成長", title: "主管臨時加工作，先別急著答應", hook: "訊息一跳出來，你又想把自己的時間先讓出去嗎？", scene: "下班前十分鐘，主管傳來一項『今天能不能先處理』的任務。", empathy: "你怕拒絕看起來不配合，也怕錯過被看見的機會。", explain: "界線不是直接說不，而是先把可交付的範圍講清楚。", action: "你可以回：我今天能先完成 A；B 需要明早九點前交，您希望我優先哪一個？", reframe: "能說明優先順序的人，不是在推工作，而是在管理工作。", singleCta: "優先", contentType: "職場情境拆解" },
  { category: "女性成長", title: "想談升遷，別只說我很努力", hook: "做了很多事，卻不知道怎麼讓升遷討論開始？", scene: "績效面談前，你盯著空白筆記，不知道該怎麼整理這一季。", empathy: "你怕一開口像在邀功，所以只準備說自己很認真。", explain: "升遷對話需要的是影響力證據，不是忙碌清單。", action: "選一件你推動的事，寫下問題、你的做法、造成的改變，再約主管聊下一階段能力。", reframe: "讓成果被理解，不等於把努力放大。", singleCta: "成果", contentType: "升遷準備" },
  { category: "女性成長", title: "談薪前先做這張工作價值清單", hook: "一想到薪資，就只剩『我到底值不值得』的緊張嗎？", scene: "收到面談通知後，你一直重算心裡那個不敢說出口的數字。", empathy: "你怕提出期待會被拒絕，於是先把自己壓低。", explain: "談薪不是替自己辯護，而是把職責、成果與市場角色對齊。", action: "列三欄：新增責任、可被量化的成果、你能持續解決的問題；面談時先談這三欄。", reframe: "數字是討論的起點，不是你價值的判決。", singleCta: "對齊", contentType: "談薪口條" },
  { category: "女性成長", title: "轉職猶豫時，先看哪種累最值得", hook: "不是每一種累，都代表你走錯路。", scene: "你下班坐在捷運上，滑著職缺卻不敢按下投遞。", empathy: "現在的工作很耗，換工作又怕從頭來過。", explain: "職涯轉換先分辨：是工作量讓你累，還是工作內容正在消耗你的方向感。", action: "各寫一句：我想帶走的能力、我不想再承擔的消耗；用它篩前三個職缺。", reframe: "轉職不必一次選對，而是先選更接近自己方向的一步。", singleCta: "方向", contentType: "轉職選擇" },
  { category: "女性成長", title: "專業定位卡住，從別人怎麼找你開始", hook: "別人找你幫忙很多，卻還是說不清你專長是什麼？", scene: "自我介紹輪到你時，你用了三個『都可以』帶過。", empathy: "你會做的事不少，反而怕選一個就失去其他可能。", explain: "定位不是把自己縮小，而是先讓人知道你最常解決哪一類問題。", action: "回想最近三次被主動找上的事，圈出重複出現的問題，再用一句話描述它。", reframe: "清楚的入口，會讓更多合適的機會走進來。", singleCta: "入口", contentType: "專業定位" },
  { category: "女性成長", title: "創業初期別把每個訊息都當急件", hook: "自己做事後，為什麼反而更不敢休息？", scene: "晚上十一點，你還在回客戶、改貼文、確認明天的待辦。", empathy: "你怕慢一點就失去機會，所以每件事都立刻接住。", explain: "創業的工作自信，來自建立回應節奏，不是永遠在線。", action: "替常見訊息設兩個固定回覆時段，其他時間先記下需求，不立刻開工。", reframe: "有節奏地回應，才讓你的服務能走得久。", singleCta: "節奏", contentType: "創業日常" },
  { category: "女性成長", title: "會議被打斷時，用一句話拿回發言", hook: "話講到一半被接走，你是不是又默默把重點吞回去？", scene: "會議裡同事插入新想法，話題已經往別處跑。", empathy: "你不想讓現場尷尬，也怕自己被說太強勢。", explain: "協作不是誰聲音大，而是讓每個關鍵判斷有機會被說完整。", action: "先說：我把剛剛那個判斷補完，因為它會影響後面的選擇。", reframe: "把話說完，是對團隊資訊負責。", singleCta: "補完", contentType: "協作溝通" },
  { category: "女性成長", title: "第一次帶人，不必假裝什麼都會", hook: "成為主管後，最怕的其實是別人問你答案？", scene: "同事來問下一步，你腦中還在想自己其實也不確定。", empathy: "你擔心坦白不知道會讓人失望。", explain: "領導不是立刻給答案，而是幫團隊看見下一個可驗證的問題。", action: "先問：現在已知什麼、卡在哪裡、我們今天要決定哪一件事？", reframe: "能把問題變清楚，就是一種帶領。", singleCta: "釐清", contentType: "領導練習" },
  { category: "女性成長", title: "跨部門合作，別替所有人收尾", hook: "明明不是你的責任，最後怎麼又變成你在補洞？", scene: "專案快截止，群組安靜下來，你正準備自己把缺口補完。", empathy: "你怕專案失敗，也不想讓人覺得你計較。", explain: "協作的責任感，需要搭配可見的分工，不是默默多做。", action: "在群組寫下缺口、負責人與確認時間，請對方回覆是否可承接。", reframe: "把責任放回流程，團隊才有機會真的合作。", singleCta: "分工", contentType: "跨部門協作" },
  { category: "女性成長", title: "工作沒自信時，先停止替自己預扣分", hook: "還沒交出去，你已經先說『這可能不夠好』嗎？", scene: "寄出提案前，你在信裡反覆加上道歉和保留語。", empathy: "你想留退路，免得被挑剔時太難堪。", explain: "過度預扣分會讓對方先用你的不安閱讀你的專業。", action: "把『可能不夠好』換成『這版聚焦 X，想請你確認 Y』。", reframe: "清楚邀請回饋，比先否定自己更有力量。", singleCta: "聚焦", contentType: "工作自信" },

  { category: "金錢價值觀", title: "朋友都在買，你也需要立刻跟上嗎", hook: "看見大家曬新東西，心裡那個『我也該有』很大聲嗎？", scene: "午休滑社群時，你把一個其實不急的商品放進購物車。", empathy: "你不是不知道要想一想，只是不想感覺自己落後。", explain: "消費衝動常常是在買一種不想被排除的感覺。", action: "先問自己：我想要的是物品、方便，還是跟上大家的安心？明天再決定。", reframe: "能分辨感受，不會讓你少了選擇，只會讓選擇更像自己。", singleCta: "分辨", contentType: "日常消費覺察" },
  { category: "金錢價值觀", title: "發薪日先別急著犒賞自己", hook: "錢一入帳就想花，後面又開始焦慮嗎？", scene: "手機跳出入帳通知，你立刻打開購物網站和外送平台。", empathy: "你忙了一個月，真的很想有一點被獎勵的感覺。", explain: "犒賞不是問題，問題是它被放在沒看見整月需要之前。", action: "先留十分鐘寫下本月三個必要支出，再為自己保留一筆明確的快樂額度。", reframe: "照顧自己和照顧生活，可以同時發生。", singleCta: "留白", contentType: "發薪日整理" },
  { category: "金錢價值觀", title: "不想記帳，也能先看一種花錢模式", hook: "每次打開記帳 App 三天就放棄，你不是唯一一個。", scene: "月底看到帳戶餘額，你又想不起錢到底去哪了。", empathy: "表格一多就覺得麻煩，最後乾脆不看。", explain: "剛開始不必記每一筆，先看最常讓你失控的一種情境。", action: "只記七天的『臨時加買』，旁邊標註當下心情或場合。", reframe: "看懂模式，比把自己管得很緊更有用。", singleCta: "模式", contentType: "金錢習慣" },
  { category: "金錢價值觀", title: "聚餐輪到你付，先練習一句不尷尬的話", hook: "你常常先刷卡，然後又不好意思開口嗎？", scene: "聚餐結帳時，大家看著帳單，你下意識先拿出手機。", empathy: "你不想掃興，也怕談錢被當成計較。", explain: "把金額說清楚，是讓關係能長久的日常協調。", action: "結帳時直接說：我先付，等等我把各自金額傳群組。", reframe: "清楚不是冷淡，反而少了猜測。", singleCta: "清楚", contentType: "人際金錢" },
  { category: "金錢價值觀", title: "買給家人前，先問這真的是你的責任嗎", hook: "一想到家人需要，你就自動把自己排到最後嗎？", scene: "家族群組提到一筆支出，你立刻開始盤算自己能補多少。", empathy: "你想照顧大家，也怕不出力會有愧疚。", explain: "關心家人不等於一個人默默扛下所有安排。", action: "先回覆：我可以一起討論分工，今晚再確認我能負責的部分。", reframe: "先說明自己的範圍，關係才能有更長的餘裕。", singleCta: "範圍", contentType: "家庭支出溝通" },
  { category: "金錢價值觀", title: "折扣倒數時，替自己留一個冷靜鈕", hook: "看到『只剩最後一天』，你是不是瞬間不想錯過？", scene: "購物頁的倒數計時正在跳，你的手已經停在結帳鍵上。", empathy: "你怕現在不買，以後會更貴或再也找不到。", explain: "稀缺感會催你決定，但不一定代表需求真的急。", action: "把商品截圖存到相簿，設明晚提醒；提醒響時再問一次是否仍需要。", reframe: "延後一天，不是在錯過，是在把決定拿回來。", singleCta: "延後", contentType: "衝動消費" },
  { category: "金錢價值觀", title: "收入變多後，為什麼還是覺得不夠", hook: "明明比以前賺得多，焦慮卻沒有少？", scene: "看著薪資單，你第一個想到的是接下來又會多出哪些開銷。", empathy: "你以為收入增加就會安心，結果生活標準也跟著往上。", explain: "安全感不只來自數字，也來自你知道自己想把資源放在哪裡。", action: "寫下今年最想守住的三件生活事，下一次支出前先對照它們。", reframe: "不夠感不必立刻消失，先讓它有一張地圖。", singleCta: "地圖", contentType: "生活價值排序" },
  { category: "金錢價值觀", title: "看到別人旅行，不必用消費證明你也過得好", hook: "社群一滑，就覺得自己的生活太普通嗎？", scene: "週末晚上，你看著朋友出遊照片，開始搜尋同款行程。", empathy: "你不是不喜歡現在，只是怕自己沒有在好好生活。", explain: "比較會把別人的精彩變成你的待辦清單。", action: "關掉搜尋頁，列一個這週花很少也讓你舒服的選項，今晚先安排其中一個。", reframe: "生活的豐富，不需要用同一種畫面證明。", singleCta: "舒服", contentType: "社群比較" },
  { category: "金錢價值觀", title: "小額訂閱一直扣款，先別責怪自己", hook: "每月一看才發現又被扣了幾筆，覺得自己很不會管錢？", scene: "信用卡通知跳出熟悉的訂閱名稱，你卻想不起上次使用是何時。", empathy: "每一筆看起來不多，所以你總是延後處理。", explain: "小額支出容易被忽略，因為決定是在很久以前做的。", action: "今天只打開一份扣款紀錄，標記『仍在用』『偶爾用』『不知道』三種。", reframe: "整理不是檢討，是讓過去的決定重新被你看見。", singleCta: "標記", contentType: "固定支出整理" },
  { category: "金錢價值觀", title: "送禮預算不一樣，關係不一定就變遠", hook: "怕送得不夠好，所以每次都超出自己原本打算？", scene: "朋友生日快到，你在購物網站越看越覺得原本的預算太少。", empathy: "你想讓對方感受到重視，不想顯得小氣。", explain: "心意需要被表達，但不必每次都用超出負荷的方式表達。", action: "先訂一個你能自在支付的範圍，再從共同回憶挑一個有意思的選擇。", reframe: "能長久給出的心意，比一次用力更珍貴。", singleCta: "自在", contentType: "送禮價值觀" },

  { category: "親子關係", title: "孩子放學不想說話，先別急著問今天怎樣", hook: "你問了三次『今天好嗎』，得到的還是沉默嗎？", scene: "放學路上，孩子望著窗外，你一路找話題。", empathy: "你只是想靠近，又怕這段安靜代表你們變遠。", explain: "有些孩子需要先從一天的轉換裡慢慢回來，不一定能立刻說。", action: "你可以先分享自己今天一件小事，然後說：想說的時候我在。", reframe: "先讓安全感到位，對話才有地方開始。", singleCta: "等候", contentType: "放學互動" },
  { category: "親子關係", title: "孩子拖很久不出門，先少說一次快點", hook: "趕時間時，你越催，現場是不是越亂？", scene: "鞋子還沒穿好，時間一直走，你的聲音越來越急。", empathy: "你怕遲到，也怕每天早上都變成拉扯。", explain: "急促指令很容易讓彼此只聽見壓力，聽不見下一步。", action: "改成只給一個選擇：你要先穿鞋，還是先拿水壺？", reframe: "把大催促變成小選擇，早晨會多一點可走的路。", singleCta: "選擇", contentType: "出門準備" },
  { category: "親子關係", title: "孩子說不想去，先別急著說一定要", hook: "聽到『我不要』，你第一反應是把理由講更多嗎？", scene: "出門前，孩子停在門口說今天不想去原本的活動。", empathy: "你已經安排好了，也擔心一讓步就失去規矩。", explain: "先理解不想去的原因，不等於最後一定照著不去。", action: "先問：是身體累、怕某件事，還是想多待一下？再一起決定下一步。", reframe: "被聽見的感受，會讓後面的協調比較有空間。", singleCta: "原因", contentType: "情緒承接" },
  { category: "親子關係", title: "孩子打翻東西時，先處理現場再處理情緒", hook: "一聲碰倒後，你也跟著快爆炸了嗎？", scene: "水杯灑滿桌面，孩子站著不動，你腦中想到的是又來了。", empathy: "你累了一天，突然多一件事很難保持平靜。", explain: "先把危險和混亂收好，比立刻講道理更能讓彼此回到能聽的狀態。", action: "先說：我們先拿布擦；擦完再看看剛剛發生什麼。", reframe: "先一起收拾，不會讓界線消失，反而讓學習有位置。", singleCta: "收拾", contentType: "日常意外" },
  { category: "親子關係", title: "睡前一直拖，不一定是在故意作對", hook: "明明說好睡覺，孩子卻又要喝水又要聊天？", scene: "關燈後，房裡又傳來『我還有一件事』。", empathy: "你很想有自己的時間，卻也不想每晚都用吼的結束。", explain: "睡前拖延有時是在延長連結，不必先把它解讀成挑戰。", action: "睡前先約定五分鐘『今天最後聊天』，時間到就用同一句話收尾。", reframe: "固定的告別方式，能讓結束少一點對抗。", singleCta: "收尾", contentType: "睡前陪伴" },
  { category: "親子關係", title: "孩子不願分享，不急著替他下結論", hook: "看到孩子把東西抱緊，你會立刻擔心他不懂得分享嗎？", scene: "遊戲時另一個孩子想拿玩具，你的孩子把玩具收回懷裡。", empathy: "你怕旁人眼光，也想教孩子學會和人相處。", explain: "不願意立刻分享，可能只是還沒準備好放手，不等於一個固定特質。", action: "你可以說：你還想玩，等你玩完再告訴我能不能輪流。", reframe: "先尊重當下的需要，也能慢慢練習協調。", singleCta: "輪流", contentType: "同伴互動" },
  { category: "親子關係", title: "孩子寫作業卡住，陪在旁邊不等於代替", hook: "看到他一直發呆，你的手是不是比他更想拿起筆？", scene: "作業本停在同一題很久，桌邊的你開始焦躁。", empathy: "你怕進度落後，也怕今晚又拖得很晚。", explain: "陪伴可以是把任務切小，而不是把答案接過來。", action: "問他：這題最先看得懂的是哪一句？我們先只圈那一句。", reframe: "把第一步變小，往往比催完整更能開始。", singleCta: "第一步", contentType: "作業陪伴" },
  { category: "親子關係", title: "孩子生氣摔門後，你可以先照顧自己的聲音", hook: "門一關上，你是不是也想立刻追進去講清楚？", scene: "衝突後房門關起來，客廳只剩你又急又委屈。", empathy: "你不想放著不管，也怕一冷靜就變成疏遠。", explain: "暫停不是不理，而是先讓雙方從高張狀態回到能說話的位置。", action: "先告訴自己三次慢吐氣，留一句：我在外面，等你準備好再談。", reframe: "先穩住自己，才能把關係帶回對話。", singleCta: "暫停", contentType: "衝突後修復" },
  { category: "親子關係", title: "兄弟姊妹吵架，先別急著判誰對", hook: "兩個人同時喊你，你是不是瞬間只想快點判案？", scene: "客廳裡兩個孩子各說各話，你被拉進誰先開始的爭論。", empathy: "你只想恢復安靜，也怕處理不公平。", explain: "太快找對錯，容易讓每個人只忙著證明自己沒有錯。", action: "先分開問：你剛剛最不舒服的是什麼？再請每人說一個可接受的下一步。", reframe: "先看見衝突裡的需要，規則才比較聽得進去。", singleCta: "需要", contentType: "手足衝突" },
  { category: "親子關係", title: "孩子說我不要抱，關係不必因此被否定", hook: "被推開的那一刻，你心裡是不是也刺了一下？", scene: "你伸手想安撫，孩子轉過身說現在不要。", empathy: "你想幫忙，卻突然不知道自己還能做什麼。", explain: "孩子當下不想被碰觸，是一種界線訊號，不是對關係的總評價。", action: "你可以說：好，我坐在這裡陪你；想靠近時告訴我。", reframe: "尊重距離，也是在告訴孩子關係很安全。", singleCta: "陪伴", contentType: "親子界線" },
];

const formulaIndexes = new Map<string, number>();

export const dailyTopics20260819: Topic[] = drafts.map((draft, index) => {
  const { formula, formulaOrder } = formulaConfig[index % formulaConfig.length];
  const formulaIndex = (formulaIndexes.get(formula) ?? 0) + 1;
  formulaIndexes.set(formula, formulaIndex);
  const guardrail = guardrails[draft.category as Category];
  const thought = draft.hook.replace(/[，、。？！「」]/g, "");

  return {
    id: `D20260819-${String(index + 1).padStart(2, "0")}`,
    formula,
    formulaOrder,
    formulaIndex,
    category: draft.category,
    title: draft.title,
    hook: draft.hook,
    scene: draft.scene,
    angle: draft.explain,
    structure: "痛點開場 → 承接限制與情緒 → 白話拆解 → 一至三個低門檻選擇 → 轉念收尾 → 單一關鍵字 CTA",
    visual: `${draft.scene}畫面切到日常動作與一句關鍵文字，最後停在 CTA。`,
    cta: draft.singleCta,
    singleCta: draft.singleCta,
    risk: guardrail.risk,
    check: guardrail.check,
    series: `${draft.category}｜${formula}｜Keep 28 天影片語氣`,
    contentType: draft.contentType,
    empathy: draft.empathy,
    explain: draft.explain,
    action: draft.action,
    reframe: draft.reframe,
    storyline: `從「${draft.title}」的日常瞬間開始，承接「${draft.empathy}」，用「${draft.explain}」拆開卡點，給出「${draft.action}」，最後回到「${draft.reframe}」。`,
    storyElements: `場景：${draft.scene}｜心聲：${thought}｜行動：${draft.action}｜轉念：${draft.reframe}`,
    threeLayer: `痛點層：${draft.empathy}｜理解層：${draft.explain}｜選擇層：${draft.action}｜收束：${draft.reframe}`,
  };
});
