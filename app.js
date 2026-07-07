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
const VALID_FINAL_RE = /^[a-z]+$/;
const MAX_NON_PATTERN_RESULTS = 140;
const THEME_STORAGE_KEY = "octopus-cantonese-theme";
const SCRIPT_STORAGE_KEY = "0243-script";
const STATIC_TRADITIONAL_PAIRS = {
  万: "萬",
  与: "與",
  专: "專",
  业: "業",
  东: "東",
  丝: "絲",
  丢: "丟",
  两: "兩",
  严: "嚴",
  丧: "喪",
  个: "個",
  临: "臨",
  为: "為",
  义: "義",
  乌: "烏",
  乐: "樂",
  习: "習",
  书: "書",
  买: "買",
  乱: "亂",
  争: "爭",
  于: "於",
  云: "雲",
  亚: "亞",
  产: "產",
  亲: "親",
  从: "從",
  仑: "侖",
  仓: "倉",
  仪: "儀",
  们: "們",
  价: "價",
  众: "眾",
  优: "優",
  会: "會",
  传: "傳",
  伤: "傷",
  伦: "倫",
  伪: "偽",
  体: "體",
  余: "餘",
  侠: "俠",
  侣: "侶",
  侥: "僥",
  侦: "偵",
  侧: "側",
  俩: "倆",
  俭: "儉",
  债: "債",
  倾: "傾",
  偿: "償",
  储: "儲",
  儿: "兒",
  兑: "兌",
  党: "黨",
  兰: "蘭",
  关: "關",
  兴: "興",
  养: "養",
  兽: "獸",
  内: "內",
  冈: "岡",
  册: "冊",
  写: "寫",
  军: "軍",
  农: "農",
  决: "決",
  况: "況",
  冻: "凍",
  净: "淨",
  准: "準",
  几: "幾",
  凤: "鳳",
  凭: "憑",
  凯: "凱",
  击: "擊",
  凿: "鑿",
  划: "劃",
  刘: "劉",
  则: "則",
  刚: "剛",
  创: "創",
  删: "刪",
  别: "別",
  剂: "劑",
  剑: "劍",
  剧: "劇",
  劝: "勸",
  办: "辦",
  务: "務",
  动: "動",
  励: "勵",
  劲: "勁",
  劳: "勞",
  势: "勢",
  勋: "勳",
  区: "區",
  医: "醫",
  华: "華",
  协: "協",
  单: "單",
  卖: "賣",
  卢: "盧",
  卫: "衛",
  厂: "廠",
  厅: "廳",
  历: "歷",
  压: "壓",
  厌: "厭",
  厕: "廁",
  厢: "廂",
  厦: "廈",
  厨: "廚",
  县: "縣",
  参: "參",
  双: "雙",
  发: "發",
  变: "變",
  叙: "敘",
  叠: "疊",
  叶: "葉",
  号: "號",
  叹: "嘆",
  后: "後",
  吓: "嚇",
  吕: "呂",
  吗: "嗎",
  听: "聽",
  启: "啟",
  吴: "吳",
  员: "員",
  呗: "唄",
  咏: "詠",
  咙: "嚨",
  咛: "嚀",
  咸: "鹹",
  响: "響",
  哑: "啞",
  哗: "嘩",
  哟: "喲",
  唤: "喚",
  啬: "嗇",
  啭: "囀",
  啮: "齧",
  啰: "囉",
  啸: "嘯",
  喷: "噴",
  嗳: "噯",
  嘘: "噓",
  嘤: "嚶",
  嘱: "囑",
  团: "團",
  园: "園",
  围: "圍",
  图: "圖",
  圆: "圓",
  圣: "聖",
  坚: "堅",
  坛: "壇",
  坝: "壩",
  坞: "塢",
  坟: "墳",
  坠: "墜",
  垄: "壟",
  垒: "壘",
  垦: "墾",
  垩: "堊",
  垫: "墊",
  垭: "埡",
  垱: "壋",
  垲: "塏",
  垴: "堖",
  埘: "塒",
  埙: "塤",
  埚: "堝",
  埝: "墊",
  埯: "垵",
  堑: "塹",
  堕: "墮",
  墙: "牆",
  壮: "壯",
  声: "聲",
  壳: "殼",
  处: "處",
  备: "備",
  复: "復",
  够: "夠",
  头: "頭",
  夹: "夾",
  夺: "奪",
  奋: "奮",
  奖: "獎",
  奥: "奧",
  妆: "妝",
  妇: "婦",
  妈: "媽",
  妩: "嫵",
  妪: "嫗",
  姗: "姍",
  姜: "薑",
  娄: "婁",
  娅: "婭",
  娆: "嬈",
  娇: "嬌",
  娈: "孌",
  娱: "娛",
  婴: "嬰",
  婵: "嬋",
  婶: "嬸",
  媪: "媼",
  嫒: "嬡",
  嫔: "嬪",
  嫱: "嬙",
  孙: "孫",
  学: "學",
  宁: "寧",
  宝: "寶",
  实: "實",
  宠: "寵",
  审: "審",
  宪: "憲",
  宫: "宮",
  宽: "寬",
  宾: "賓",
  寝: "寢",
  对: "對",
  寻: "尋",
  导: "導",
  寿: "壽",
  将: "將",
  尔: "爾",
  尘: "塵",
  尝: "嘗",
  尧: "堯",
  尴: "尷",
  尸: "屍",
  尽: "盡",
  层: "層",
  屉: "屜",
  属: "屬",
  屡: "屢",
  岁: "歲",
  岂: "豈",
  岖: "嶇",
  岗: "崗",
  岘: "峴",
  岚: "嵐",
  岛: "島",
  岭: "嶺",
  岳: "嶽",
  峡: "峽",
  峣: "嶢",
  峤: "嶠",
  峥: "崢",
  峦: "巒",
  巅: "巔",
  巩: "鞏",
  币: "幣",
  帅: "帥",
  师: "師",
  帐: "帳",
  带: "帶",
  帧: "幀",
  帮: "幫",
  帱: "幬",
  干: "幹",
  并: "並",
  广: "廣",
  庆: "慶",
  庐: "廬",
  庑: "廡",
  库: "庫",
  应: "應",
  庙: "廟",
  废: "廢",
  庼: "廎",
  开: "開",
  异: "異",
  弃: "棄",
  张: "張",
  弥: "彌",
  弯: "彎",
  弹: "彈",
  强: "強",
  归: "歸",
  当: "當",
  录: "錄",
  彦: "彥",
  彻: "徹",
  征: "徵",
  径: "徑",
  徕: "徠",
  忆: "憶",
  忏: "懺",
  忧: "憂",
  忾: "愾",
  怀: "懷",
  态: "態",
  怂: "慫",
  怃: "憮",
  怄: "慪",
  怅: "悵",
  怆: "愴",
  怜: "憐",
  总: "總",
  恋: "戀",
  恳: "懇",
  恶: "惡",
  恸: "慟",
  恹: "懨",
  恺: "愷",
  恻: "惻",
  恼: "惱",
  悦: "悅",
  悯: "憫",
  惊: "驚",
  惧: "懼",
  惨: "慘",
  惩: "懲",
  惫: "憊",
  惬: "愜",
  惭: "慚",
  惮: "憚",
  惯: "慣",
  愤: "憤",
  愿: "願",
  慑: "懾",
  慭: "憖",
  憩: "憩",
  懒: "懶",
  戏: "戲",
  户: "戶",
  扑: "撲",
  执: "執",
  扩: "擴",
  扪: "捫",
  扫: "掃",
  扬: "揚",
  扰: "擾",
  抚: "撫",
  抛: "拋",
  抟: "摶",
  抠: "摳",
  抡: "掄",
  抢: "搶",
  护: "護",
  报: "報",
  担: "擔",
  拟: "擬",
  拢: "攏",
  拣: "揀",
  拥: "擁",
  拦: "攔",
  拧: "擰",
  拨: "撥",
  择: "擇",
  挂: "掛",
  挚: "摯",
  挛: "攣",
  挜: "掗",
  挝: "撾",
  挞: "撻",
  挟: "挾",
  挠: "撓",
  挡: "擋",
  挢: "撟",
  挣: "掙",
  挤: "擠",
  挥: "揮",
  挦: "撏",
  挽: "輓",
  捞: "撈",
  损: "損",
  捡: "撿",
  换: "換",
  捣: "搗",
  据: "據",
  掳: "擄",
  掴: "摑",
  掷: "擲",
  掸: "撣",
  掺: "摻",
  掼: "摜",
  揽: "攬",
  揾: "搵",
  揿: "撳",
  搀: "攙",
  搁: "擱",
  搂: "摟",
  搅: "攪",
  携: "攜",
  摄: "攝",
  摆: "擺",
  摇: "搖",
  摈: "擯",
  摊: "攤",
  撑: "撐",
  撵: "攆",
  撷: "擷",
 撸: "擼",
  撺: "攛",
  擞: "擻",
  攒: "攢",
  敌: "敵",
  敛: "斂",
  数: "數",
  斋: "齋",
  斓: "斕",
  斗: "鬥",
  斩: "斬",
  断: "斷",
  无: "無",
  旧: "舊",
  时: "時",
  旷: "曠",
  昙: "曇",
  昼: "晝",
  显: "顯",
  晋: "晉",
  晒: "曬",
  晓: "曉",
  晔: "曄",
  晕: "暈",
  暂: "暫",
  暧: "曖",
  术: "術",
  机: "機",
  杀: "殺",
  杂: "雜",
  权: "權",
  杆: "桿",
  条: "條",
  来: "來",
  杨: "楊",
  杩: "榪",
  杰: "傑",
  极: "極",
  构: "構",
  枞: "樅",
  枢: "樞",
  枣: "棗",
  枥: "櫪",
  枧: "梘",
  枨: "棖",
  枪: "槍",
  枫: "楓",
  枭: "梟",
  柜: "櫃",
  柠: "檸",
  柽: "檉",
  栀: "梔",
  栅: "柵",
  标: "標",
  栈: "棧",
  栉: "櫛",
  栊: "櫳",
  栋: "棟",
  栌: "櫨",
  栎: "櫟",
  栏: "欄",
  树: "樹",
  栖: "棲",
  样: "樣",
  栾: "欒",
  桠: "椏",
  桡: "橈",
  桢: "楨",
  档: "檔",
  桤: "榿",
  桥: "橋",
  桦: "樺",
  桧: "檜",
  桨: "槳",
  桩: "樁",
  梦: "夢",
  梼: "檮",
  梾: "棶",
  检: "檢",
  棂: "欞",
  椁: "槨",
  椟: "櫝",
  椠: "槧",
  椤: "欏",
  楼: "樓",
  榄: "欖",
  榅: "榲",
  榇: "櫬",
  榈: "櫚",
  榉: "櫸",
  槚: "檟",
  槛: "檻",
  槟: "檳",
  槠: "櫧",
  横: "橫",
  樯: "檣",
  樱: "櫻",
  橥: "櫫",
  橱: "櫥",
  橹: "櫓",
  橼: "櫞",
  檐: "簷",
  欠: "欠",
  欧: "歐",
  欤: "歟",
  欢: "歡",
  步: "步",
  歼: "殲",
  殁: "歿",
  殇: "殤",
  残: "殘",
  殒: "殞",
  殓: "殮",
  殚: "殫",
  殡: "殯",
  殴: "毆",
  毕: "畢",
  毙: "斃",
  毡: "氈",
  毵: "毿",
  气: "氣",
  氢: "氫",
  氩: "氬",
  氲: "氳",
  汉: "漢",
  汤: "湯",
  汹: "洶",
  沟: "溝",
  没: "沒",
  沣: "灃",
  沤: "漚",
  沥: "瀝",
  沦: "淪",
  沧: "滄",
  沨: "渢",
  沪: "滬",
  泞: "濘",
  泪: "淚",
  泶: "澩",
  泷: "瀧",
  泸: "瀘",
  泺: "濼",
  泻: "瀉",
  泼: "潑",
  泽: "澤",
  泾: "涇",
  洁: "潔",
  洒: "灑",
  洼: "窪",
  浅: "淺",
  浆: "漿",
  浇: "澆",
  浈: "湞",
  浊: "濁",
  测: "測",
  济: "濟",
  浏: "瀏",
  浑: "渾",
  浒: "滸",
  浓: "濃",
  浔: "潯",
  涛: "濤",
  涝: "澇",
  涞: "淶",
  涟: "漣",
  涠: "潿",
  涡: "渦",
  涢: "溳",
  涣: "渙",
  涤: "滌",
  润: "潤",
  涧: "澗",
  涨: "漲",
  涩: "澀",
  淀: "澱",
  渊: "淵",
  渌: "淥",
  渍: "漬",
  渎: "瀆",
  渐: "漸",
  渑: "澠",
  渔: "漁",
  渗: "滲",
  温: "溫",
  游: "遊",
  湾: "灣",
  湿: "濕",
  溃: "潰",
  溅: "濺",
  滚: "滾",
  滞: "滯",
  满: "滿",
  滤: "濾",
  滥: "濫",
  滨: "濱",
  滩: "灘",
  潇: "瀟",
  语: "語",
  词: "詞",
  粤: "粵",
  韵: "韻",
  简: "簡",
  搜: "搜",
  索: "索",
  筛: "篩",
  选: "選",
  类: "類",
  绪: "緒",
  频: "頻",
  序: "序",
  缩: "縮",
  范: "範",
  输: "輸",
  询: "詢",
  项: "項",
  读: "讀",
  载: "載",
  败: "敗",
  复: "複",
  制: "製",
  里: "裡",
  么: "麼",
  这: "這",
  那: "那",
  还: "還",
  觉: "覺",
  记: "記",
  结: "結",
  婚: "婚",
  开: "開",
  发: "發",
  遗: "遺",
  憾: "憾",
};
const TRADITIONAL_IDENTITY_OVERRIDES = ["查"];

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
  officialEntries: [],
  termFinalIndex: new Map(),
  patternIndex: new Map(),
  cloudSearch: "",
  cloudFacet: "all",
  cloudCategory: "all",
  theme: "dark",
  script: "simplified",
  toSimplified: new Map(),
  toTraditional: new Map(),
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
  scriptToggle: document.querySelector("#scriptToggle"),
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

function registerScriptPair(simplified, traditional) {
  if (!simplified || !traditional || simplified === traditional) return;
  state.toTraditional.set(simplified, traditional);
  state.toSimplified.set(traditional, simplified);
}

function registerStringVariants(simplified, traditional) {
  if (!simplified || !traditional || simplified.length !== traditional.length) return;
  for (let index = 0; index < simplified.length; index += 1) {
    registerScriptPair(simplified[index], traditional[index]);
  }
}

function buildScriptMaps(entries, officialPatterns) {
  state.toSimplified.clear();
  state.toTraditional.clear();
  for (const [simplified, traditional] of Object.entries(STATIC_TRADITIONAL_PAIRS)) {
    registerScriptPair(simplified, traditional);
  }
  entries.forEach((entry) => registerStringVariants(entry.s || "", entry.t || ""));
  Object.values(officialPatterns || {})
    .flat()
    .forEach((word) => registerStringVariants(word.s || "", word.t || ""));
  TRADITIONAL_IDENTITY_OVERRIDES.forEach((char) => state.toTraditional.set(char, char));
  cloudClassCache.clear();
}

function convertScriptText(value, target) {
  const source = String(value || "");
  const map = target === "traditional" ? state.toTraditional : state.toSimplified;
  return Array.from(source, (char) => map.get(char) || char).join("");
}

function simplifyText(value) {
  return convertScriptText(value, "simplified");
}

function traditionalizeText(value) {
  return convertScriptText(value, "traditional");
}

function scriptText(value) {
  return state.script === "traditional" ? traditionalizeText(value) : simplifyText(value);
}

function displayEntryTerm(entry) {
  if (state.script === "traditional") return entry.t || traditionalizeText(entry.s || "");
  return entry.s || simplifyText(entry.t || "");
}

function displayCloudWord(simplified, traditional) {
  if (state.script === "traditional") return traditional || traditionalizeText(simplified || "");
  return simplified || simplifyText(traditional || "");
}

function buildOfficialEntries(patterns) {
  const entries = [];
  for (const [pattern, words] of Object.entries(patterns || {})) {
    for (const word of words || []) {
      const simplified = word.s || simplifyText(word.t || "");
      const traditional = word.t || traditionalizeText(simplified);
      if (!simplified && !traditional) continue;
      entries.push({
        simplified,
        traditional,
        original: word.t || word.s,
        pattern,
        rank: word.rank || entries.length + 1,
        length: cjkOnly(simplified || traditional).length,
      });
    }
  }
  return entries.sort((left, right) => {
    if (left.pattern !== right.pattern) return left.pattern.localeCompare(right.pattern);
    return left.rank - right.rank;
  });
}

function officialCloudResult(item, score, extras = {}) {
  return {
    type: "cloud",
    word: displayCloudWord(item.simplified, item.traditional),
    simplified: item.simplified,
    traditional: item.traditional,
    original: item.original || item.traditional || item.simplified,
    rank: item.rank,
    pattern: item.pattern,
    score,
    ...extras,
  };
}

function officialSearchResult(item, score) {
  return {
    type: "official",
    word: displayCloudWord(item.simplified, item.traditional),
    simplified: item.simplified,
    traditional: item.traditional,
    original: item.original || item.traditional || item.simplified,
    rank: item.rank,
    pattern: item.pattern,
    score,
    length: item.length,
  };
}

function officialTermFinals(item) {
  const exact = new Set();
  [item.traditional, item.simplified].forEach((term) => {
    for (const final of indexedTermFinals(term)) {
      exact.add(final);
    }
  });
  if (exact.size) return exact;
  return finalsForCjkTerm(item.simplified || item.traditional);
}

function scoreOfficialWord(item, needles, normalizedNeedle) {
  const texts = [
    item.traditional || "",
    item.simplified || "",
    simplifyText(item.traditional || ""),
    traditionalizeText(item.simplified || ""),
  ].filter(Boolean);
  let base = 0;
  if (texts.some((text) => needles.includes(text))) base = 9000;
  else if (texts.some((text) => needles.some((value) => text.startsWith(value)))) base = 7600;
  else if (texts.some((text) => needles.some((value) => text.includes(value)))) base = 6200;
  else if ([...normalizedNeedle].every((char) => simplifyText(`${item.simplified}${item.traditional}`).includes(char))) base = 2600;
  if (!base) return 0;
  return base - item.length * 4 - item.rank / 100;
}

function scriptVariants(value) {
  const variants = new Set();
  const text = String(value || "");
  if (!text) return variants;
  variants.add(text);
  variants.add(simplifyText(text));
  variants.add(traditionalizeText(text));
  return variants;
}

function readingsForChar(char) {
  const readings = [];
  const seen = new Set();
  for (const variant of scriptVariants(char)) {
    for (const reading of state.chars[variant] || []) {
      const key = `${reading.j}-${reading.p}-${reading.f}`;
      if (seen.has(key)) continue;
      seen.add(key);
      readings.push(reading);
    }
  }
  return readings;
}

function addTermFinal(index, term, final) {
  const cleanedFinal = cleanFinal(final);
  const pure = cjkOnly(term || "");
  if (!cleanedFinal || !pure) return;
  for (const variant of scriptVariants(pure)) {
    const key = cjkOnly(variant);
    if (!key) continue;
    const finals = index.get(key) || new Set();
    finals.add(cleanedFinal);
    index.set(key, finals);
  }
}

function buildTermFinalIndex(entries) {
  const index = new Map();
  entries.forEach((entry) => {
    if (!entry.f) return;
    addTermFinal(index, entry.t, entry.f);
    addTermFinal(index, entry.s, entry.f);
  });
  return index;
}

function indexedTermFinals(term) {
  const finals = new Set();
  const pure = cjkOnly(term || "");
  if (!pure) return finals;
  for (const variant of scriptVariants(pure)) {
    for (const final of state.termFinalIndex.get(cjkOnly(variant)) || []) {
      finals.add(final);
    }
  }
  return finals;
}

function primaryFinalsForChar(char) {
  const finals = new Set();
  const readings = readingsForChar(char).filter((reading) => cleanFinal(reading.f));
  if (!readings.length) return finals;
  const topCount = Math.max(...readings.map((reading) => Number(reading.n) || 0));
  const primary = topCount > 0 ? readings.filter((reading) => (Number(reading.n) || 0) === topCount) : readings.slice(0, 1);
  primary.forEach((reading) => finals.add(cleanFinal(reading.f)));
  return finals;
}

function finalsForCjkTerm(term) {
  const chars = Array.from(cjkOnly(term || ""));
  if (!chars.length) return new Set();
  if (chars.length === 1) return primaryFinalsForChar(chars[0]);
  const indexed = indexedTermFinals(term);
  if (indexed.size) return indexed;
  const last = chars[chars.length - 1];
  return last ? primaryFinalsForChar(last) : new Set();
}

function updateStaticText() {
  document.documentElement.lang = state.script === "traditional" ? "zh-Hant" : "zh-Hans";
  document.documentElement.dataset.script = state.script;
  document.title = scriptText("八爪鱼粤语填词");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.dataset.sourceText ||= node.textContent;
    node.textContent = scriptText(node.dataset.sourceText);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.dataset.sourcePlaceholder ||= node.getAttribute("placeholder") || "";
    node.setAttribute("placeholder", scriptText(node.dataset.sourcePlaceholder));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.dataset.sourceTitle ||= node.getAttribute("title") || "";
    node.setAttribute("title", scriptText(node.dataset.sourceTitle));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.dataset.sourceAria ||= node.getAttribute("aria-label") || "";
    node.setAttribute("aria-label", scriptText(node.dataset.sourceAria));
  });
  els.samples.forEach((button) => {
    button.textContent = scriptText(button.dataset.query);
  });
}

function updateStats() {
  if (!state.metadata) return;
  const officialCount = state.officialEntries.length || state.metadata.entryCount;
  els.entryCount.textContent = scriptText(`${officialCount.toLocaleString()} 词库项`);
  els.charCount.textContent = scriptText(`${state.metadata.charCount.toLocaleString()} 单字`);
}

function applyScript(script, options = {}) {
  state.script = script === "traditional" ? "traditional" : "simplified";
  updateStaticText();
  updateStats();
  if (els.scriptToggle) {
    const nextLabel = state.script === "traditional" ? "简" : "繁";
    const title = state.script === "traditional" ? "切换简体显示" : "切换繁体显示";
    els.scriptToggle.textContent = scriptText(nextLabel);
    els.scriptToggle.title = scriptText(title);
    els.scriptToggle.setAttribute("aria-label", scriptText(title));
  }
  if (options.convertInputs) {
    state.query = scriptText(state.query);
    state.cloudSearch = scriptText(state.cloudSearch);
    els.input.value = state.query;
    els.cloudSearch.value = state.cloudSearch;
  }
  applyTheme(state.theme);
  render();
}

function initScript() {
  const saved = window.localStorage.getItem(SCRIPT_STORAGE_KEY);
  applyScript(saved === "traditional" ? "traditional" : "simplified");
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function categoryMatchesWord(word, category) {
  const normalized = simplifyText(word);
  return includesAny(normalized, CLOUD_KEYWORDS[category] || []) || includesAny(normalized, CLOUD_ROOT_KEYWORDS[category] || []);
}

function pushUnique(items, value) {
  if (!items.includes(value)) items.push(value);
}

function cloudItemText(item) {
  return simplifyText(
    `${item.word || ""} ${item.simplified || ""} ${item.traditional || ""} ${item.original || ""} ${item.pattern || ""} ${item.final || ""} ${item.jyutping || ""}`,
  ).toLowerCase();
}

function semanticBundleForSearch(value) {
  const raw = simplifyText(value).trim().toLowerCase();
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
  const word = simplifyText(`${item.word || ""} ${item.simplified || ""} ${item.traditional || ""} ${item.original || ""}`).toLowerCase();
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
    return scriptText(mode === "rhyme"
      ? "按0243与韵母匹配排序，可用搜索或近义意图缩小范围"
      : "按官方词频排序，可用搜索或近义意图缩小范围");
  }
  if (!bundle.labels.length) return scriptText("正在按字面搜索当前词云");
  const preview = bundle.terms.filter((term) => term !== bundle.raw).slice(0, 7);
  const roots = bundle.roots.slice(0, 8).join("、");
  return scriptText(`近义扩展：${bundle.labels.join("、")} · ${preview.join("、")}${roots ? ` · 字根 ${roots}` : ""}`);
}

function classifyCloudWord(word) {
  const cacheKey = simplifyText(word);
  if (cloudClassCache.has(cacheKey)) return cloudClassCache.get(cacheKey);
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
  cloudClassCache.set(cacheKey, result);
  return result;
}

function cloudCategoriesFor(item, facet) {
  if (facet === "pos" || facet === "emotion") {
    return classifyCloudWord(item.word || "")[facet] || [];
  }
  return ["all"];
}

function cloudCategoryDefs() {
  if (state.cloudFacet === "pos") return CLOUD_POS_CATEGORIES.map((category) => ({ ...category, label: scriptText(category.label) }));
  if (state.cloudFacet === "emotion") return CLOUD_EMOTION_CATEGORIES.map((category) => ({ ...category, label: scriptText(category.label) }));
  return [{ id: "all", label: scriptText("全部") }];
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

function cleanFinal(final) {
  const normalized = String(final || "").trim().toLowerCase().replace(/[1-6]/g, "");
  return VALID_FINAL_RE.test(normalized) ? normalized : "";
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
  els.themeToggle.title = scriptText(state.theme === "dark" ? "切换浅色模式" : "切换深色模式");
  els.themeToggle.setAttribute("aria-label", els.themeToggle.title);
}

function initTheme() {
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(saved === "light" ? "light" : "dark");
}

function prepareEntry(entry, index) {
  const term = entry.t || "";
  const simplified = entry.s || "";
  const jyutping = entry.j || "";
  const noTone = jyutping.replace(/[1-6]/g, "");
  const simplifiedTerm = simplifyText(term || simplified);
  const traditionalTerm = traditionalizeText(simplified || term);
  return {
    ...entry,
    id: index,
    pure: cjkOnly(`${term}${simplified}${simplifiedTerm}${traditionalTerm}`),
    q: `${term} ${simplified} ${simplifiedTerm} ${traditionalTerm} ${jyutping} ${noTone} ${entry.p || ""} ${entry.f || ""}`.toLowerCase(),
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
  state.chars = lexicon.chars || {};
  state.metadata = metadata;
  state.officialCloud = officialCloud.patterns || {};
  buildScriptMaps(lexicon.entries, state.officialCloud);
  state.termFinalIndex = buildTermFinalIndex(lexicon.entries);
  state.officialEntries = buildOfficialEntries(state.officialCloud);
  state.entries = lexicon.entries.map(prepareEntry);
  state.patternIndex = buildPatternIndex(state.entries);
  updateStats();
  applyScript(state.script);
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
    for (const final of finalsForCjkTerm(cleaned)) {
      finals.add(final);
    }
    return finals;
  }

  const latin = normalizeLatin(cleaned);
  const parts = latin.split(/\s+/).filter(Boolean);
  for (const part of parts.length ? parts : [latin]) {
    const final = cleanFinal(finalForSyllable(part));
    if (final) finals.add(final);
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
  if (!Object.hasOwn(state.officialCloud, pattern)) return [];

  const results = state.officialEntries
    .filter((item) => item.pattern === pattern)
    .map((item) => officialCloudResult(item, 9000 - item.rank));

  if (state.loose) {
    for (const item of state.officialEntries) {
      if (item.pattern !== pattern && item.pattern.includes(pattern)) {
        results.push(officialCloudResult(item, 4200 - item.rank / 10));
      }
    }
  }

  return results.sort(sortResults);
}

function cloudResultFromEntry(entry, rank, score) {
  return {
    type: "cloud",
    entry,
    word: displayEntryTerm(entry),
    simplified: entry.s || simplifyText(entry.t || ""),
    traditional: entry.t || traditionalizeText(entry.s || ""),
    original: entry.t || entry.s,
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

  if (!Object.hasOwn(state.officialCloud, pattern)) return [];

  return state.officialEntries
    .filter((item) => item.pattern === pattern)
    .map((item) => {
      const matchedFinal = Array.from(officialTermFinals(item)).find((final) => finals.has(final));
      if (!matchedFinal) return null;
      return officialCloudResult(item, 9400 - item.rank, { final: matchedFinal });
    })
    .filter(Boolean)
    .sort(sortResults);
}

function searchChinese(query) {
  const needle = cjkOnly(query);
  if (!needle) return [];
  const needles = Array.from(scriptVariants(needle)).filter(Boolean);
  const normalizedNeedle = simplifyText(needle);

  return state.officialEntries
    .map((item) => {
      const score = scoreOfficialWord(item, needles, normalizedNeedle);
      return score ? officialSearchResult(item, score) : null;
    })
    .filter(Boolean)
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
  const leftLength = left.entry?.l ?? left.length ?? cjkOnly(left.simplified || left.word || "").length;
  const rightLength = right.entry?.l ?? right.length ?? cjkOnly(right.simplified || right.word || "").length;
  if (leftLength !== rightLength) return leftLength - rightLength;
  const leftText = left.entry?.t || left.traditional || left.word || "";
  const rightText = right.entry?.t || right.traditional || right.word || "";
  return leftText.localeCompare(rightText, "zh-Hans");
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
    const readings = readingsForChar(char);
    const displayChar = scriptText(char);
    if (!readings.length) {
      chips.push(`<span class="chip warn"><strong>${escapeHtml(displayChar)}</strong>${escapeHtml(scriptText("未收录"))}</span>`);
      continue;
    }
    const best = readings[0];
    pattern.push(best.p);
    chips.push(
      `<span class="chip"><strong>${escapeHtml(displayChar)}</strong>${escapeHtml(best.j)} · ${escapeHtml(best.p)} · ${escapeHtml(best.f)}</span>`,
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
    return `<div class="analysis-line"><span class="chip"><strong>0243</strong>${escapeHtml(pattern)}</span><span class="chip"><strong>${escapeHtml(scriptText("字数"))}</strong>${pattern.length}</span></div>`;
  }
  if (mode === "rhyme") {
    const match = trimmed.match(/^([0243]+)(.+)$/);
    if (!match) return "";
    const finals = Array.from(finalsFromSuffix(match[2]));
    return `<div class="analysis-line"><span class="chip"><strong>0243</strong>${escapeHtml(match[1])}</span><span class="chip"><strong>${escapeHtml(scriptText("韵"))}</strong>${escapeHtml(finals.join(" / ") || scriptText(match[2]))}</span></div>`;
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
  if (item.type === "official") return renderOfficialResult(item);
  const entry = item.entry;
  const definition = entry.d ? `<p class="definition">${escapeHtml(entry.d)}</p>` : "";
  const sourceLabel = state.metadata?.sourceLabels?.[entry.src] || entry.src || "";
  const displayTerm = displayEntryTerm(entry);
  return `
    <article class="result-card">
      <div>
        <div class="term-row">
          <span class="term">${escapeHtml(displayTerm)}</span>
          <span class="pattern">${escapeHtml(entry.p)}</span>
          <span class="chip">${escapeHtml(scriptText("韵"))} ${escapeHtml(entry.f || "-")}</span>
        </div>
        <p class="jyutping">${escapeHtml(entry.j)}</p>
        ${definition}
        <p class="source">${escapeHtml(sourceLabel)}</p>
      </div>
      <button class="copy-button" type="button" title="复制" data-copy="${escapeHtml(displayTerm)}">⧉</button>
    </article>
  `;
}

function renderOfficialResult(item) {
  const displayTerm = displayCloudWord(item.simplified, item.traditional);
  const source = scriptText(`0243.hk 词库 · 第 ${item.rank} 位`);
  return `
    <article class="result-card">
      <div>
        <div class="term-row">
          <span class="term">${escapeHtml(displayTerm)}</span>
          <span class="pattern">${escapeHtml(item.pattern)}</span>
          <span class="chip">${escapeHtml(source)}</span>
        </div>
        <p class="source">${escapeHtml(scriptText("按 0243.hk 词频排序"))}</p>
      </div>
      <button class="copy-button" type="button" title="${escapeHtml(scriptText("复制"))}" data-copy="${escapeHtml(displayTerm)}">⧉</button>
    </article>
  `;
}

function renderCloudTile(item) {
  const classes = classifyCloudWord(item.word || "");
  const rhyme = item.final ? ` · ${scriptText("韵")} ${item.final}` : "";
  const jyutping = item.jyutping ? ` · ${item.jyutping}` : "";
  const title = scriptText(`第 ${item.rank} 位 · ${item.pattern || ""}${rhyme}${jyutping} · ${classes.pos.join("/")} · ${classes.emotion.join("/")}`);
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
  els.resultTitle.textContent = scriptText(mode === "pattern" ? "词云" : mode === "rhyme" ? "押韵词云" : "结果");
  els.resultCount.textContent =
    state.query.trim() && cloudMode && results.length !== rawResults.length
      ? scriptText(`${results.length.toLocaleString()} / ${rawResults.length.toLocaleString()} 条`)
      : state.query.trim()
        ? scriptText(`${results.length.toLocaleString()} 条`)
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

els.scriptToggle?.addEventListener("click", () => {
  const nextScript = state.script === "traditional" ? "simplified" : "traditional";
  window.localStorage.setItem(SCRIPT_STORAGE_KEY, nextScript);
  applyScript(nextScript, { convertInputs: true });
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
    state.query = scriptText(button.dataset.query);
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
initScript();
loadData().catch((error) => {
  els.entryCount.textContent = scriptText("载入失败");
  els.analysis.innerHTML = `<span class="chip warn">${escapeHtml(error.message)}</span>`;
});
