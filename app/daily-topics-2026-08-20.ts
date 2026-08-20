import type { Topic } from "./topics";
import { dailyTopics20260819 } from "./daily-topics-2026-08-19";

type Category = "女性成長" | "金錢價值觀" | "親子關係";

type Draft = Pick<Topic, "category" | "title" | "hook" | "scene" | "empathy" | "explain" | "action" | "reframe" | "singleCta" | "contentType">;

const formulaConfig = dailyTopics20260819.slice(0, 8).map(({ formula, formulaOrder }) => ({ formula, formulaOrder }));

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
  { category: "女性成長", title: "被臨時塞任務時，先問交付標準", hook: "主管說『這個也順手處理』時，你又先把自己的工作往後排嗎？", scene: "下午三點，原本排好的工作表旁，多出一個沒有期限的新任務。", empathy: "你怕多問會顯得不積極，也怕自己默默接下後今晚又得加班。", explain: "先問清楚完成的樣子與期限，才知道它是不是現在最該優先的事。", action: "回覆兩句：這件事要在何時前完成？您期待我交到什麼程度？再一起排順序。", reframe: "把標準問清楚，是讓合作少猜一點，不是在增加麻煩。", singleCta: "標準", contentType: "職場界線" },
  { category: "女性成長", title: "升遷前，把你解的難題寫下來", hook: "績效要回顧時，你只記得自己很忙，卻想不起真正做成了什麼？", scene: "月末整理工作紀錄，你的行事曆很滿，成果欄卻一時空白。", empathy: "你做了很多幕後事，擔心說出來像在替自己邀功。", explain: "升遷對話看的是你處理過哪些重要問題，以及影響留下在哪裡。", action: "挑三件工作，各寫一行：原本卡在哪、你做了什麼、後來少了什麼麻煩。", reframe: "整理貢獻不是放大自己，而是讓能力有可以被討論的證據。", singleCta: "難題", contentType: "升遷準備" },
  { category: "女性成長", title: "談薪卡住時，先練習說出職責範圍", hook: "一被問到期待薪資，你就急著報一個讓大家都舒服的數字嗎？", scene: "面談桌上輪到薪資問題，你的手指在筆記本邊緣來回摩擦。", empathy: "你怕開太高被拒絕，也怕開太低之後一直覺得委屈。", explain: "先說明角色承擔的責任與你能帶來的貢獻，數字才有討論的脈絡。", action: "先練一句：這個角色包含 X、Y、Z 的責任，我想依這個範圍討論整體條件。", reframe: "談薪不是測試你敢不敢開價，而是練習讓工作內容被看見。", singleCta: "範圍", contentType: "談薪口條" },
  { category: "女性成長", title: "想轉職卻沒力氣，就先做一份離開清單", hook: "每天都說想換工作，回家卻連職缺都不想打開嗎？", scene: "晚餐後電腦開著求職網站，你卻一直停在首頁沒有往下看。", empathy: "你不是不想改變，只是現在的工作已經把能量用得差不多。", explain: "轉職不用先完成所有準備，先辨認什麼讓你想離開就能縮小方向。", action: "寫下三欄：想離開的工作情境、仍想保留的能力、下一份工作不想再有的條件。", reframe: "先把『不要什麼』說清楚，也是在替下一步留出位置。", singleCta: "離開", contentType: "職涯轉換" },
  { category: "女性成長", title: "自我介紹太長時，改講你幫誰解決什麼", hook: "介紹自己講了五分鐘，對方還是只記得你『什麼都會一點』？", scene: "線上交流輪到你發言，你把經歷一條條念完，聊天室卻沒有追問。", empathy: "你不想漏掉任何經驗，所以每一段都捨不得刪。", explain: "專業定位需要一個讓人容易轉述的入口，不是完整履歷的濃縮版。", action: "用一句話改寫：我主要協助哪一類人，處理哪一種反覆出現的問題。", reframe: "先讓人聽懂你現在最有用的地方，其他經驗才有機會被問到。", singleCta: "入口", contentType: "專業定位" },
  { category: "女性成長", title: "創業接案前，先決定這週不接什麼", hook: "每個詢問都怕錯過，結果這週又排滿了不想做的工作？", scene: "訊息列表一路往下滑，三個新邀約都在等你回覆。", empathy: "你想把機會接住，也怕拒絕後下一個案子不會來。", explain: "創業初期的選擇不只是在找客戶，也是在教別人怎麼和你合作。", action: "替這週設一條暫停線：超過可用時數、低於基本範圍或不符服務內容的詢問，先不答應。", reframe: "留出不接的空間，才能把答應的事做得更穩。", singleCta: "暫停線", contentType: "創業界線" },
  { category: "女性成長", title: "協作被催時，別急著說我會處理", hook: "同事一催進度，你是不是反射性先回『我來』？", scene: "群組跳出追問訊息，而你其實還在等另一份資料。", empathy: "你不想讓對方等，也不想看起來像在推責任。", explain: "協作裡先說出目前依賴什麼，能讓大家一起看見真正的卡點。", action: "回覆：我正在完成 A；B 資料到位後可在下午四點更新，若要更早請協助確認 B。", reframe: "說出依賴不是藉口，是把進度變成可一起處理的資訊。", singleCta: "依賴", contentType: "協作溝通" },
  { category: "女性成長", title: "第一次主持會議，先寫好今天要定的事", hook: "會議一開始就怕冷場，於是你把每個話題都撿進來嗎？", scene: "開會前五分鐘，你看著議程，心裡還在想會不會有人不說話。", empathy: "你想讓大家有參與感，又怕自己控場太明顯。", explain: "帶領會議不是把所有聲音收齊，而是讓大家知道這次要一起做哪個決定。", action: "開場先講：今天只要定一件事——X；討論時請各自帶一個可行選擇。", reframe: "目標清楚的會議，反而更有空間讓不同意見被好好聽見。", singleCta: "決定", contentType: "領導練習" },
  { category: "女性成長", title: "提案被退回時，先問哪一點需要重做", hook: "收到『請再調整』四個字，你就開始懷疑整份提案都不行嗎？", scene: "信箱裡只有一句修改意見，你盯著螢幕很久還沒敢打開檔案。", empathy: "你怕自己又漏了什麼，也怕重做後還是不符合期待。", explain: "模糊回饋容易讓人把問題擴大，先縮小要調整的範圍比較能動起來。", action: "回問兩個點：您最希望保留哪一部分？這次最需要調整的是目標、內容還是呈現？", reframe: "要求更清楚的回饋，是讓下一版更接近合作目標。", singleCta: "縮小", contentType: "工作自信" },
  { category: "女性成長", title: "被稱讚時，不必立刻把功勞推走", hook: "別人說你做得好，你第一句總是『沒有啦，大家幫很多』嗎？", scene: "專案結束後主管在會議上肯定你，你卻急著把視線移開。", empathy: "你怕承接稱讚會顯得高調，也真心知道不是自己一個人完成的。", explain: "承認自己的投入，和感謝團隊可以同時存在。", action: "練習回一句：謝謝，我在 X 上投入很多；也謝謝 Y 協助我把它完成。", reframe: "能平實地承接肯定，會讓你的專業形象更完整。", singleCta: "承接", contentType: "工作自信" },

  { category: "金錢價值觀", title: "想買療癒小物前，先分清楚是累還是想要", hook: "忙了一整天就想下單，你真正想補的是東西還是休息？", scene: "深夜滑購物網站，你的購物車裡多了幾樣『犒賞自己』。", empathy: "你只是想讓今天好過一點，卻又擔心買完會後悔。", explain: "疲累時的想買很真實，但它不一定只能靠結帳來回應。", action: "先選一個十分鐘選項：洗澡、走到樓下買飲料或關掉螢幕；十分鐘後再看購物車。", reframe: "照顧自己不必每次都變成一筆支出。", singleCta: "十分鐘", contentType: "情緒消費" },
  { category: "金錢價值觀", title: "收到紅包後，先別急著替它安排用途", hook: "突然多了一筆錢，你是不是立刻想拿來補每個想買的東西？", scene: "轉帳通知跳出來，你一邊開心，一邊開始在腦中分配。", empathy: "你不想浪費這份意外的餘裕，也怕放著最後就不知道花去哪。", explain: "剛收到的錢最容易被很多期待同時拉走，先停一下才能聽見自己真正重視什麼。", action: "把這筆錢單獨記一行，三天內只寫下想用它做什麼，先不做決定。", reframe: "暫時沒有用途，不代表你不會珍惜它。", singleCta: "三天", contentType: "金錢決策" },
  { category: "金錢價值觀", title: "聚餐前先說預算，不會破壞氣氛", hook: "朋友約高價餐廳，你明明有壓力卻只敢說都可以？", scene: "群組正在投票選餐廳，你看著價格卻遲遲沒有按下選項。", empathy: "你想一起參與，也怕講預算會讓大家覺得你掃興。", explain: "把自己的範圍說出來，讓大家有機會一起選，而不是讓你事後默默負擔。", action: "直接補一句：我這次比較想抓在 X 以內，有沒有同樣方便的選項？", reframe: "關係能容納不同預算，才不用靠勉強維持。", singleCta: "範圍說", contentType: "人際金錢" },
  { category: "金錢價值觀", title: "想換手機時，先寫下你現在真正卡的事", hook: "新機一發布就心癢，卻說不清楚舊的到底哪裡不夠用？", scene: "你反覆看開箱影片，手邊的手機其實還放在桌上好好的。", empathy: "你不想錯過更好的體驗，也不想每次都被新鮮感推著走。", explain: "把不滿意的使用情境寫出來，能分開『真的需要』和『只是想跟上』。", action: "列三個今天被舊手機卡住的瞬間；若寫不滿三個，就先把想換的念頭留一週。", reframe: "先理解自己的使用方式，比立刻替它升級更有方向。", singleCta: "卡點", contentType: "消費判斷" },
  { category: "金錢價值觀", title: "薪水一入帳就焦慮，先看哪件事最想守住", hook: "錢剛進來，你腦中先跳出的卻是下個月又要花多少嗎？", scene: "發薪日的早上，你看著帳戶餘額，心裡還是沒有比較放鬆。", empathy: "你知道自己一直在努力，卻很難感覺生活真的被支撐住。", explain: "安全感不只來自餘額，也來自你知道哪些日常最值得優先被照顧。", action: "今天只選一件最想守住的事，例如通勤、家人時間或休息，寫在本月支出頁最上方。", reframe: "有一個清楚的優先順序，焦慮就不必替你決定一切。", singleCta: "守住", contentType: "生活排序" },
  { category: "金錢價值觀", title: "不想記帳時，只記讓你意外的一筆", hook: "一想到要整理所有花費，你就決定明天再開始嗎？", scene: "月底打開記帳 App，密密麻麻的欄位讓你立刻想關掉。", empathy: "你不是不在乎錢，只是不想把生活變成每天的考試。", explain: "記錄不一定要從完整開始，先找到讓你意外的那筆就有線索。", action: "翻今天的消費通知，只圈出一筆你本來沒預期會花的錢，寫下當時發生什麼。", reframe: "看懂一筆支出，也比一直責備自己沒有全記更有用。", singleCta: "意外", contentType: "日常整理" },
  { category: "金錢價值觀", title: "看到限量贈品時，先問你本來會買嗎", hook: "為了贈品把購物車湊滿，最後連原本要買什麼都忘了？", scene: "結帳頁顯示還差一點就能拿到贈品，你開始搜尋可以加買什麼。", empathy: "你不想覺得自己吃虧，也怕錯過後會一直惦記。", explain: "贈品把注意力從原本需求移到門檻上，容易讓『多買』看起來像省到。", action: "先把頁面關掉，寫一句：沒有贈品時，我還會買哪一樣？只留下那一樣。", reframe: "不被門檻帶著走，是把選擇重新放回自己手上。", singleCta: "原本", contentType: "促銷判斷" },
  { category: "金錢價值觀", title: "和伴侶談日常花費，先談感受不是帳目", hook: "每次聊錢都變成對帳，你們其實想說的是不是不只數字？", scene: "晚餐後桌上放著帳單，兩個人都想開口卻不知道從哪一句開始。", empathy: "你怕一談就像在計較，也怕不談累積成更大的不舒服。", explain: "日常花費常碰到的是公平、安心和被理解，不只是哪一筆誰付。", action: "先各說一句：最近哪種花費讓我有壓力；我希望被怎麼一起考量。", reframe: "先把感受放到桌上，數字才有比較溫和的地方可以談。", singleCta: "感受", contentType: "關係溝通" },
  { category: "金錢價值觀", title: "想送自己大禮時，先替快樂取個名字", hook: "工作告一段落就想買個大的，卻又覺得自己好像不該？", scene: "你把一件喜歡很久的商品加入收藏，反覆打開又關掉。", empathy: "你想慶祝自己的努力，也怕這份快樂很快就被罪惡感蓋過。", explain: "當你知道自己想慶祝的是什麼，花錢就比較不必靠衝動替它命名。", action: "寫下：我想紀念的是哪件完成的事；再決定要用物品、吃一頓飯或留一段空白時間回應。", reframe: "慶祝不必有標準答案，重要的是它真的回應了你的努力。", singleCta: "命名", contentType: "犒賞價值觀" },
  { category: "金錢價值觀", title: "家人開口借用東西時，先別用內疚回答", hook: "家人一開口，你還沒想清楚就先說好，之後才覺得不舒服嗎？", scene: "電話裡傳來一個請求，你立刻開始盤算要怎麼配合。", empathy: "你不想讓關心變成拒絕，也擔心自己不答應會被誤解。", explain: "關係裡可以先確認自己能承擔的範圍，再決定怎麼回應。", action: "先說：我想一下今天晚點回你；接著寫下我可以提供的是時間、物品還是只是一起想辦法。", reframe: "先讓自己有思考空間，回應才不會變成事後的委屈。", singleCta: "想一下", contentType: "家庭界線" },

  { category: "親子關係", title: "孩子一回家就找螢幕，先別急著解讀", hook: "放學剛進門就想看影片，你第一句是不是又變成『先去做別的』？", scene: "書包剛放下，孩子已經拿起平板坐到沙發角落。", empathy: "你擔心時間一下就過去，也怕每天都從阻止開始。", explain: "先看見他正在從外面的節奏切回家裡，才能決定現在需要的是規則還是緩衝。", action: "先問：你想先安靜五分鐘，還是先吃點東西？再一起說好螢幕什麼時候開始。", reframe: "先給轉換的空間，不代表規則要消失。", singleCta: "緩衝", contentType: "放學互動" },
  { category: "親子關係", title: "孩子說不要穿這件，先讓選擇變小", hook: "出門前因為衣服卡住，你是不是已經快沒耐心了？", scene: "衣櫃前散著幾件衣服，時間卻一直往上課鐘聲靠近。", empathy: "你怕再拖就遲到，也希望孩子能學著配合行程。", explain: "選項太多時，孩子和大人都可能更難從情緒回到下一步。", action: "拿出兩件都合適的衣服，只問：今天想穿條紋還是素色？", reframe: "把選擇縮小，是在幫彼此回到可以合作的地方。", singleCta: "兩件", contentType: "出門準備" },
  { category: "親子關係", title: "孩子說今天很糟時，先別急著找原因", hook: "聽到『今天很糟』，你是不是立刻連問好幾個為什麼？", scene: "晚餐時孩子放下筷子，小聲說今天不想再提學校。", empathy: "你想知道發生什麼，也怕自己錯過需要幫忙的訊號。", explain: "有些時候先讓感受被放著，比立刻把事件拼完整更能讓對話繼續。", action: "先回：聽起來今天真的不容易；你想現在說一點，還是等吃完再說？", reframe: "不急著追問，也是在告訴孩子他的節奏可以被尊重。", singleCta: "節奏", contentType: "情緒承接" },
  { category: "親子關係", title: "孩子忘了帶東西時，先把當下走完", hook: "發現水壺還在家，你第一個念頭是不是『我早就說過』？", scene: "走到門口才看見孩子的水壺還放在餐桌上。", empathy: "你擔心他今天不方便，也覺得每天提醒真的很累。", explain: "當下先處理能不能帶回去，之後再想提醒方式，比邊趕路邊責備更有效率。", action: "先決定：現在回去拿、今天先用學校的，或放學再處理；晚上再一起選一個明天的提醒位置。", reframe: "把責備晚一點，能讓問題比較有機會真的被處理。", singleCta: "當下", contentType: "日常收拾" },
  { category: "親子關係", title: "孩子不肯關遊戲時，先預告下一個停點", hook: "每次一說關掉就拉扯，你是不是也不想再開口？", scene: "遊戲畫面還在進行，你站在旁邊已經提醒了第二次。", empathy: "你想守住時間，又不想總是變成打斷快樂的人。", explain: "正在投入時突然結束很難，先找到可預期的停點能讓轉換比較有準備。", action: "問：這一關結束還是這個任務完成後停？選一個，並把時間說清楚。", reframe: "可預期的結束，不會讓界線失去力量。", singleCta: "停點", contentType: "螢幕協調" },
  { category: "親子關係", title: "孩子不想吃時，先讓餐桌少一點壓力", hook: "孩子說不餓，你是不是馬上開始算他今天到底吃了多少？", scene: "晚餐已經擺好，孩子坐在椅子上卻只想玩湯匙。", empathy: "你怕他沒吃夠，也怕每餐都變成一場談判。", explain: "餐桌上的壓力一高，大家更難聽見身體和彼此真正的訊息。", action: "保留一樣他願意碰的食物，說：你可以先吃一口或先坐五分鐘，我們等一下再看。", reframe: "把餐桌留成能回來的地方，比一次吃完更重要。", singleCta: "回來", contentType: "用餐互動" },
  { category: "親子關係", title: "孩子弄壞東西時，先描述發生了什麼", hook: "聽到東西壞掉，你第一句是不是已經衝到『你怎麼又』？", scene: "積木倒下碰到花瓶，碎片散在地上，孩子愣在原地。", empathy: "你心疼物品，也被突如其來的收拾打亂了原本的節奏。", explain: "先描述眼前的事，能讓安全和收拾排在情緒判斷之前。", action: "先說：花瓶碎了，現在先不要踩；我們拿掃把和紙盒一起把這裡清開。", reframe: "把事情說清楚，不等於放過責任，而是讓責任有可做的下一步。", singleCta: "描述", contentType: "日常意外" },
  { category: "親子關係", title: "孩子不想被拍照時，可以先放下手機", hook: "全家難得出門，孩子卻躲鏡頭，你是不是覺得一張都拍不到很可惜？", scene: "景點前大家站好了，孩子卻把臉轉開說不要拍。", empathy: "你想留住回憶，也怕其他人等太久讓場面尷尬。", explain: "有些回憶不一定要立刻被拍下來，先尊重當下也能留下關係的安全感。", action: "先收起手機，說：好，那我們先走一圈；等你想拍或想當攝影師時再告訴我。", reframe: "放下鏡頭不是放掉回憶，而是先把人放在畫面前面。", singleCta: "鏡頭", contentType: "親子界線" },
  { category: "親子關係", title: "孩子和朋友鬧彆扭時，先陪他把話說順", hook: "孩子說不想再跟誰玩，你是不是急著教他要大方一點？", scene: "回家的路上，孩子悶著頭說今天和朋友吵架了。", empathy: "你希望他學會相處，也怕一句話說錯讓他更難過。", explain: "先把發生的事和不舒服的地方說順，才比較能看見下一次想怎麼做。", action: "依序問三句：發生什麼？哪一刻最不舒服？下次你想說哪一句？", reframe: "先幫孩子找到自己的話，不需要急著替他寫答案。", singleCta: "自己的話", contentType: "同儕互動" },
  { category: "親子關係", title: "孩子睡前忽然想聊天時，先約一小段時間", hook: "燈都關了才開始聊今天，你一邊想陪一邊又怕越聊越晚嗎？", scene: "你準備離開房間，孩子忽然說還有一件事想告訴你。", empathy: "你珍惜他願意開口，也真的需要今晚有一個結束。", explain: "給一段明確又可預期的陪伴時間，能同時照顧連結和休息。", action: "說：我可以再聽五分鐘，計時器響後我會幫你把最後一句記下來，明天再接著聊。", reframe: "有邊界的陪伴，不會減少你正在給的重視。", singleCta: "五分鐘", contentType: "睡前陪伴" },
];

const formulaIndexes = new Map<string, number>();

export const dailyTopics20260820: Topic[] = drafts.map((draft, index) => {
  const { formula, formulaOrder } = formulaConfig[index % formulaConfig.length];
  const formulaIndex = (formulaIndexes.get(formula) ?? 0) + 1;
  formulaIndexes.set(formula, formulaIndex);
  const guardrail = guardrails[draft.category as Category];
  const thought = draft.hook.replace(/[，、。？！「」]/g, "");

  return {
    id: `D20260820-${String(index + 1).padStart(2, "0")}`,
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
