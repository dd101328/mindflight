import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  CloudUpload,
  Compass,
  Gauge,
  Headphones,
  HeartPulse,
  Home,
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

  return (
    <main className="min-h-screen overflow-x-hidden bg-flight-ink text-slate-50">
      <BackgroundScene />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Nav activePage={activePage} setActivePage={go} />
        <section className="flex flex-1 items-stretch py-6 sm:py-8">
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
            <BookingPage booking={booking} setBooking={setBooking} />
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
    <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100/20 bg-cyan-100/10 px-4 py-2 text-sm text-cyan-50">
          <Sparkles size={16} />
          <span className="whitespace-nowrap">飞行学员心理成长陪伴</span>
        </div>
        <div className="space-y-5">
          <h1 className="text-balance text-5xl font-bold tracking-normal text-white sm:text-6xl lg:text-7xl">
            飞颜心测
          </h1>
          <p className="max-w-2xl text-xl leading-8 text-cyan-50/80 sm:text-2xl">
            面向飞行学员的 AI 心理成长平台
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {growthFlow.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="growth-step" key={step.label}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100/[0.12] text-cyan-100">
                  <Icon size={19} />
                </span>
                <div>
                  <div className="text-xs text-cyan-100/60">0{index + 1}</div>
                  <div className="mt-1 whitespace-nowrap text-sm font-semibold text-slate-50">
                    {step.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="每日状态打卡" value="3分钟" />
          <Metric label="心理维度" value="5项" />
          <Metric label="成长状态" value={assessment.risk.label} />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="primary-btn" onClick={() => go("face")} type="button">
            <Camera size={19} />
            <span>开始今日打卡</span>
          </button>
          <button className="secondary-btn" onClick={() => go("survey")} type="button">
            <Brain size={19} />
            <span>进入心理测评</span>
          </button>
        </div>
      </section>

      <section className="glass soft-panel relative min-h-[440px] overflow-hidden rounded-lg p-5 sm:p-7">
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(112,245,207,0.10),transparent_42%,rgba(143,107,255,0.13))]" />
        <div className="relative flex h-full flex-col justify-between gap-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-100/70">AI Growth Companion</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                今日心理成长面板
              </h2>
            </div>
            <Activity className="text-cyan-200" size={34} />
          </div>
          <div className="radar-scope mx-auto flex aspect-square w-full max-w-[330px] items-center justify-center rounded-full">
            <Plane className="plane-float text-cyan-100 drop-shadow-[0_0_20px_rgba(70,213,255,0.8)]" size={72} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["状态觉察", "情绪复原", "睡眠节律"].map((label, index) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4" key={label}>
                <div className="text-sm text-slate-300">{label}</div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
                    style={{ width: `${76 - index * 11}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
    <div className="grid w-full gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Panel title="每日状态打卡" eyebrow="Daily Check-in" icon={Camera}>
        <label className="upload-zone" htmlFor="face-upload">
          {faceData?.image ? (
            <img alt="采集预览" className="h-full w-full object-cover" src={faceData.image} />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <CloudUpload className="text-cyan-200" size={48} />
              <div>
                <p className="text-lg font-semibold">上传今日状态照片</p>
                <p className="mt-2 text-sm text-slate-300">
                  系统将在前端模拟完成今日状态识别
                </p>
              </div>
            </div>
          )}
          <input
            accept="image/*"
            className="sr-only"
            id="face-upload"
            onChange={handleFile}
            type="file"
          />
        </label>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="primary-btn cursor-pointer justify-center" htmlFor="face-upload">
            <CloudUpload size={18} />
            <span>{fileName ? "重新上传照片" : "选择照片"}</span>
          </label>
          <button className="secondary-btn" onClick={() => go("survey")} type="button">
            <ArrowRight size={18} />
            <span>继续填写问卷</span>
          </button>
        </div>
      </Panel>

      <Panel title="AI状态分析" eyebrow="Simulated AI Analysis" icon={Sparkles}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Signal label="紧张指数" value={faceData?.tension ?? 41} tone="cyan" />
          <Signal label="疲劳迹象" value={faceData?.fatigue ?? 35} tone="violet" />
          <Signal label="注意保持" value={faceData?.attention ?? 76} tone="mint" />
          <Signal label="表情稳定" value={faceData?.stability ?? 82} tone="blue" />
        </div>
        <div className="mt-6 rounded-lg border border-cyan-200/20 bg-cyan-200/[0.08] p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-cyan-200" size={24} />
            <h3 className="text-lg font-semibold">模拟结论</h3>
          </div>
          <p className="mt-3 leading-7 text-slate-200">
            {faceData
              ? "检测到紧张、疲劳与注意保持度的组合特征，已纳入今日成长分析。"
              : "尚未上传照片，当前使用默认平稳样本进行页面预览。"}
          </p>
        </div>
      </Panel>
    </div>
  );
}

function SurveyPage({ answers, setAnswers, go }) {
  const updateAnswer = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: Number(value) }));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/60">
            Psychological Survey
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">
            心理测评
          </h1>
        </div>
        <button className="primary-btn" onClick={() => go("report")} type="button">
          <Radar size={18} />
          <span>生成成长报告</span>
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {dimensions.map((dimension) => {
          const Icon = dimension.icon;
          return (
            <article className="glass rounded-lg p-5" key={dimension.id}>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-cyan-100">
                  <Icon size={22} />
                </span>
                <h2 className="text-xl font-semibold tracking-normal">{dimension.label}</h2>
              </div>
              <div className="space-y-5">
                {dimension.questions.map((question, index) => {
                  const key = `${dimension.id}-${index}`;
                  return (
                    <div key={key}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <label className="text-sm leading-6 text-slate-100" htmlFor={key}>
                          {question}
                        </label>
                        <span className="rounded-md bg-cyan-200/[0.12] px-3 py-1 text-sm text-cyan-100">
                          {answers[key]}分
                        </span>
                      </div>
                      <input
                        className="range"
                        id={key}
                        max="5"
                        min="1"
                        onChange={(event) => updateAnswer(key, event.target.value)}
                        step="1"
                        type="range"
                        value={answers[key]}
                      />
                      <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>很少</span>
                        <span>明显</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ReportPage({ assessment, faceData, go }) {
  return (
    <div className="grid w-full gap-6 xl:grid-cols-[0.96fr_1.04fr]">
      <Panel title="成长报告" eyebrow="AI Growth Report" icon={Radar}>
        <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
            <RadarChart scores={assessment.dimensionScores} />
          </div>
          <div className="space-y-4">
            <RiskBadge risk={assessment.risk} />
            <div className="rounded-lg border border-white/10 bg-white/[0.08] p-5">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Brain size={19} />
                <span>AI综合分析</span>
              </h3>
              <p className="leading-7 text-slate-200">{assessment.summary}</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="心理建议" eyebrow="Personal Guidance" icon={Headphones}>
        <div className="space-y-3">
          {assessment.suggestions.map((item) => (
            <div className="flex gap-3 rounded-lg border border-cyan-200/[0.12] bg-cyan-100/[0.08] p-4" key={item}>
              <CheckCircle2 className="mt-0.5 shrink-0 text-flight-mint" size={20} />
              <p className="leading-6 text-slate-100">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric label="问卷风险分" value={assessment.surveyRisk} />
          <Metric label="表情风险分" value={faceData?.expressionRisk ?? 32} />
          <Metric label="综合分" value={assessment.totalRisk} />
        </div>
        <button className="primary-btn mt-6 w-full justify-center" onClick={() => go("booking")} type="button">
          <CalendarDays size={18} />
          <span>预约心理咨询</span>
        </button>
      </Panel>
    </div>
  );
}

function BookingPage({ booking, setBooking }) {
  const [submitted, setSubmitted] = useState(false);
  const update = (field, value) => {
    setBooking((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel title="预约咨询" eyebrow="Counseling Appointment" icon={CalendarDays}>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <Field label="学员姓名">
            <input
              className="input"
              onChange={(event) => update("name", event.target.value)}
              placeholder="请输入姓名"
              value={booking.name}
            />
          </Field>
          <Field label="咨询主题">
            <select
              className="input"
              onChange={(event) => update("topic", event.target.value)}
              value={booking.topic}
            >
              <option>训练压力疏导</option>
              <option>考核焦虑管理</option>
              <option>睡眠恢复计划</option>
              <option>学习适应支持</option>
              <option>情绪稳定训练</option>
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="日期">
              <input
                className="input"
                onChange={(event) => update("date", event.target.value)}
                type="date"
                value={booking.date}
              />
            </Field>
            <Field label="时间">
              <input
                className="input"
                onChange={(event) => update("time", event.target.value)}
                type="time"
                value={booking.time}
              />
            </Field>
          </div>
          <Field label="补充说明">
            <textarea
              className="input min-h-28 resize-none"
              onChange={(event) => update("note", event.target.value)}
              placeholder="可填写近期困扰、训练阶段或希望重点沟通的问题"
              value={booking.note}
            />
          </Field>
          <button className="primary-btn w-full justify-center" type="submit">
            <Clock size={18} />
            <span>确认预约</span>
          </button>
        </form>
      </Panel>
      <Panel title="预约确认" eyebrow="Local Simulation" icon={UserRound}>
        <div className="space-y-4">
          <BookingRow label="姓名" value={booking.name || "待填写"} />
          <BookingRow label="主题" value={booking.topic} />
          <BookingRow label="日期" value={booking.date || "待选择"} />
          <BookingRow label="时间" value={booking.time || "待选择"} />
          <div className="rounded-lg border border-white/10 bg-white/[0.08] p-5">
            <p className="text-sm text-slate-300">咨询说明</p>
            <p className="mt-2 leading-7 text-slate-100">
              本页面仅进行前端模拟提交，不会上传任何个人信息。建议在正式系统中接入权限控制、加密存储与危机干预流程。
            </p>
          </div>
          {submitted && (
            <div className="rounded-lg border border-flight-mint/30 bg-flight-mint/[0.12] p-5 text-flight-mint">
              预约已生成，本地模拟记录已更新。
            </div>
          )}
        </div>
      </Panel>
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
