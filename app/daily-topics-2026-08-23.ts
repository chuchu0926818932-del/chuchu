import type { Topic } from "./topics";
import { dailyTopics20260822 } from "./daily-topics-2026-08-22";

type Category = "女性成長" | "金錢價值觀" | "親子關係";
type Draft = Pick<Topic, "category" | "title" | "hook" | "scene" | "empathy" | "explain" | "action" | "reframe" | "singleCta" | "contentType">;

const formulaConfig = dailyTopics20260822.slice(0, 8).map(({ formula, formulaOrder }) => ({ formula, formulaOrder }));
const guardrails: Record<Category, Pick<Topic, "risk" | "check">> = {
  女性成長: { risk: "只談職涯與事業發展，不延伸到感情、外貌或泛自我成長。", check: "確認內容聚焦職場界線、談薪升遷、轉職、定位、創業、協作、領導或工作自信。" },
  金錢價值觀: { risk: "不提供投資、借貸、金融商品或報酬保證建議。", check: "確認內容只談日常選擇、情緒與金錢價值觀，不引導任何金融行動。" },
  親子關係: { risk: "不替孩子貼標籤，不承諾孩子會因此改變。", check: "確認內容以照顧者可選擇的回應為主，保留孩子當下的感受與差異。" },
};

const drafts: Draft[] = [
  { category: "女性成長", title: "臨時被拉進專案時，先問自己負責哪一段", hook: "訊息一來就被加進專案群組，你卻不知道自己要接住什麼嗎？", scene: "下午群組通知連響三次，你的名字忽然出現在新專案成員裡。", empathy: "你想趕快幫上忙，也怕沒問清楚就把別人的工作重做一遍。", explain: "先對齊交付的那一段，熱心才會變成真正可用的協作。", action: "問清成果、交付對象與期限三件事。", reframe: "角色說清楚，投入才有落點。", singleCta: "角色卡", contentType: "專案協作" },
  { category: "女性成長", title: "主管說再想想時，把升遷回饋拆成一題", hook: "面談聽到再想想，你是不是回去後只剩一整團猜測？", scene: "面談結束後，你攤開筆記卻看不出下一步該補哪裡。", empathy: "你怕一直追問很煩，也怕一年後又得到同樣模糊的回答。", explain: "模糊回饋縮小成可回答的問題，才知道該往哪裡累積。", action: "問：準備好下一級時，我最需穩定做到哪件事？", reframe: "把不確定問小，升遷才有準備的路。", singleCta: "升遷題", contentType: "升遷溝通" },
  { category: "女性成長", title: "談加薪前，先把你的影響範圍畫出來", hook: "要談加薪時，你腦中只有自己很忙，卻不知道怎麼說影響嗎？", scene: "空白文件裡列滿工作，卻每一條都像待辦清單。", empathy: "你知道自己投入很多，又擔心講出來只像訴苦。", explain: "談薪要讓人看見工作影響了誰、哪個流程或結果。", action: "畫三圈：我做什麼、誰更容易工作、哪個結果被推進。", reframe: "說出影響，是讓價值被看見。", singleCta: "影響圈", contentType: "談薪準備" },
  { category: "女性成長", title: "新職位第一週，先替舊同事留一份交接地圖", hook: "剛換職位就想全部往前衝，卻怕舊工作突然回頭找你嗎？", scene: "新座位才坐兩天，前團隊已傳來三個找檔案訊息。", empathy: "你想快速上手，也不想因交接不清一直被拉回原位。", explain: "交接是留下別人找得到的路徑，不是把所有事繼續扛著。", action: "整理一頁：檔案位置、固定時程、例外先問誰。", reframe: "留好地圖後往前走，才能照顧新角色。", singleCta: "交接圖", contentType: "職涯轉換" },
  { category: "女性成長", title: "履歷作品太雜時，用一句話選出主軸", hook: "作品做過很多種，反而讓你不知道履歷第一頁該放什麼嗎？", scene: "資料夾裡有設計、企劃和協作紀錄，你每個都捨不得刪。", empathy: "你怕少放一個就錯過機會，也怕全放上去沒人懂你。", explain: "主軸是替讀者決定第一眼怎麼理解你，不是否定其他經驗。", action: "寫：我最常把哪種混亂整理成可執行的事？", reframe: "先有主線，豐富經驗才不會分散。", singleCta: "主軸句", contentType: "專業定位" },
  { category: "女性成長", title: "接到合作邀約時，先確認誰有最後決定權", hook: "對方一直說我們再討論，你卻不知道最後到底誰會拍板嗎？", scene: "提案來回三封信，意見越來越多卻沒人定下一步。", empathy: "你想維持好關係，也怕準備很多後才發現方向沒人能決定。", explain: "知道決策路徑，才能安排溝通節奏，不必把每個意見當最後答案。", action: "確認誰整合意見並決定下一版方向。", reframe: "找到決策入口，合作才不會停在討論。", singleCta: "拍板人", contentType: "商務協作" },
  { category: "女性成長", title: "創業忙到回訊息很慢時，先寫一個回覆時限", hook: "客戶一問你就得立刻回，忙完才發現整天工作都被切碎了嗎？", scene: "手機在電腦旁不停亮起，你每回一則就得重新找回工作。", empathy: "你怕晚回顯得不重視，也知道切換讓重要工作做不深。", explain: "說清何時會回應，能減少猜測並留下完整專注時間。", action: "設定：今天幾點前整理回覆，急件標示決定時間。", reframe: "回覆有節奏，服務和專注都能持續。", singleCta: "回覆窗", contentType: "創業流程" },
  { category: "女性成長", title: "被要求立刻答應時，先保留一段思考空間", hook: "有人當場問你能不能接，你是不是怕掃興就先說可以？", scene: "會議快結束時，所有人看向你等著接下一項任務。", empathy: "你不想讓團隊失望，也擔心答應後時間根本排不進去。", explain: "即時回應不等於立刻承諾，先看資源才能做可靠選擇。", action: "說：今天下班前回覆承接與需調整的地方。", reframe: "替承諾留思考，是讓責任更穩。", singleCta: "緩答句", contentType: "職場界線" },
  { category: "女性成長", title: "帶會議前，先指定今天誰來記下決定", hook: "會議聊得很熱鬧，散會後卻沒人記得剛剛到底定了什麼嗎？", scene: "投影幕關掉後大家離開，桌上只剩幾張零散筆記。", empathy: "你想讓大家有參與感，也不想總由同一個人默默收尾。", explain: "決定被記下來，討論才有下一步；這是會議設計。", action: "指定紀錄者，只記決定、接手者與回看日期。", reframe: "明確收尾，會議才不只留下努力感。", singleCta: "決定簿", contentType: "領導協作" },
  { category: "女性成長", title: "準備向上管理時，先用一頁寫出你需要的支持", hook: "想找主管討論卻又怕講太散，最後只說最近有點忙嗎？", scene: "一對一時間排好了，你進會議室前還不知道第一句怎麼開。", empathy: "你希望被理解，也怕問題太大讓對方不知道怎麼幫。", explain: "清楚請求能讓主管知道你需要決策、資源還是優先順序。", action: "寫一頁：卡點、已試過的事、希望協助的選擇。", reframe: "說清需要的支持，是讓合作發生。", singleCta: "支持頁", contentType: "向上管理" },
  { category: "金錢價值觀", title: "結帳前想用折扣碼時，先確認它不是新增理由", hook: "為了用一組折扣碼多放一件商品，你其實本來想買它嗎？", scene: "結帳頁顯示再加一件就折抵，你的手停在推薦商品旁。", empathy: "你不想浪費難得優惠，也怕買完才發現用不到。", explain: "折扣降低價格，卻不會自動創造需要。", action: "把加購品移出車，問：沒有折扣我今天還會買嗎？", reframe: "優惠能幫你省，不必替你決定多買。", singleCta: "折扣問", contentType: "優惠選擇" },
  { category: "金錢價值觀", title: "分期按鈕跳出時，先看這件事會陪你多久", hook: "看到每月金額變小就鬆一口氣，卻沒想過它會跟你多久嗎？", scene: "付款頁把數字拆成好幾期，總金額縮在下面小字。", empathy: "你想讓當下沒壓力，也不想每月都被以前決定追著跑。", explain: "先想物品會在生活裡停留多久，比只看每月數字清楚。", action: "寫下預計用到哪月，那時是否仍願保留這筆支出。", reframe: "看見時間感，才知道輕鬆的是今天還是整段選擇。", singleCta: "時間帳", contentType: "付款選擇" },
  { category: "金錢價值觀", title: "收到紅包後，先替它留一個想使用的畫面", hook: "紅包一拿到就想趕快花掉，你有沒有先想過想留下什麼？", scene: "紅包袋還沒收起來，你已滑開購物 App 找犒賞。", empathy: "你想享受被祝福，也不想幾天後想不起花在哪裡。", explain: "先想它要陪你完成的生活畫面，比急找商品更能留下心意。", action: "選一個畫面：慢慢吃的飯、可休息的時間或常用物品。", reframe: "把祝福放進生活，花錢也是一種記得。", singleCta: "祝福圖", contentType: "節慶金錢" },
  { category: "金錢價值觀", title: "聚餐要平分時，先把自己能接受的範圍說出來", hook: "看到菜單價格超出預期，你還是先點頭說都可以嗎？", scene: "朋友正在選餐廳，你盯著菜單數字卻沒有開口。", empathy: "你想一起吃得開心，也怕講預算讓氣氛尷尬。", explain: "早說可接受範圍，大家才有機會找舒服的選擇。", action: "說：我今天想抓這個範圍，有沒有合適的店？", reframe: "說範圍不是掃興，是不讓相聚靠壓力買單。", singleCta: "聚餐線", contentType: "人際金錢" },
  { category: "金錢價值觀", title: "清空購物車前，先替想買的東西留一晚", hook: "購物車越放越心癢，你是不是常在深夜直接按下結帳？", scene: "睡前滑到最後一頁，商品剛好都顯示庫存不多。", empathy: "你怕明天就沒了，也知道隔天常會有不同感覺。", explain: "留一晚是讓急迫感退一步，看需求是否還在。", action: "截圖後清空，明天只放回仍想要的一件。", reframe: "願意等一晚，不會錯過真正重視的選擇。", singleCta: "隔夜看", contentType: "衝動消費" },
  { category: "金錢價值觀", title: "看到朋友換新手機時，先問自己的舊機還卡在哪裡", hook: "朋友一換新手機你就開始嫌自己的慢，你真的卡在什麼地方嗎？", scene: "朋友拿出新手機拍照，你低頭看螢幕忽然覺得舊了。", empathy: "你不想落後，也怕比較一陣子就花掉未規劃的錢。", explain: "先找出舊設備的真困擾，才知道是否需要處理。", action: "列最近三次卡住情境：電量、拍照、工作或比較。", reframe: "聽自己的使用經驗，不必跟著別人的更新速度。", singleCta: "卡點表", contentType: "比較消費" },
  { category: "金錢價值觀", title: "付年費會員前，先回想最近三個月怎麼用", hook: "年費方案看起來更划算，但你真的會用到那麼多次嗎？", scene: "網站把年費折成每天幾塊錢，你想不起上次登入何時。", empathy: "你想做聰明選擇，也怕怕錯過優惠而把使用想太理想。", explain: "最近真實紀錄比想像中的未來更可靠。", action: "回看三個月的次數、用途與沒有它時的做法。", reframe: "用生活校正期待，不把省錢建在未發生使用上。", singleCta: "使用史", contentType: "會員選擇" },
  { category: "金錢價值觀", title: "要買課程前，先找出你何時會真的打開它", hook: "課程頁寫得很完整，你卻沒想過下週哪一晚會開始看嗎？", scene: "倒數優惠快結束，你一邊看大綱一邊開著購買頁。", empathy: "你想留住學習機會，也怕買完又多一件待辦。", explain: "學習不只要內容，也要一段能進入生活的開始時間。", action: "先排二十分鐘與第一個單元，排不進去就收藏。", reframe: "先替開始留位置，學習不必靠購買證明。", singleCta: "開課格", contentType: "學習消費" },
  { category: "金錢價值觀", title: "二手平台逛太久時，先替家裡現有的東西拍照", hook: "二手平台越逛越覺得缺東西，你有看過家裡其實有什麼嗎？", scene: "手機跳出便宜物品，你卻不確定櫃子裡是否已有相似的。", empathy: "你想撿到好物，也怕價格低讓自己忽略真正需求。", explain: "先看清現有物品，才知道是在補空缺還是收藏可能。", action: "拍下要放的櫃子，購買前對照尺寸、數量和用途。", reframe: "看見已擁有的，便宜就不會自動變成必須。", singleCta: "現有照", contentType: "二手選擇" },
  { category: "金錢價值觀", title: "出門前想帶很多現金時，先決定今天要它完成什麼", hook: "怕不夠用就多帶現金，回家又不知道花到哪裡嗎？", scene: "出門前你打開錢包，多拿幾張鈔票卻沒有特別用途。", empathy: "你想安心，也不想每次回頭看都覺得錢慢慢不見。", explain: "先替現金命名用途，選擇就多一個停看點。", action: "只帶今天三個用途的金額，另一筆留在家裡。", reframe: "安心可來自知道手上錢要陪你做什麼。", singleCta: "用途袋", contentType: "日常金錢" },
  { category: "親子關係", title: "晚餐不肯坐下時，先讓餐桌有一個可選的位置", hook: "叫孩子來吃飯一直沒反應，你是不是越催越覺得整桌都冷掉了？", scene: "飯菜上桌，孩子還在客廳地板玩，椅子空著沒人坐。", empathy: "你想一起吃，也怕晚點又要趕著收拾和睡覺。", explain: "從正在做的事切換過來，需要一個比較小的入口。", action: "讓他選平常位子或靠近你的位子先吃三口。", reframe: "第一步有選擇，靠近餐桌就更容易。", singleCta: "餐桌位", contentType: "用餐節奏" },
  { category: "親子關係", title: "孩子一直插話時，先教他把想說的話放在哪裡", hook: "你才講到一半就被打斷，最後連自己要說什麼都忘了嗎？", scene: "你正和家人說事情，孩子拉著袖子急著塞進一句話。", empathy: "你想讓他被聽見，也需要把眼前對話說完。", explain: "先給想法一個暫放位置，等待才會有方向。", action: "約定手放你手背或說記號詞，你說完先回他。", reframe: "替話留位子，彼此不用靠大聲被聽見。", singleCta: "等候記", contentType: "家庭對話" },
  { category: "親子關係", title: "洗澡前拖很久時，先讓身體選一個開始方式", hook: "一提洗澡就繼續拖，你是不是已開始倒數幾分鐘後要生氣？", scene: "浴室燈亮著，孩子抱著玩具坐沙發上說還不要。", empathy: "你想按時往下走，也不想每晚都拉著人進浴室。", explain: "先選一個身體能開始的小動作，比重複命令更能啟動。", action: "選自己走、抱浴巾跳三下，或牽手到門口。", reframe: "開始方式有彈性，洗澡仍能走到位。", singleCta: "浴室選", contentType: "晚間轉換" },
  { category: "親子關係", title: "孩子說今天很糟時，先不急著找原因", hook: "孩子一說今天很糟，你是不是馬上追問到底發生什麼事？", scene: "放學路上他盯著窗外，只說今天很糟就不再開口。", empathy: "你想知道他遇到什麼，也怕不問會錯過需要幫忙時刻。", explain: "有些感受先需要被放著，不一定能立刻整理成原因。", action: "問他想安靜、吃點東西，還是晚點再說。", reframe: "不急著把感受問成答案，也是在陪著它。", singleCta: "糟日句", contentType: "放學陪伴" },
  { category: "親子關係", title: "收玩具變拉鋸時，先替玩具找一個回家的起點", hook: "一說收玩具就像下命令，你是不是最後又自己全部撿完？", scene: "地毯散著積木和車子，收納籃在角落像不存在。", empathy: "你想恢復空間，也不想每次催促後更累。", explain: "先讓一類玩具有第一個回家處，行動比較容易啟動。", action: "只收車子進籃，再選收積木或一起休息。", reframe: "把收拾縮小，是讓合作有機會開始。", singleCta: "回家籃", contentType: "收納合作" },
  { category: "親子關係", title: "孩子在商店想買東西時，先幫他把想要放進清單", hook: "每次走進商店就想買，你是不是只剩下說今天不買？", scene: "收銀台旁玩具在視線高度，孩子停下來拿著不放。", empathy: "你想守住安排，也知道一直拒絕讓彼此越來越緊繃。", explain: "想要不必立刻購買，記下來能讓願望被看見。", action: "拍照寫進清單，回家再看用途與家裡是否已有。", reframe: "留下想要不等於答應買，拒絕不用丟掉感受。", singleCta: "想要單", contentType: "購物陪伴" },
  { category: "親子關係", title: "出門一直找不到鞋時，先固定一個回家放鞋動作", hook: "每次要出門才找鞋，你是不是已經在玄關開始急了？", scene: "時間快到，一隻鞋在沙發旁，另一隻不知道跑去哪裡。", empathy: "你怕遲到，也不想每天用責備作為出門開場。", explain: "找不到鞋常是回家時沒有同一個讓物品停下來的地方。", action: "回家把兩隻鞋一起放盒子，明天先去盒子找。", reframe: "固定路徑，早晨少一件要靠催促解決的事。", singleCta: "鞋盒點", contentType: "生活流程" },
  { category: "親子關係", title: "孩子不願分享時，先替他保留正在玩的回合", hook: "別的孩子一伸手就要分享，你是不是趕快替他答應了？", scene: "遊戲區裡有人靠近玩具，孩子把它抱在胸前不鬆手。", empathy: "你想顧到友善，也怕旁人覺得孩子不合群。", explain: "正在玩的東西可以先保留，分享不等於立刻交出去。", action: "幫他說：這回合玩完會放這裡，你可先選旁邊那個。", reframe: "保護投入的回合，也是在教關係裡可以輪流。", singleCta: "回合牌", contentType: "同儕互動" },
  { category: "親子關係", title: "睡前又想聊天時，先留一個明天可以接著說的記號", hook: "都關燈了孩子還想說話，你是不是一邊心軟一邊焦慮時間？", scene: "房間暗下來後，孩子從棉被探頭說還有一件事。", empathy: "你想聽他說，也知道再聊明早兩個人都會累。", explain: "想說的話可以被保存，不一定要在今晚全部講完。", action: "在紙條畫記號放床邊，早餐前從這件事開始。", reframe: "替明天留入口，結束不必像硬關掉話。", singleCta: "明日記", contentType: "睡前連結" },
  { category: "親子關係", title: "孩子弄倒東西時，先把收拾拆成兩個人都能做的部分", hook: "水一打翻你先吸一口氣，卻不知道先安撫還是先收拾嗎？", scene: "杯子倒了，水沿桌緣滴下來，孩子站在旁邊僵住。", empathy: "你怕一拖更亂，也不想讓意外變成不敢靠近你的時刻。", explain: "分配眼前能做的動作，能讓意外從責備變成共同回應。", action: "你拿布擋水，他拿紙巾或移開桌上物品。", reframe: "一起收拾，是讓責任有能走完的樣子。", singleCta: "分工擦", contentType: "意外回應" },
];

const formulaIndexes = new Map<string, number>();
export const dailyTopics20260823: Topic[] = drafts.map((draft, index) => {
  const { formula, formulaOrder } = formulaConfig[index % formulaConfig.length];
  const formulaIndex = (formulaIndexes.get(formula) ?? 0) + 1;
  formulaIndexes.set(formula, formulaIndex);
  const guardrail = guardrails[draft.category as Category];
  const thought = draft.hook.replace(/[，、。？！「」]/g, "");
  return { id: `D20260823-${String(index + 1).padStart(2, "0")}`, formula, formulaOrder, formulaIndex, category: draft.category, title: draft.title, hook: draft.hook, scene: draft.scene, angle: draft.explain, structure: "痛點開場 → 承接限制與情緒 → 白話拆解 → 一至三個低門檻選擇 → 轉念收尾 → 單一關鍵字 CTA", visual: `${draft.scene}畫面切到日常動作與一句關鍵文字，最後停在 CTA。`, cta: draft.singleCta, singleCta: draft.singleCta, risk: guardrail.risk, check: guardrail.check, series: `${draft.category}｜${formula}｜Keep 28 天影片語氣`, contentType: draft.contentType, empathy: draft.empathy, explain: draft.explain, action: draft.action, reframe: draft.reframe, storyline: `從「${draft.title}」的日常瞬間開始，承接「${draft.empathy}」，用「${draft.explain}」拆開卡點，給出「${draft.action}」，最後回到「${draft.reframe}」。`, storyElements: `場景：${draft.scene}｜心聲：${thought}｜行動：${draft.action}｜轉念：${draft.reframe}`, threeLayer: `痛點層：${draft.empathy}｜理解層：${draft.explain}｜選擇層：${draft.action}｜收束：${draft.reframe}` };
});
