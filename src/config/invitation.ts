import {
  normalizeActivityId,
  type CurrentFoodId,
  type LegacyActivityId,
} from "@/lib/food-migration";

const declineSteps = [
  {
    step: 0,
    buttonLabel: "暂不批准",
    mascotNote: "拒绝键已就位，看起来不太安分。",
  },
  {
    step: 1,
    buttonLabel: "欸，等一下",
    mascotNote: "咻——它说还没做好被点中的准备。",
  },
  {
    step: 2,
    buttonLabel: "我再躲一下",
    mascotNote: "申请人没跑，按钮先跑了。",
  },
  {
    step: 3,
    buttonLabel: "这边也点不到",
    mascotNote: "点慢一点，小猪的网快追不上了。",
  },
  {
    step: 4,
    buttonLabel: "你怎么还追呀",
    mascotNote: "友情提示：追按钮，也有一点像追。",
  },
  {
    step: 5,
    buttonLabel: "再追就暧昧了",
    mascotNote: "档案局开始记录，但暂不作为证据。",
  },
  {
    step: 6,
    buttonLabel: "让我缓半秒",
    mascotNote: "按钮在喘气，小猪也在喘气。",
  },
  {
    step: 7,
    buttonLabel: "你其实在笑吧",
    mascotNote: "放心，表情不在采集范围。",
  },
  {
    step: 8,
    buttonLabel: "我快没地方跑了",
    mascotNote: "逃跑路线快用完，勇气倒多了一点。",
  },
  {
    step: 9,
    buttonLabel: "批准键在那边",
    mascotNote: "左边那个粉色的，看起来很适合你。",
  },
  {
    step: 10,
    buttonLabel: "再想我半秒嘛",
    mascotNote: "扑空！但只见一面，不急着把话都说完。",
  },
  {
    step: 11,
    buttonLabel: "追到这里很可疑",
    mascotNote: "到底是谁舍不得结束这段追逐？",
  },
  {
    step: 12,
    buttonLabel: "给你留个台阶",
    mascotNote: "点批准不算输，只算一起吃顿饭。",
  },
  {
    step: 13,
    buttonLabel: "我替你保密",
    mascotNote: "不会告诉别人，你追了这么久。",
  },
  {
    step: 14,
    buttonLabel: "好啦，不跑了",
    mascotNote: "按钮认输，小猪还在假装没扑空。",
  },
  {
    step: 15,
    buttonLabel: "…其实想见吧",
    mascotNote: "如果答案是愿意，轻轻点一下就好。",
  },
] as const;

const foodOptions = [
  {
    id: "hotpot",
    label: "火锅",
    imageSrc: "/food/hotpot.png",
    fallbackIcon: "hotpot",
    tone: "coral",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "🍲",
    tagline: "把拘谨一起煮开",
    feedback: "选火锅？那脸红就有借口了。",
  },
  {
    id: "sushi",
    label: "日料",
    imageSrc: "/food/sushi.png",
    fallbackIcon: "sushi",
    tone: "mint",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "🍣",
    tagline: "安静一点，多看你几眼",
    feedback: "安静的座位，也许更适合偷偷看你。",
  },
  {
    id: "bbq",
    label: "烤肉",
    imageSrc: "/food/bbq.png",
    fallbackIcon: "bbq",
    tone: "yellow",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "🥩",
    tagline: "我负责烤，你负责好看",
    feedback: "我会认真翻面，也会认真听你说话。",
  },
  {
    id: "hunan",
    label: "湘菜",
    imageSrc: "/food/hunan.png",
    fallbackIcon: "hunan",
    tone: "coral",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "🌶️",
    tagline: "辣到脸红，刚好有借口",
    feedback: "脸红这件事，终于有合理解释。",
  },
  {
    id: "western",
    label: "西餐",
    imageSrc: "/food/western.png",
    fallbackIcon: "western",
    tone: "lavender",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "🍽️",
    tagline: "认真约会，假装不紧张",
    feedback: "那我练习一下，怎么自然地帮你拉椅子。",
  },
  {
    id: "dessert",
    label: "甜品",
    imageSrc: "/food/dessert.png",
    fallbackIcon: "dessert",
    tone: "rose",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "🍰",
    tagline: "聊天不够甜，它来补位",
    feedback: "看来这次见面可以再甜一点。",
  },
  {
    id: "coffee",
    label: "咖啡",
    imageSrc: "/food/coffee.png",
    fallbackIcon: "coffee",
    tone: "cream",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "☕",
    tagline: "先聊一杯，舍不得再续杯",
    feedback: "喝完舍不得走，就再点一杯。",
  },
  {
    id: "snacks",
    label: "小吃",
    imageSrc: "/food/snacks.png",
    fallbackIcon: "snacks",
    tone: "blue",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "🍢",
    tagline: "边走边吃，顺便并肩",
    feedback: "比起面对面，可以先从并肩走路开始。",
  },
  {
    id: "surprise",
    label: "交给你",
    imageSrc: "/food/surprise.png",
    fallbackIcon: "surprise",
    tone: "yellow",
    /** @deprecated Task 8 图片菜单接入后删除。 */
    emoji: "🎁",
    tagline: "把选择交给我，期待留给你",
    feedback: "我会偷偷把你放在第一顺位。",
  },
] as const;

export const invitationConfig = {
  requestNo: "DATE REQUEST NO.001",
  title: "请批准一场蓄谋已久的见面",
  motion: {
    page: 0.28,
    micro: 0.22,
    pressScale: 0.96,
  },
  timeOptions: [
    {
      value: "15:00",
      label: "下午 15:00",
      tagline: "阳光替我打掩护",
    },
    {
      value: "19:00",
      label: "晚上 19:00",
      tagline: "晚饭刚好，心动也刚好",
    },
    {
      value: "20:30",
      label: "饭后 20:30",
      tagline: "夜色负责保密",
    },
  ],
  copy: {
    intro: {
      label: "机密文件 · 仅对你生效",
      title: "请批准一场蓄谋已久的见面",
      subtitle: "我把“想见你”写成了申请表，免得当面又假装随便。",
      mascotNote: "嘘，他改了八遍，最后还是只敢写“有空吗”。",
      approve: "批准申请 ♥",
      declineSteps,
      /** @deprecated 开场组件迁移到 declineSteps 后删除。 */
      declineLabels: declineSteps.map(({ buttonLabel }) => buttonLabel),
    },
    confirm: {
      label: "审批异常提醒",
      title: "等等，你真的批准了？",
      subtitle: "我连被拒绝后的体面台词都准备好了，结果你让我白练了。",
      mascotNote: "第一格装镇定，第二格心里已经放烟花。",
      approve: "嗯，是真的 ♥",
      slip: "刚刚手滑",
    },
    schedule: {
      label: "心动线索 · 第 1 项",
      title: "正在捕捉你的空闲时间",
      subtitle: "借我一天里的两个小时，剩下的期待我来负责。",
      dateLabel: "哪天适合偷偷见面？",
      timeLabel: "几点开始想你…不是，见你？",
      noteLabel: "给约会管理员留个暗号（可选）",
      notePlaceholder: "比如：想吃辣、想坐靠窗……",
      next: "抓到了，去选快乐 →",
      incomplete: "日期和时间选好后，就可以继续啦。",
    },
    food: {
      label: "快乐补给 · 第 2 项",
      title: "这次的快乐，吃什么？",
      subtitle: "你负责挑喜欢的，我负责把你喜欢的记住。",
      emptyFeedback: "先挑一张，小猪保证只偷看你的答案。",
      submit: "装进约会计划 ♥",
    },
    review: {
      label: "历史计划复核",
      title: "再看一眼约会计划",
      subtitle: "旧存档也换上了新的小猪封面。",
      submit: "确认约会",
    },
    decline: {
      label: "档案暂存",
      title: "好啦，不闹了。",
      body: "你可以慢慢想，也可以认真告诉我今天不方便。",
      return: "那我再看看邀请",
      today: "今天先不约",
      saved: "收到，等你哪天想见面了，这份档案还在。",
    },
    submitting: {
      label: "正在递交",
      title: "正在把心动写进计划…",
      subtitle: "别催，申请人正在假装这是一件很平常的事。",
      errorTitle: "约会计划没写进去",
      errorBody: "不是反悔，是网络比我还紧张。",
      retry: "再递一次申请",
    },
    success: {
      label: "约会通行证 · 已批准",
      title: "好啦，我们要见面了。",
      body: "这句话看起来很普通，但我已经偷偷开心了很久。",
      status: "申请人状态：表面镇定 / 实际心跳超速",
      mascotNote: "批准章盖下去了，嘴角也别收回去了。",
      hint: "凭此通行证，兑换一次很认真又不太好意思的见面。",
      share: "分享这份小秘密",
      save: "保存约会通行证",
      revisit: "再偷看一遍",
    },
    shared: {
      label: "共享约会通行证",
      title: "这份小秘密已经送到啦。",
      hint: "地点可以晚点再一起商量。",
      start: "我也要发起邀请 ♥",
    },
  },
  foodOptions,
  mascots: {
    serious: {
      src: "/mascot/heart-pig-q/serious-review.png",
      fallbackSrc: "/mascot/heart-pig-q/serious-review.png",
      alt: "抱着申请板努力装镇定的小猪",
    },
    surprised: {
      src: "/mascot/heart-pig-q/surprised-reaction.png",
      fallbackSrc: "/mascot/heart-pig-q/serious-review.png",
      alt: "捂着脸惊喜睁大眼的小猪",
    },
    hunter: {
      src: "/mascot/heart-pig/hunter-chase.png",
      fallbackSrc: "/mascot/heart-pig/serious-review.png",
      alt: "拿着捕心网追线索的小猪",
    },
    hunterReady: {
      src: "/mascot/heart-pig/hunter-ready.png",
      fallbackSrc: "/mascot/heart-pig/hunter-chase.png",
      alt: "举着捕心网认真瞄准的小猪",
    },
    hunterLunge: {
      src: "/mascot/heart-pig/hunter-lunge.png",
      fallbackSrc: "/mascot/heart-pig/hunter-chase.png",
      alt: "伸出捕心网向前扑的小猪",
    },
    hunterMiss: {
      src: "/mascot/heart-pig/hunter-miss.png",
      fallbackSrc: "/mascot/heart-pig/hunter-chase.png",
      alt: "扑空后被捕心网罩住的小猪",
    },
    chef: {
      src: "/mascot/heart-pig/chef-expectation.png",
      fallbackSrc: "/mascot/heart-pig/serious-review.png",
      alt: "戴厨师帽抱着面碗的小猪",
    },
    courier: {
      src: "/mascot/heart-pig/courier-envelope.png",
      fallbackSrc: "/mascot/heart-pig/serious-review.png",
      alt: "抱着爱心信封奔跑的小猪",
    },
    cool: {
      src: "/mascot/heart-pig/cool-approved.png",
      fallbackSrc: "/mascot/heart-pig/serious-review.png",
      alt: "举着批准章庆祝的小猪",
    },
  },
} as const;

export type FoodId = CurrentFoodId;
export type FoodOption = (typeof invitationConfig.foodOptions)[number];
export type MascotMood = keyof typeof invitationConfig.mascots;

export const legacyActivityLabels: Readonly<
  Record<LegacyActivityId, string>
> = {
  dinner: "一起吃饭",
  walk: "一起散步",
  exhibit: "看场展览",
};

const isLegacyActivityId = (value: string): value is LegacyActivityId =>
  Object.hasOwn(legacyActivityLabels, value);

export const getActivityLabel = (activityId: string) => {
  const normalized = normalizeActivityId(activityId);
  if (!normalized) return "一起见面";

  const foodLabel = invitationConfig.foodOptions.find(
    (option) => option.id === normalized,
  )?.label;
  if (foodLabel) return foodLabel;

  return isLegacyActivityId(normalized)
    ? legacyActivityLabels[normalized]
    : "一起见面";
};

export const getTimeLabel = (time: string) =>
  invitationConfig.timeOptions.find((option) => option.value === time)?.label ??
  time;
