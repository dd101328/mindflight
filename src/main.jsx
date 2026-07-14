import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudUpload,
  Compass,
  FileText,
  Gauge,
  Headphones,
  HeartPulse,
  Home,
  Lightbulb,
  Smile,
  Sun,
  Moon,
  Plane,
  Radar,
  ShieldCheck,
  Sparkles,
  UserRound,
  Waves,
} from "lucide-react";
import "./styles.css";

const pages = [
  { id: "home", label: "首页", icon: Home },
  { id: "face", label: "每日打卡", icon: Camera },
  { id: "survey", label: "心理测评", icon: Brain },
  { id: "report", label: "成长报告", icon: Radar },
  { id: "booking", label: "我的", icon: UserRound },
];

const growthFlow = [
  { label: "每日状态打卡", icon: Camera },
  { label: "心理测评", icon: Brain },
  { label: "AI 综合分析", icon: Radar },
  { label: "今日成长建议", icon: Sparkles },
];

const dimensions = [
  {
    id: "stress",
    label: "压力",
    icon: Gauge,
    questions: ["近期训练任务让我持续紧绷", "我很难从考核压力中放松下来"],
  },
  {
    id: "anxiety",
    label: "焦虑",
    icon: HeartPulse,
    questions: ["我会反复担心飞行表现不达标", "临近训练或检查时我容易心慌"],
  },
  {
    id: "sleep",
    label: "睡眠",
    icon: Moon,
    questions: ["我最近入睡困难或容易醒来", "睡眠不足影响了白天专注度"],
  },
  {
    id: "mood",
    label: "情绪",
    icon: Waves,
    questions: ["我近期情绪波动比平时更明显", "我容易因为小事感到沮丧或烦躁"],
  },
  {
    id: "adaptation",
    label: "学习适应",
    icon: Compass,
    questions: ["我对飞行课程节奏感到吃力", "我需要更多时间适应训练环境"],
  },
];

const initialAnswers = dimensions.reduce((acc, item) => {
  item.questions.forEach((_, index) => {
    acc[`${item.id}-${index}`] = 2;
  });
  return acc;
}, {});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function App() {
  const [activePage, setActivePage] = useState("home");
  const [faceData, setFaceData] = useState(null);
  const [answers, setAnswers] = useState(initialAnswers);
  const [booking, setBooking] = useState({
    name: "",
    topic: "训练压力疏导",
    date: "",
    time: "",
    note: "",
  });

  const assessment = useMemo(
    () => buildAssessment(answers, faceData),
    [answers, faceData],
  );

  const go = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAppPage =
    activePage === "home" ||
    activePage === "face" ||
    activePage === "survey" ||
    activePage === "report" ||
    activePage === "booking";

  return (
    <main className={isAppPage ? "min-h-screen overflow-x-hidden bg-[#f5fbff] text-slate-950" : "min-h-screen overflow-x-hidden bg-flight-ink text-slate-50"}>
      {!isAppPage && <BackgroundScene />}
      <div className={isAppPage ? "relative z-10 mx-auto min-h-screen w-full max-w-[430px]" : "relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8"}>
        {!isAppPage && <Nav activePage={activePage} setActivePage={go} />}
        <section className={isAppPage ? "min-h-screen" : "flex flex-1 items-stretch py-6 sm:py-8"}>
          {activePage === "home" && <HomePage go={go} assessment={assessment} />}
          {activePage === "face" && (
            <FacePage faceData={faceData} setFaceData={setFaceData} go={go} />
          )}
          {activePage === "survey" && (
            <SurveyPage answers={answers} setAnswers={setAnswers} go={go} />
          )}
          {activePage === "report" && (
            <ReportPage assessment={assessment} faceData={faceData} go={go} />
          )}
          {activePage === "booking" && (
            <BookingPage go={go} />
          )}
        </section>
      </div>
    </main>
  );
}

function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#07152f_0%,#102556_48%,#28175c_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(70,213,255,0.16)_0%,transparent_30%,transparent_66%,rgba(143,107,255,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:58px_58px] opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/10" />
      <div className="flight-path absolute left-[8%] top-[18%] h-44 w-[86%] rounded-[50%] border-t border-cyan-200/20" />
    </div>
  );
}

function Nav({ activePage, setActivePage }) {
  return (
    <header className="glass sticky top-4 z-20 flex flex-col gap-4 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        className="flex items-center gap-3 text-left"
        onClick={() => setActivePage("home")}
        type="button"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-300/20 text-cyan-200 shadow-glow">
          <Plane size={21} />
        </span>
        <span className="flex flex-col">
          <span className="whitespace-nowrap text-lg font-semibold tracking-normal">
            飞颜心测
          </span>
          <span className="whitespace-nowrap text-xs text-cyan-100/70">
            Aviation Mental AI
          </span>
        </span>
      </button>
      <nav className="scrollbar-none flex gap-2 overflow-x-auto">
        {pages.map((page) => {
          const Icon = page.icon;
          const active = activePage === page.id;
          return (
            <button
              className={`nav-pill ${active ? "nav-pill-active" : ""}`}
              key={page.id}
              onClick={() => setActivePage(page.id)}
              title={page.label}
              type="button"
            >
              <Icon size={17} />
              <span className="whitespace-nowrap">{page.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}

function HomePage({ go, assessment }) {
  return (
    <div className="home-shell">
      <div className="home-sky" aria-hidden="true">
        <Plane className="home-sky-plane" size={54} />
        <div className="home-cloud home-cloud-one" />
        <div className="home-cloud home-cloud-two" />
      </div>

      <header className="home-topbar">
        <button className="home-brand" onClick={() => go("home")} type="button">
          <span className="home-brand-icon">
            <Plane size={23} />
          </span>
          <span>
            <span className="home-brand-title">飞颜心测</span>
            <span className="home-brand-subtitle">MindFlight</span>
          </span>
        </button>
        <button className="home-bell" type="button" aria-label="通知">
          <Bell size={23} />
        </button>
      </header>

      <section className="home-greeting" aria-label="今日问候">
        <h1>下午好，KK</h1>
        <p>今天状态怎么样？</p>
      </section>

      <button className="checkin-hero" onClick={() => go("face")} type="button">
        <span className="checkin-camera">
          <Camera size={31} />
        </span>
        <span className="checkin-copy">
          <strong>开始今日打卡</strong>
          <small>花 15 秒记录此刻状态</small>
        </span>
        <span className="checkin-arrow">
          <ChevronRight size={29} />
        </span>
      </button>

      <section className="home-card status-card" aria-label="今日状态">
        <div className="home-card-header">
          <div className="home-card-title">
            <span className="home-card-icon blue">
              <HeartPulse size={22} />
            </span>
            <h2>今日状态</h2>
          </div>
          <button className="home-card-link" onClick={() => go("report")} type="button">
            查看趋势
            <ChevronRight size={17} />
          </button>
        </div>
        <div className="status-stats">
          <div>
            <span>最近记录</span>
            <strong>昨天 21:40</strong>
          </div>
          <div className="status-divider" />
          <div>
            <span>连续打卡</span>
            <strong>3 天</strong>
          </div>
        </div>
        <p className="status-note">坚持记录，你正在稳步成长 💙</p>
      </section>

      <section className="home-card assessment-card" aria-label="今日推荐测评">
        <div className="home-card-header">
          <div className="home-card-title">
            <span className="home-card-icon purple">
              <Brain size={22} />
            </span>
            <h2>今日推荐测评</h2>
          </div>
          <button className="home-card-link" onClick={() => go("survey")} type="button">
            更多测评
            <ChevronRight size={17} />
          </button>
        </div>
        <div className="assessment-inner">
          <div>
            <h3>训练压力状态测评</h3>
            <p>了解近期训练压力水平与应对方式</p>
          </div>
          <div className="assessment-time">
            <Clock size={17} />
            <span>约 2 分钟</span>
          </div>
        </div>
        <button className="assessment-button" onClick={() => go("survey")} type="button">
          开始测评
        </button>
      </section>

      <section className="home-card advice-card" aria-label="今日成长建议">
        <div className="home-card-header">
          <div className="home-card-title">
            <span className="home-card-icon green">
              <Lightbulb size={22} />
            </span>
            <h2>今日成长建议</h2>
          </div>
        </div>
        <div className="advice-inner">
          <Sparkles className="advice-quote" size={25} />
          <p>
            训练结束后，用 3 分钟记录一次做得好的地方，积累你的自信时刻。
          </p>
          <Plane className="advice-plane" size={62} />
        </div>
      </section>

      <nav className="home-bottom-nav" aria-label="首页底部导航">
        {pages.map((page) => {
          const Icon = page.icon;
          const active = page.id === "home";
          return (
            <button
              className={active ? "bottom-nav-item active" : "bottom-nav-item"}
              key={page.id}
              onClick={() => go(page.id)}
              type="button"
            >
              <Icon size={24} />
              <span>{page.label === "成长报告" ? "成长" : page.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
function FacePage({ faceData, setFaceData, go }) {
  const [fileName, setFileName] = useState("");

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const seed = Array.from(file.name).reduce((sum, char) => sum + char.charCodeAt(0), file.size);
      const tension = 32 + (seed % 46);
      const fatigue = 26 + ((seed >> 2) % 44);
      const attention = 58 + ((seed >> 4) % 34);
      const stability = clamp(100 - Math.round((tension + fatigue) / 2) + 18, 18, 96);
      setFaceData({
        image: reader.result,
        fileName: file.name,
        tension,
        fatigue,
        attention,
        stability,
        expressionRisk: Math.round((tension + fatigue + (100 - attention)) / 3),
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="home-shell checkin-page">
      <div className="home-sky" aria-hidden="true">
        <Plane className="daily-sky-plane" size={54} />
        <div className="home-cloud home-cloud-one" />
      </div>

      <header className="home-topbar">
        <button className="home-brand" onClick={() => go("home")} type="button">
          <span className="home-brand-icon">
            <Plane size={23} />
          </span>
          <span>
            <span className="home-brand-title">飞颜心测</span>
            <span className="home-brand-subtitle">MindFlight</span>
          </span>
        </button>
        <button className="home-bell" type="button" aria-label="通知">
          <Bell size={23} />
        </button>
      </header>

      <section className="daily-hero" aria-label="每日状态打卡">
        <h1>每日状态打卡</h1>
        <p>花 15 秒，记录此刻的训练状态 💙</p>
      </section>

      <section className="daily-card photo-step" aria-label="今日状态">
        <div className="daily-card-title">
          <span className="daily-card-icon">
            <HeartPulse size={22} />
          </span>
          <div>
            <h2>今日状态</h2>
            <p>用 15 秒记录此刻的训练状态</p>
          </div>
        </div>
        <label className="capture-orb" htmlFor="face-upload">
          {faceData?.image ? (
            <img alt="今日状态预览" src={faceData.image} />
          ) : (
            <span className="capture-silhouette">
              <span className="capture-button">
                <Camera size={35} />
              </span>
              <strong>开始拍摄</strong>
              <small>预计 15 秒</small>
            </span>
          )}
          <span className="scan-corner scan-corner-tl" />
          <span className="scan-corner scan-corner-tr" />
          <span className="scan-corner scan-corner-bl" />
          <span className="scan-corner scan-corner-br" />
          <input
            accept="image/*"
            className="sr-only"
            id="face-upload"
            onChange={handleFile}
            type="file"
          />
        </label>

        <p className="privacy-note">
          <ShieldCheck size={16} />
          照片仅用于本次状态识别，不会储存或用于其他用途
        </p>
      </section>

      <section className="daily-card result-step" aria-label="分析结果">
        <div className="result-main">
          <div className="daily-card-title">
            <span className="daily-card-icon chart">
              <Activity size={22} />
            </span>
            <div>
              <h2>分析结果</h2>
              <p>{faceData ? "已完成拍摄，可查看你的状态反馈" : "完成分析后查看你的状态反馈"}</p>
            </div>
          </div>
        </div>
        <div className="result-illustration">
          <FileText size={54} />
          <ShieldCheck className="result-lock" size={22} />
        </div>
        <button className="result-button" onClick={() => go("report")} type="button">
          <span>查看最新分析结果</span>
          <ChevronRight size={22} />
        </button>
      </section>

      <nav className="home-bottom-nav" aria-label="底部导航">
        {pages.map((page) => {
          const Icon = page.icon;
          const active = page.id === "face";
          return (
            <button
              className={active ? "bottom-nav-item active" : "bottom-nav-item"}
              key={page.id}
              onClick={() => go(page.id)}
              type="button"
            >
              <Icon size={24} />
              <span>{page.label === "成长报告" ? "成长" : page.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function SurveyPage({ go }) {
  return (
    <div className="home-shell survey-page survey-simple-page">
      <div className="home-sky" aria-hidden="true">
        <Plane className="survey-sky-plane" size={50} />
        <div className="home-cloud home-cloud-one" />
      </div>

      <header className="home-topbar">
        <button className="home-brand" onClick={() => go("home")} type="button">
          <span className="home-brand-icon">
            <Plane size={23} />
          </span>
          <span>
            <span className="home-brand-title">飞颜心测</span>
            <span className="home-brand-subtitle">MindFlight</span>
          </span>
        </button>
        <button className="home-bell" type="button" aria-label="通知">
          <Bell size={23} />
        </button>
      </header>

      <section className="survey-hero" aria-label="心理测评">
        <h1>心理测评</h1>
      </section>

      <section className="survey-simple-card recommended" aria-label="训练压力状态测评">
        <div>
          <h2>训练压力状态测评</h2>
          <div className="simple-meta-row">
            <span className="simple-star">⭐ 今日推荐</span>
            <span className="simple-time">
              <Clock size={16} />
              约2分钟
            </span>
          </div>
        </div>
        <button className="simple-primary-button" onClick={() => go("report")} type="button">
          开始测评
        </button>
      </section>

      <section className="survey-simple-card recent" aria-label="最近完成">
        <h2>最近完成</h2>
        <div className="simple-record">
          <div>
            <strong>训练压力状态测评</strong>
            <span>3天前</span>
          </div>
          <b>87分</b>
        </div>
      </section>

      <section className="survey-simple-card note" aria-label="说明">
        <h2>说明</h2>
        <p>
          测评结果仅用于帮助了解近期训练压力状态，<br />
          不作为医学诊断依据。
        </p>
      </section>

      <nav className="home-bottom-nav" aria-label="底部导航">
        {pages.map((page) => {
          const Icon = page.icon;
          const active = page.id === "survey";
          return (
            <button
              className={active ? "bottom-nav-item active" : "bottom-nav-item"}
              key={page.id}
              onClick={() => go(page.id)}
              type="button"
            >
              <Icon size={24} />
              <span>{page.label === "成长报告" ? "成长" : page.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function ReportPage({ go }) {
  const growthCards = [
    {
      title: "情绪状态",
      level: "稳定",
      desc: "情绪整体平稳，适合保持当前节奏。",
      icon: Waves,
      tone: "blue",
    },
    {
      title: "压力水平",
      level: "轻度压力",
      desc: "训练压力可被觉察，建议安排短时放松。",
      icon: Gauge,
      tone: "amber",
    },
    {
      title: "专注状态",
      level: "良好",
      desc: "注意力保持较好，可继续关注恢复质量。",
      icon: Brain,
      tone: "green",
    },
  ];

  const actions = [
    "训练前做 3 轮方形呼吸，把注意力拉回当下。",
    "训练结束后记录一个做得好的细节，积累自信证据。",
  ];

  return (
    <div className="home-shell report-page">
      <div className="home-sky" aria-hidden="true">
        <Plane className="report-sky-plane" size={52} />
        <div className="home-cloud home-cloud-one" />
      </div>

      <header className="home-topbar">
        <button className="home-brand" onClick={() => go("home")} type="button">
          <span className="home-brand-icon">
            <Plane size={23} />
          </span>
          <span>
            <span className="home-brand-title">飞颜心测</span>
            <span className="home-brand-subtitle">MindFlight</span>
          </span>
        </button>
        <button className="home-bell" type="button" aria-label="通知">
          <Bell size={23} />
        </button>
      </header>

      <section className="report-hero" aria-label="今日成长报告">
        <p>今日成长报告</p>
        <h1>整体状态稳定</h1>
      </section>

      <section className="report-status-card" aria-label="综合状态">
        <span className="report-status-icon">
          <HeartPulse size={30} />
        </span>
        <div>
          <h2>你正在稳步适应训练节奏</h2>
          <p>今天的状态适合继续保持规律作息，并在训练前做一次简短稳定练习。</p>
        </div>
      </section>

      <section className="report-grid" aria-label="状态概览">
        {growthCards.map((item) => {
          const Icon = item.icon;
          return (
            <article className={`report-mini-card ${item.tone}`} key={item.title}>
              <span className="report-mini-icon">
                <Icon size={22} />
              </span>
              <h2>{item.title}</h2>
              <strong>{item.level}</strong>
              <p>{item.desc}</p>
            </article>
          );
        })}
      </section>

      <section className="report-card ai-advice-card" aria-label="AI 今日建议">
        <div className="report-card-title">
          <span>
            <Sparkles size={22} />
          </span>
          <h2>AI 今日建议</h2>
        </div>
        <p>
          今天不需要追求“完全不紧张”。把注意力放在可控动作上，允许自己带着一点压力完成训练。
        </p>
      </section>

      <section className="report-card action-card" aria-label="今日行动">
        <div className="report-card-title">
          <span>
            <CheckCircle2 size={22} />
          </span>
          <h2>今日行动</h2>
        </div>
        <div className="action-list">
          {actions.map((action, index) => (
            <div className="action-item" key={action}>
              <span>{index + 1}</span>
              <p>{action}</p>
            </div>
          ))}
        </div>
      </section>

      <button className="report-reset-button" onClick={() => go("face")} type="button">
        <Camera size={20} />
        <span>重新记录状态</span>
      </button>

      <nav className="home-bottom-nav" aria-label="底部导航">
        {pages.map((page) => {
          const Icon = page.icon;
          const active = page.id === "report";
          return (
            <button
              className={active ? "bottom-nav-item active" : "bottom-nav-item"}
              key={page.id}
              onClick={() => go(page.id)}
              type="button"
            >
              <Icon size={24} />
              <span>{page.label === "成长报告" ? "成长" : page.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function BookingPage({ go }) {
  const goals = [
    { label: "连续打卡3天", done: true },
    { label: "完成一次测评", done: false },
    { label: "查看成长报告", done: false },
  ];

  const history = [
    { title: "状态记录", desc: "今天 13:20", icon: Camera, page: "face" },
    { title: "训练压力测评", desc: "3天前 · 87分", icon: Brain, page: "survey" },
    { title: "成长报告", desc: "整体状态稳定", icon: Radar, page: "report" },
  ];

  return (
    <div className="home-shell profile-page">
      <div className="home-sky" aria-hidden="true">
        <Plane className="profile-sky-plane" size={52} />
        <div className="home-cloud home-cloud-one" />
      </div>

      <header className="home-topbar">
        <button className="home-brand" onClick={() => go("home")} type="button">
          <span className="home-brand-icon">
            <Plane size={23} />
          </span>
          <span>
            <span className="home-brand-title">飞颜心测</span>
            <span className="home-brand-subtitle">MindFlight</span>
          </span>
        </button>
        <button className="home-bell" type="button" aria-label="通知">
          <Bell size={23} />
        </button>
      </header>

      <section className="profile-card growth-data" aria-label="我的成长数据">
        <div className="profile-card-title">
          <span>
            <Activity size={22} />
          </span>
          <h2>我的成长数据</h2>
        </div>
        <div className="growth-data-grid">
          <div>
            <strong>15天</strong>
            <span>连续打卡</span>
          </div>
          <div>
            <strong>6次</strong>
            <span>完成测评</span>
          </div>
        </div>
      </section>

      <section className="profile-card" aria-label="我的成长目标">
        <div className="profile-card-title">
          <span className="green">
            <CheckCircle2 size={22} />
          </span>
          <h2>我的成长目标</h2>
        </div>
        <p className="goal-week">本周目标</p>
        <div className="goal-list">
          {goals.map((goal) => (
            <div className={goal.done ? "goal-item done" : "goal-item"} key={goal.label}>
              <span>
                <CheckCircle2 size={17} />
              </span>
              <p>{goal.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-card" aria-label="我的历史">
        <div className="profile-card-title">
          <span className="purple">
            <FileText size={22} />
          </span>
          <h2>我的历史</h2>
        </div>
        <div className="history-list">
          {history.map((item) => {
            const Icon = item.icon;
            return (
              <button className="history-item" key={item.title} onClick={() => go(item.page)} type="button">
                <span className="history-icon">
                  <Icon size={20} />
                </span>
                <span className="history-copy">
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </span>
                <ChevronRight size={19} />
              </button>
            );
          })}
        </div>
      </section>

      <button className="settings-button" type="button">
        <span>
          <UserRound size={21} />
          设置
        </span>
        <ChevronRight size={20} />
      </button>

      <nav className="home-bottom-nav" aria-label="底部导航">
        {pages.map((page) => {
          const Icon = page.icon;
          const active = page.id === "booking";
          return (
            <button
              className={active ? "bottom-nav-item active" : "bottom-nav-item"}
              key={page.id}
              onClick={() => go(page.id)}
              type="button"
            >
              <Icon size={24} />
              <span>{page.label === "成长报告" ? "成长" : page.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function buildAssessment(answers, faceData) {
  const dimensionScores = dimensions.map((dimension) => {
    const raw = dimension.questions.reduce(
      (sum, _, index) => sum + answers[`${dimension.id}-${index}`],
      0,
    );
    return {
      id: dimension.id,
      label: dimension.label,
      value: Math.round((raw / (dimension.questions.length * 5)) * 100),
    };
  });
  const surveyRisk = Math.round(
    dimensionScores.reduce((sum, item) => sum + item.value, 0) / dimensionScores.length,
  );
  const expressionRisk = faceData?.expressionRisk ?? 32;
  const totalRisk = Math.round(surveyRisk * 0.68 + expressionRisk * 0.32);
  const risk =
    totalRisk >= 68
      ? { label: "高风险", tone: "red", desc: "建议尽快安排专业咨询与持续跟踪" }
      : totalRisk >= 44
        ? { label: "中风险", tone: "amber", desc: "建议进行压力调节与阶段性复测" }
        : { label: "低风险", tone: "green", desc: "当前状态整体稳定，保持良好节律" };

  const highest = [...dimensionScores].sort((a, b) => b.value - a.value)[0];
  return {
    dimensionScores,
    surveyRisk,
    expressionRisk,
    totalRisk,
    risk,
    summary: `综合测评与每日状态模拟结果，当前成长状态为${risk.label}。主要关注维度为${highest.label}，系统判断训练负荷、睡眠恢复和情绪调节仍需动态观察。`,
    suggestions:
      risk.label === "高风险"
        ? [
            "优先预约心理咨询，围绕训练压力、睡眠质量与考核焦虑进行结构化访谈。",
            "未来一周降低非必要负荷，保持规律作息，并记录每日情绪与身体反应。",
            "若出现明显失眠、恐慌或持续低落，应及时联系带教老师和专业心理人员。",
          ]
        : risk.label === "中风险"
          ? [
              "建议安排一次短程心理咨询，明确压力来源并制定训练前放松方案。",
              "每天进行10分钟呼吸训练或正念练习，复盘飞行任务时区分事实与担忧。",
              "保持睡眠节律，连续三天记录入睡时间、醒来次数与白天专注度。",
            ]
          : [
              "继续保持稳定作息与训练复盘习惯，关注睡眠、情绪与学习适应变化。",
              "在高强度考核前进行简短呼吸训练，帮助维持注意力和身体唤醒水平。",
              "建议每两到四周完成一次复测，建立个人心理状态趋势档案。",
            ],
  };
}

function RadarChart({ scores }) {
  const size = 300;
  const center = size / 2;
  const radius = 112;
  const points = scores.map((score, index) => {
    const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
    const valueRadius = (score.value / 100) * radius;
    return {
      ...score,
      x: center + Math.cos(angle) * valueRadius,
      y: center + Math.sin(angle) * valueRadius,
      labelX: center + Math.cos(angle) * (radius + 28),
      labelY: center + Math.sin(angle) * (radius + 28),
      gridX: center + Math.cos(angle) * radius,
      gridY: center + Math.sin(angle) * radius,
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");
  const grid = [0.25, 0.5, 0.75, 1].map((step) =>
    scores
      .map((_, index) => {
        const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
        return `${center + Math.cos(angle) * radius * step},${center + Math.sin(angle) * radius * step}`;
      })
      .join(" "),
  );

  return (
    <svg className="h-auto w-full" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="心理维度雷达图">
      {grid.map((ring) => (
        <polygon fill="none" key={ring} points={ring} stroke="rgba(148, 224, 255, 0.18)" />
      ))}
      {points.map((point) => (
        <line
          key={point.id}
          stroke="rgba(148, 224, 255, 0.18)"
          x1={center}
          x2={point.gridX}
          y1={center}
          y2={point.gridY}
        />
      ))}
      <polygon fill="rgba(70, 213, 255, 0.22)" points={polygon} stroke="#70f5cf" strokeWidth="2" />
      {points.map((point) => (
        <g key={point.id}>
          <circle cx={point.x} cy={point.y} fill="#46d5ff" r="4" />
          <text
            fill="rgba(226, 245, 255, 0.9)"
            fontSize="13"
            textAnchor="middle"
            x={point.labelX}
            y={point.labelY}
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function RiskBadge({ risk }) {
  const styles = {
    green: "border-flight-mint/40 bg-flight-mint/[0.12] text-flight-mint",
    amber: "border-amber-300/40 bg-amber-300/[0.12] text-amber-200",
    red: "border-rose-300/40 bg-rose-300/[0.12] text-rose-200",
  };
  return (
    <div className={`rounded-lg border p-5 ${styles[risk.tone]}`}>
      <div className="text-sm">综合风险等级</div>
      <div className="mt-2 text-4xl font-bold tracking-normal">{risk.label}</div>
      <p className="mt-3 leading-6 text-slate-100">{risk.desc}</p>
    </div>
  );
}

function Panel({ title, eyebrow, icon: Icon, children }) {
  return (
    <section className="glass rounded-lg p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-300/[0.14] text-cyan-100">
          <Icon size={22} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/60">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">{title}</h1>
        </div>
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="glass rounded-lg p-4">
      <div className="text-sm text-cyan-100/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-normal text-white">{value}</div>
    </div>
  );
}

function Signal({ label, value, tone }) {
  const colors = {
    cyan: "from-cyan-300 to-sky-400",
    violet: "from-violet-300 to-fuchsia-400",
    mint: "from-flight-mint to-cyan-200",
    blue: "from-blue-300 to-violet-300",
  };
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-lg font-semibold">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${colors[tone]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-cyan-100/75">{label}</span>
      {children}
    </label>
  );
}

function BookingRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.08] p-4">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-right font-semibold text-slate-50">{value}</span>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
