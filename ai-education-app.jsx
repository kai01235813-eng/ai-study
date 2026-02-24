import { useState, useEffect, useRef } from "react";
import {
  Brain, Cpu, Zap, Shield, Sparkles, ChevronRight,
  User, FileText, Target, ArrowRight, ArrowLeft,
  RotateCcw, Play, CheckCircle2, XCircle, AlertTriangle,
  Lightbulb, TrendingUp, Gauge, BookOpen, Gamepad2,
  ThumbsUp, ThumbsDown, Eye, Network, RefreshCw,
  MessageSquare, Bot, Globe, Send, Blocks,
  CircuitBoard, Binary, Trophy, Flame, Star, Award, Lock
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────
const T = {
  concept: {
    accent: "#a78bfa", dim: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.28)",
    grad: "linear-gradient(135deg,#6d28d9,#a78bfa)",
    glow: "rgba(167,139,250,0.4)",
  },
  how: {
    accent: "#38bdf8", dim: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.28)",
    grad: "linear-gradient(135deg,#0369a1,#38bdf8)",
    glow: "rgba(56,189,248,0.4)",
  },
  apply: {
    accent: "#fb923c", dim: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.28)",
    grad: "linear-gradient(135deg,#c2410c,#fb923c)",
    glow: "rgba(251,146,60,0.4)",
  },
  prompt: {
    accent: "#34d399", dim: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.28)",
    grad: "linear-gradient(135deg,#047857,#34d399)",
    glow: "rgba(52,211,153,0.4)",
  },
  ethics: {
    accent: "#f87171", dim: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.28)",
    grad: "linear-gradient(135deg,#b91c1c,#f87171)",
    glow: "rgba(248,113,113,0.4)",
  },
};

// ─── Shared UI Components ─────────────────────────────
const Card = ({ children, t, game = false, className = "" }) => (
  <div
    className={`rounded-2xl overflow-hidden ${className}`}
    style={{
      background: "rgba(13,21,37,0.95)",
      border: `1px solid ${game && t ? t.border : "rgba(255,255,255,0.07)"}`,
      boxShadow: game && t
        ? `0 0 60px ${t.glow}, 0 4px 32px rgba(0,0,0,0.5)`
        : "0 4px 32px rgba(0,0,0,0.4)",
    }}
  >
    {game && t && <div className="h-[3px]" style={{ background: t.grad }} />}
    <div className="p-6 sm:p-8">{children}</div>
  </div>
);

const SecHead = ({ icon: Icon, label, t }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: t.dim, border: `1px solid ${t.border}` }}>
      <Icon size={18} style={{ color: t.accent }} />
    </div>
    <div>
      <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-0.5"
        style={{ color: t.accent }}>CONCEPT</p>
      <h3 className="text-base font-bold text-white">{label}</h3>
    </div>
  </div>
);

const GameHead = ({ icon: Icon, label, t }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: t.grad, boxShadow: `0 4px 16px ${t.glow}` }}>
      <Icon size={18} className="text-white" />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-0.5"
        style={{ color: t.accent }}>INTERACTIVE GAME</p>
      <h3 className="text-base font-bold text-white">{label}</h3>
    </div>
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ background: t.dim, border: `1px solid ${t.border}` }}>
      <Gamepad2 size={12} style={{ color: t.accent }} />
      <span className="text-[10px] font-bold" style={{ color: t.accent }}>PLAY</span>
    </div>
  </div>
);

const PBtn = ({ children, onClick, disabled, t, className = "", icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
    style={{
      background: disabled ? "rgba(55,65,81,0.5)" : t.grad,
      boxShadow: disabled ? "none" : `0 4px 20px ${t.glow}`,
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${t.glow}`; } }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = disabled ? "none" : `0 4px 20px ${t.glow}`; }}
  >
    {Icon && <Icon size={15} />}{children}
  </button>
);

const GBtn = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all duration-200 ${className}`}
    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
  >
    {children}
  </button>
);

const ScoreBadge = ({ score, total, t }) => {
  const pct = Math.round((score / total) * 100);
  const variant = pct === 100 ? "perfect" : pct >= 70 ? "good" : pct >= 50 ? "ok" : "low";
  const colors = {
    perfect: { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.4)", text: "#34d399" },
    good: { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.4)", text: "#fbbf24" },
    ok: { bg: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.4)", text: "#fb923c" },
    low: { bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.4)", text: "#f87171" },
  };
  const c = colors[variant];
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      {pct === 100 && <Trophy size={14} style={{ color: c.text }} />}
      <span className="text-sm font-black" style={{ color: c.text }}>{score}/{total}</span>
      {pct === 100 && <span className="text-xs font-bold" style={{ color: c.text }}>퍼펙트!</span>}
    </div>
  );
};

// ─── TAB 1: AI Concepts & History ─────────────────────
const Tab1 = ({ onScore }) => {
  const t = T.concept;
  const [expanded, setExpanded] = useState(new Set());
  const [gameAnswers, setGameAnswers] = useState({});
  const [gameSubmitted, setGameSubmitted] = useState(false);

  const orgData = {
    id: "ai", label: "AI 본부전체", role: "본부", icon: Brain, color: "#a78bfa",
    desc: "인간의 지능을 모방하는 모든 기술의 총칭입니다. 규칙 기반 시스템부터 최신 생성형 AI까지, 사람처럼 생각하고 판단하는 모든 프로그램이 여기에 속합니다.",
    example: "스팸 필터 · 자동 번역 · 음성 인식 · 자율주행",
    children: [{
      id: "ml", label: "머신러닝 팀", role: "팀", icon: TrendingUp, color: "#818cf8",
      desc: "사람이 규칙을 짜주는 대신 데이터를 주고 '스스로 패턴을 찾아라!'라고 시키는 기술. 신입사원에게 과거 보고서를 주고 요령을 터득하게 하는 것과 같습니다.",
      example: "전력 수요 예측 · 고장 탐지 · 고객 이탈 예측",
      children: [{
        id: "dl", label: "딥러닝 파트", role: "파트", icon: Network, color: "#60a5fa",
        desc: "머신러닝의 엘리트 부대. 인간 뇌 신경망을 모방한 수백 층 네트워크로 복잡한 패턴을 학습합니다. 데이터가 많을수록 더 똑똑해집니다.",
        example: "이미지 인식 · 음성 인식 · 자연어 처리",
        children: [{
          id: "genai", label: "생성형 AI (LLM)", role: "에이스", icon: Sparkles, color: "#f472b6",
          desc: "딥러닝의 에이스! 기존 AI가 '분류·예측'에 그쳤다면, 생성형 AI는 글·그림·코드 등 새로운 콘텐츠를 '창작'합니다. ChatGPT, Claude가 여기에 해당합니다.",
          example: "보고서 작성 · 코드 생성 · 이미지 생성 · 요약",
          children: []
        }]
      }]
    }]
  };

  const toggle = (id) => setExpanded(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const OrgNode = ({ node, depth = 0 }) => {
    const open = expanded.has(node.id);
    const Icon = node.icon;
    const hasKids = node.children?.length > 0;
    const indent = depth * 20;
    return (
      <div style={{ marginLeft: indent }}>
        <div
          onClick={() => toggle(node.id)}
          className="mb-2 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden"
          style={{
            background: open ? `${node.color}14` : "rgba(255,255,255,0.03)",
            border: `1px solid ${open ? node.color + "40" : "rgba(255,255,255,0.08)"}`,
          }}
        >
          <div className="flex items-center gap-3 p-4">
            {hasKids ? (
              <div className="w-5 h-5 flex items-center justify-center transition-transform duration-300"
                style={{ transform: open ? "rotate(90deg)" : "rotate(0)" }}>
                <ChevronRight size={14} className="text-slate-500" />
              </div>
            ) : <div className="w-5" />}
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: node.color + "20", border: `1px solid ${node.color}40` }}>
              <Icon size={16} style={{ color: node.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">{node.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: node.color + "20", color: node.color }}>{node.role}</span>
              </div>
            </div>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ${open ? "max-h-40" : "max-h-0"}`}>
            <div className="px-4 pb-4 pl-[60px]">
              <p className="text-sm text-slate-300 leading-relaxed">{node.desc}</p>
              <p className="text-xs text-slate-500 mt-1.5">예: {node.example}</p>
            </div>
          </div>
        </div>
        {hasKids && (
          <div className={`overflow-hidden transition-all duration-500 ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
            {node.children.map(c => <OrgNode key={c.id} node={c} depth={depth + 1} />)}
          </div>
        )}
      </div>
    );
  };

  const tasks = [
    { id: "t1", text: "정해진 규칙대로 스팸 메일을 자동 차단", answer: "program", emoji: "📧" },
    { id: "t2", text: "과거 10년간 전력 수요 데이터로 내일 수요를 예측", answer: "ml", emoji: "📊" },
    { id: "t3", text: "이번 폭염 대비 대국민 절전 안내문 초안 작성", answer: "genai", emoji: "✍️" },
    { id: "t4", text: "송전탑 사진을 보고 결함 부위를 자동 탐지", answer: "ml", emoji: "🔍" },
    { id: "t5", text: "IF-THEN 규칙으로 전압이 낮으면 알람 발생", answer: "program", emoji: "🚨" },
    { id: "t6", text: "신입사원 교육 자료를 질의응답 챗봇으로 변환", answer: "genai", emoji: "💬" },
  ];

  const targets = [
    { id: "program", label: "일반 프로그램", icon: Cpu, color: "#64748b" },
    { id: "ml", label: "머신러닝 / 딥러닝", icon: Network, color: "#818cf8" },
    { id: "genai", label: "생성형 AI", icon: Sparkles, color: "#f472b6" },
  ];

  const score = gameSubmitted ? tasks.filter(t2 => gameAnswers[t2.id] === t2.answer).length : 0;

  useEffect(() => {
    if (gameSubmitted) onScore?.("concept", score, tasks.length);
  }, [gameSubmitted]);

  return (
    <div className="space-y-6">
      <Card t={t}>
        <SecHead icon={BookOpen} label="AI 조직도 — 클릭해서 펼쳐보기" t={t} />
        <p className="text-sm text-slate-400 mb-6">각 항목을 클릭하면 설명과 하위 조직이 펼쳐집니다.</p>
        <OrgNode node={orgData} />
      </Card>

      <Card t={t} game>
        <GameHead icon={Gamepad2} label="업무 분장 타이쿤" t={t} />
        <p className="text-sm text-slate-400 mb-6">각 업무를 읽고 가장 적합한 AI 유형을 선택하세요!</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {targets.map(tg => (
            <div key={tg.id} className="text-center p-3 rounded-xl"
              style={{ background: tg.color + "12", border: `1px solid ${tg.color}30` }}>
              <tg.icon size={20} className="mx-auto mb-1.5" style={{ color: tg.color }} />
              <div className="text-xs font-bold text-white">{tg.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {tasks.map(task => {
            const sel = gameAnswers[task.id];
            const isOk = gameSubmitted && sel === task.answer;
            const isBad = gameSubmitted && sel && sel !== task.answer;
            return (
              <div key={task.id} className="rounded-xl p-4 transition-all duration-300"
                style={{
                  background: isOk ? "rgba(52,211,153,0.08)" : isBad ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isOk ? "rgba(52,211,153,0.3)" : isBad ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.07)"}`,
                }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-lg shrink-0">{task.emoji}</span>
                  <p className="text-sm text-slate-200 flex-1">{task.text}</p>
                  {gameSubmitted && (isOk
                    ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "#34d399" }} />
                    : isBad ? <XCircle size={16} className="shrink-0 mt-0.5" style={{ color: "#f87171" }} /> : null
                  )}
                </div>
                <div className="flex gap-2">
                  {targets.map(tg => (
                    <button key={tg.id}
                      onClick={() => { if (!gameSubmitted) setGameAnswers(p => ({ ...p, [task.id]: tg.id })); }}
                      disabled={gameSubmitted}
                      className="flex-1 text-xs py-2 px-2 rounded-lg font-semibold transition-all duration-200"
                      style={{
                        background: sel === tg.id ? tg.color : "rgba(255,255,255,0.04)",
                        color: sel === tg.id ? "white" : "#94a3b8",
                        border: `1px solid ${sel === tg.id ? tg.color : "rgba(255,255,255,0.08)"}`,
                        boxShadow: sel === tg.id ? `0 0 12px ${tg.color}50` : "none",
                      }}
                    >
                      {tg.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
                {isBad && (
                  <p className="text-xs mt-2 font-medium" style={{ color: "#f87171" }}>
                    정답: {targets.find(tg => tg.id === task.answer)?.label}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {!gameSubmitted ? (
            <PBtn t={t} onClick={() => setGameSubmitted(true)}
              disabled={Object.keys(gameAnswers).length < tasks.length}
              icon={CheckCircle2}>
              제출하기
            </PBtn>
          ) : (
            <>
              <ScoreBadge score={score} total={tasks.length} t={t} />
              <GBtn onClick={() => { setGameAnswers({}); setGameSubmitted(false); }}>
                <RotateCcw size={13} /> 다시 하기
              </GBtn>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

// ─── TAB 2: How AI Works ──────────────────────────────
const Tab2 = ({ onScore }) => {
  const t = T.how;
  const [step, setStep] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePhase, setGamePhase] = useState("attention");
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(100);
  const [gameScore, setGameScore] = useState(null);
  const timerRef = useRef(null);

  const steps = [
    {
      title: "토큰화 (Tokenization)", subtitle: "말 토막 내기", icon: Blocks,
      content: () => {
        const [tokenized, setTokenized] = useState(false);
        return (
          <div className="space-y-5">
            <div className="rounded-xl p-5" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <p className="text-xs text-slate-500 mb-3">👤 김대리가 말합니다:</p>
              {!tokenized ? (
                <p className="text-xl font-bold text-white">"저 내일 오후에..."</p>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {["저", "내일", "오후에", "..."].map((tk, i) => (
                    <span key={i} className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-mono font-bold text-white"
                      style={{
                        background: t.dim, border: `1px solid ${t.border}`,
                        boxShadow: `0 0 12px ${t.glow}`,
                        animation: `slideUp 0.4s ease-out ${i * 100}ms both`,
                      }}>
                      {tk}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <PBtn t={t} onClick={() => setTokenized(!tokenized)}>
              {tokenized ? "원문 보기" : "✂️ 토큰화 실행"}
            </PBtn>
            <p className="text-sm text-slate-400 leading-relaxed">AI는 문장을 한꺼번에 이해하지 못합니다. 텍스트를 작은 조각(토큰)으로 쪼개는 것이 첫 단계입니다.</p>
          </div>
        );
      }
    },
    {
      title: "임베딩 (Embedding)", subtitle: "수치화", icon: Binary,
      content: () => {
        const [show, setShow] = useState(false);
        const embs = [
          { token: "저", scores: [{ label: "주어 확률", val: 9 }, { label: "긴급도", val: 2 }] },
          { token: "내일", scores: [{ label: "시간 관련", val: 9 }, { label: "퇴근 임박", val: 3 }] },
          { token: "오후에", scores: [{ label: "퇴근 임박", val: 8 }, { label: "피곤함", val: 5 }] },
        ];
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">각 단어에 수치(벡터)를 부여합니다. 컴퓨터가 이해할 수 있는 숫자로 변환하는 과정입니다.</p>
            <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {embs.map((e, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-3"
                  style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)" }}>
                  <span className="font-mono font-bold px-3 py-1.5 rounded-lg text-sm text-white"
                    style={{ background: t.dim, border: `1px solid ${t.border}` }}>{e.token}</span>
                  <ArrowRight size={12} className="text-slate-600 shrink-0" />
                  <div className="flex-1 flex gap-3 flex-wrap">
                    {show && e.scores.map((s, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs"
                        style={{ animation: `fadeIn 0.3s ease-out ${(i * 2 + j) * 80}ms both` }}>
                        <span className="text-slate-500">{s.label}</span>
                        <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${s.val * 10}%`, background: t.grad }} />
                        </div>
                        <span className="font-mono font-bold" style={{ color: t.accent }}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <PBtn t={t} onClick={() => setShow(!show)}>{show ? "숨기기" : "📊 수치화 시작"}</PBtn>
          </div>
        );
      }
    },
    {
      title: "셀프 어텐션 (Self-Attention)", subtitle: "문맥 파악", icon: Eye,
      content: () => {
        const [show, setShow] = useState(false);
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">단어들 사이의 관계와 숨겨진 문맥을 파악합니다.</p>
            <div className="rounded-xl p-5" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
                {["저", "내일", "오후에"].map((w, i) => (
                  <span key={i} className="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-500"
                    style={{
                      background: show && w === "오후에" ? t.grad : t.dim,
                      color: "white",
                      border: `1px solid ${show && w === "오후에" ? t.accent : t.border}`,
                      boxShadow: show && w === "오후에" ? `0 0 20px ${t.glow}` : "none",
                      transform: show && w === "오후에" ? "scale(1.1)" : "scale(1)",
                    }}>{w}</span>
                ))}
              </div>
              {show && (
                <div className="space-y-2" style={{ animation: "fadeIn 0.5s ease-out" }}>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <span>💨</span>
                    <span className="text-sm text-slate-300">어제 김대리가 한숨을 쉬었다는 사실!</span>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                    <p className="text-sm font-bold" style={{ color: "#f87171" }}>
                      🔗 "한숨" + "오후" → 어텐션 가중치 <span className="font-mono">0.92</span> (매우 강함)
                    </p>
                  </div>
                </div>
              )}
            </div>
            <PBtn t={t} onClick={() => setShow(!show)}>{show ? "초기화" : "🔗 문맥 연결 시작"}</PBtn>
          </div>
        );
      }
    },
    {
      title: "순전파 & FFN", subtitle: "신경망 통과", icon: CircuitBoard,
      content: () => {
        const [running, setRunning] = useState(false);
        const [active, setActive] = useState(-1);
        const layers = ["입력", "은닉 1", "은닉 2", "은닉 3", "출력"];
        useEffect(() => {
          if (running) {
            let i = 0;
            const iv = setInterval(() => { setActive(i++); if (i >= layers.length) clearInterval(iv); }, 500);
            return () => clearInterval(iv);
          } else setActive(-1);
        }, [running]);
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">정보들이 신경망 레이어를 차례로 통과하며 결론을 향해 전진합니다.</p>
            <div className="rounded-xl p-5" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {layers.map((l, i) => (
                  <div key={i} className="flex items-center gap-1.5 sm:gap-2 flex-1">
                    <div className="flex-1 h-16 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500"
                      style={{
                        background: i <= active ? t.grad : "rgba(255,255,255,0.04)",
                        color: i <= active ? "white" : "#475569",
                        border: `1px solid ${i <= active ? t.accent : "rgba(255,255,255,0.08)"}`,
                        boxShadow: i <= active ? `0 0 20px ${t.glow}` : "none",
                        transform: i === active ? "scale(1.05)" : "scale(1)",
                      }}>
                      {l}
                    </div>
                    {i < layers.length - 1 && (
                      <ArrowRight size={12} style={{ color: i < active ? t.accent : "#374151", flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
              {active >= layers.length - 1 && (
                <div className="mt-4 text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
                  <p className="text-sm font-bold" style={{ color: t.accent }}>⚡ 계산 완료! 결론 도출 중...</p>
                </div>
              )}
            </div>
            <PBtn t={t} onClick={() => setRunning(!running)}>{running ? "🔄 리셋" : "⚡ 순전파 시작"}</PBtn>
          </div>
        );
      }
    },
    {
      title: "소프트맥스 (Softmax)", subtitle: "확률 변환", icon: Gauge,
      content: () => {
        const [show, setShow] = useState(false);
        const preds = [
          { label: "반차", prob: 80 }, { label: "외근", prob: 15 }, { label: "퇴사", prob: 5 },
        ];
        const colors = [t.accent, "#818cf8", "#475569"];
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">최종 계산 결과가 확률 분포로 변환됩니다. 각 예측에 0~100%의 확률이 부여됩니다.</p>
            <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              {preds.map((p, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-white">{p.label}</span>
                    <span className="font-mono font-bold" style={{ color: colors[i] }}>{show ? `${p.prob}%` : "??"}</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: show ? `${p.prob}%` : "0%",
                        background: colors[i],
                        boxShadow: show ? `0 0 10px ${colors[i]}80` : "none",
                        transitionDelay: `${i * 200}ms`,
                      }} />
                  </div>
                </div>
              ))}
              {show && (
                <div className="mt-2 p-3 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.04)", animation: "fadeIn 0.5s ease-out" }}>
                  <p className="text-sm text-slate-300">부장님 결론: <span className="font-bold text-white">"김대리, 내일 반차 쓸 거지?"</span></p>
                </div>
              )}
            </div>
            <PBtn t={t} onClick={() => setShow(!show)}>{show ? "숨기기" : "🎰 확률 계산"}</PBtn>
          </div>
        );
      }
    },
    {
      title: "자기회귀 (Auto-regression)", subtitle: "꼬리무는 예측", icon: RefreshCw,
      content: () => {
        const [iter, setIter] = useState(0);
        const tokens = ["저", "내일", "오후에", "반차", "쓰겠습니다"];
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">예측된 단어를 붙이고, 다시 전체 문장으로 다음 단어를 예측하는 순환 구조입니다.</p>
            <div className="rounded-xl p-5" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {tokens.slice(0, 3 + iter).map((tk, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: i >= 3 ? t.grad : "rgba(255,255,255,0.06)",
                      color: "white",
                      border: `1px solid ${i >= 3 ? t.accent : "rgba(255,255,255,0.1)"}`,
                      boxShadow: i >= 3 ? `0 0 12px ${t.glow}` : "none",
                      animation: i >= 3 ? "slideUp 0.4s ease-out" : "",
                    }}>{tk}</span>
                ))}
                {iter < 2 && <span className="px-3 py-1.5 text-slate-600 text-sm animate-pulse font-mono">???</span>}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw size={12} className={iter > 0 ? "animate-spin" : ""} />
                <span>{iter === 0 ? "다음 단어를 예측해 보세요" : iter === 1 ? "✅ '반차' 예측! 한 번 더!" : "🎉 완성! 순환 예측 종료"}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <PBtn t={t} onClick={() => setIter(p => Math.min(p + 1, 2))} disabled={iter >= 2}>
                🔄 다음 단어 예측
              </PBtn>
              {iter >= 2 && <GBtn onClick={() => setIter(0)}><RotateCcw size={13} />리셋</GBtn>}
            </div>
          </div>
        );
      }
    },
    {
      title: "역전파 (Backpropagation)", subtitle: "뼈저린 반성", icon: RotateCcw,
      content: () => {
        const [phase, setPhase] = useState(0);
        const [shake, setShake] = useState(false);
        const reveal = () => {
          setPhase(1); setShake(true);
          setTimeout(() => setShake(false), 600);
          setTimeout(() => setPhase(2), 1500);
        };
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">예측이 틀렸을 때 오차를 계산하고, 역방향으로 가중치를 수정합니다.</p>
            <div className={`rounded-xl p-5 ${shake ? "animate-[shake_0.5s]" : ""}`}
              style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              {phase === 0 && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-slate-300">부장님의 예측: <span className="font-bold text-white">"반차 쓸 거지?" (80%)</span></p>
                  <p className="text-slate-500 text-sm">그런데 김대리의 실제 대답은...</p>
                </div>
              )}
              {phase >= 1 && (
                <div className="text-center space-y-3" style={{ animation: "fadeIn 0.4s" }}>
                  <div className="inline-block p-4 rounded-xl" style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" }}>
                    <p className="text-xl font-black" style={{ color: "#f87171" }}>💥 "사직서 내겠습니다"</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "#f87171" }}>예측 실패! 오차율: 95%</p>
                </div>
              )}
              {phase >= 2 && (
                <div className="mt-4 space-y-3" style={{ animation: "fadeIn 0.5s" }}>
                  <div className="p-4 rounded-lg space-y-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-xs text-slate-500 mb-2">🔧 가중치 수정 중...</p>
                    {[
                      { label: '"한숨→반차" 가중치', from: "0.92", to: "0.3", dir: "↓" },
                      { label: '"한숨→퇴사" 가중치', from: "0.05", to: "0.85", dir: "↑" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 w-36">{row.label}:</span>
                        <span className="line-through text-slate-600 font-mono">{row.from}</span>
                        <ArrowRight size={10} className="text-slate-600" />
                        <span className="font-mono font-bold" style={{ color: "#34d399" }}>{row.to}</span>
                        <span className="text-slate-500">{row.dir}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <p className="text-sm" style={{ color: "#fbbf24" }}>💡 <em>"요즘 세대는 피곤하면 반차가 아니라 퇴사구나..."</em></p>
                  </div>
                </div>
              )}
            </div>
            {phase === 0
              ? <PBtn t={t} onClick={reveal}>😱 실제 답 공개</PBtn>
              : <GBtn onClick={() => setPhase(0)}><RotateCcw size={13} />처음부터</GBtn>
            }
          </div>
        );
      }
    },
  ];

  const gameWords = ["부장님", "이번", "프로젝트", "예산이"];
  const keyWords = new Set(["프로젝트", "예산이"]);
  const predOptions = [
    { word: "부족합니다", prob: 65, correct: true },
    { word: "남았습니다", prob: 20, correct: false },
    { word: "좋습니다", prob: 10, correct: false },
    { word: "삭제됐습니다", prob: 5, correct: false },
  ];

  useEffect(() => {
    if (gameStarted && gamePhase === "attention" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(p => p - 2), 100);
      return () => clearTimeout(timerRef.current);
    }
    if (timeLeft <= 0 && gamePhase === "attention") { setGamePhase("predict"); setTimeLeft(100); }
  }, [gameStarted, gamePhase, timeLeft]);

  useEffect(() => {
    if (gamePhase === "predict" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(p => p - 1.5), 100);
      return () => clearTimeout(timerRef.current);
    }
    if (timeLeft <= 0 && gamePhase === "predict" && !selectedPrediction) {
      setGamePhase("result"); setGameScore(0);
    }
  }, [gamePhase, timeLeft, selectedPrediction]);

  const handlePred = (opt) => {
    setSelectedPrediction(opt);
    clearTimeout(timerRef.current);
    const attnScore = [...selectedWords].filter(w => keyWords.has(w)).length * 25;
    const score = attnScore + (opt.correct ? 50 : 0);
    setGameScore(score);
    setGamePhase("result");
    onScore?.("how", score, 100);
  };

  const resetGame = () => {
    setGameStarted(false); setGamePhase("attention");
    setSelectedWords(new Set()); setSelectedPrediction(null);
    setTimeLeft(100); setGameScore(null);
  };

  const StepContent = steps[step]?.content;

  return (
    <div className="space-y-6">
      <Card t={t}>
        <SecHead icon={BookOpen} label="부장님의 눈치 게임 — LLM 작동 원리 7단계" t={t} />
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200"
              style={{
                background: i === step ? t.grad : "rgba(255,255,255,0.04)",
                color: i === step ? "white" : "#64748b",
                border: `1px solid ${i === step ? t.accent : "rgba(255,255,255,0.07)"}`,
                boxShadow: i === step ? `0 0 16px ${t.glow}` : "none",
              }}>
              <span className="font-mono">{i + 1}</span>
              <span className="hidden sm:inline">{s.subtitle}</span>
            </button>
          ))}
        </div>
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-5">
            {(() => { const Icon = steps[step].icon; return (
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: t.dim, border: `1px solid ${t.border}` }}>
                <Icon size={16} style={{ color: t.accent }} />
              </div>
            ); })()}
            <div>
              <h3 className="font-bold text-white">{steps[step].title}</h3>
              <p className="text-xs text-slate-500">{steps[step].subtitle}</p>
            </div>
          </div>
          <StepContent />
        </div>
        <div className="flex justify-between mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <GBtn onClick={() => setStep(Math.max(0, step - 1))} className={step === 0 ? "opacity-30 pointer-events-none" : ""}>
            <ArrowLeft size={13} />이전
          </GBtn>
          <span className="text-xs text-slate-600 self-center font-mono">{step + 1}/{steps.length}</span>
          <GBtn onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className={step === steps.length - 1 ? "opacity-30 pointer-events-none" : ""}>
            다음<ArrowRight size={13} />
          </GBtn>
        </div>
      </Card>

      <Card t={t} game>
        <GameHead icon={Gamepad2} label="부장님 시뮬레이터 — 핵심 단어 잡기" t={t} />
        {!gameStarted ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 mb-6">핵심 단어를 빠르게 찾고 다음 단어를 예측하세요!</p>
            <PBtn t={t} onClick={() => setGameStarted(true)} icon={Play}>게임 시작</PBtn>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold" style={{ color: t.accent }}>
                <span>{gamePhase === "attention" ? "⏱ 핵심 단어 클릭!" : gamePhase === "predict" ? "⏱ 다음 단어 예측!" : "결과"}</span>
                {gamePhase !== "result" && <span>{Math.round(timeLeft)}%</span>}
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${gamePhase !== "result" ? timeLeft : 0}%`,
                    background: timeLeft > 30 ? t.grad : "linear-gradient(135deg,#b91c1c,#f87171)",
                    boxShadow: `0 0 8px ${t.glow}`,
                  }} />
              </div>
            </div>

            <div className="rounded-xl p-5" style={{ background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.12)" }}>
              <p className="text-xs text-slate-500 mb-3">💬 김대리:</p>
              <div className="flex gap-2 flex-wrap">
                {gameWords.map((w, i) => (
                  <button key={i}
                    onClick={() => {
                      if (gamePhase === "attention")
                        setSelectedWords(prev => { const n = new Set(prev); n.has(w) ? n.delete(w) : n.add(w); return n; });
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                    style={{
                      background: selectedWords.has(w) ? t.grad : "rgba(255,255,255,0.05)",
                      color: "white",
                      border: `1px solid ${selectedWords.has(w) ? t.accent : "rgba(255,255,255,0.1)"}`,
                      boxShadow: selectedWords.has(w) ? `0 0 16px ${t.glow}` : "none",
                      cursor: gamePhase !== "attention" ? "default" : "pointer",
                    }}>{w}</button>
                ))}
                <span className="px-4 py-2 text-slate-600 text-sm font-mono animate-pulse">???</span>
              </div>
            </div>

            {gamePhase === "predict" && (
              <div className="space-y-3" style={{ animation: "fadeIn 0.4s ease-out" }}>
                <p className="text-sm font-bold text-white">다음 단어로 가장 적절한 것은?</p>
                <div className="grid grid-cols-2 gap-2">
                  {predOptions.map((opt, i) => (
                    <button key={i} onClick={() => handlePred(opt)}
                      className="p-3 rounded-xl text-sm text-left transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.dim; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                      <span className="font-bold">{opt.word}</span>
                      <span className="text-xs text-slate-500 ml-2">{opt.prob}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gamePhase === "result" && (
              <div className="space-y-4" style={{ animation: "fadeIn 0.4s ease-out" }}>
                <div className="p-5 rounded-xl text-center"
                  style={{
                    background: gameScore >= 75 ? "rgba(52,211,153,0.08)" : gameScore >= 50 ? "rgba(251,191,36,0.08)" : "rgba(248,113,113,0.08)",
                    border: `1px solid ${gameScore >= 75 ? "rgba(52,211,153,0.3)" : gameScore >= 50 ? "rgba(251,191,36,0.3)" : "rgba(248,113,113,0.3)"}`,
                  }}>
                  <div className="text-4xl font-black text-white mb-1">{gameScore}<span className="text-xl text-slate-500">점</span></div>
                  <p className="text-sm text-slate-300">{gameScore >= 75 ? "🎉 훌륭한 눈치! 부장님 레벨!" : gameScore >= 50 ? "👍 나쁘지 않아요!" : "😅 아직 눈치가..."}</p>
                  <div className="mt-3 text-xs text-slate-500">
                    <p>어텐션: {[...selectedWords].filter(w => keyWords.has(w)).length}/{keyWords.size} 핵심 단어</p>
                    <p>예측: {selectedPrediction ? (selectedPrediction.correct ? "정답 ✅" : `"${selectedPrediction.word}" 오답 ❌`) : "시간 초과 ⏰"}</p>
                  </div>
                </div>
                <GBtn onClick={resetGame}><RotateCcw size={13} />다시 하기</GBtn>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

// ─── TAB 3: AI in Power Industry ──────────────────────
const Tab3 = ({ onScore }) => {
  const t = T.apply;
  const [scenario, setScenario] = useState(null);
  const [showAi, setShowAi] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [sliderVal, setSliderVal] = useState(50);
  const [demandHistory, setDemandHistory] = useState([]);
  const [supplyHistory, setSupplyHistory] = useState([]);
  const [score, setScore] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [survived, setSurvived] = useState(false);
  const gameRef = useRef(null);

  const scenarios = [
    { id: "heat", label: "갑작스러운 폭염", icon: "🌡️", desc: "에어컨 사용 급증으로 수요 예측 불가" },
    { id: "factory", label: "대규모 공장 가동", icon: "🏭", desc: "갑작스러운 산업 수요 급증 발생" },
  ];

  useEffect(() => {
    if (gameRunning && !gameOver) {
      gameRef.current = setInterval(() => {
        setGameTime(prev => {
          const newTime = prev + 1;
          if (newTime >= 100) { clearInterval(gameRef.current); setGameOver(true); setSurvived(true); return 100; }
          const demand = 50 + Math.sin(newTime * 0.15) * 20 + Math.sin(newTime * 0.07) * 15 + (Math.random() - 0.5) * 10;
          const d = Math.max(10, Math.min(90, demand));
          setDemandHistory(p => [...p.slice(-40), d]);
          if (aiMode) { setSliderVal(d); setSupplyHistory(p => [...p.slice(-40), d]); }
          else {
            setSupplyHistory(p => [...p.slice(-40), sliderVal]);
            if (Math.abs(sliderVal - d) > 25) {
              setScore(p => {
                const ns = p - 2;
                if (ns <= 0) { clearInterval(gameRef.current); setGameOver(true); setSurvived(false); return 0; }
                return ns;
              });
            }
          }
          return newTime;
        });
      }, 100);
      return () => clearInterval(gameRef.current);
    }
  }, [gameRunning, gameOver, aiMode, sliderVal]);

  const startGame = () => {
    setGameRunning(true); setGameOver(false); setSurvived(false);
    setGameTime(0); setDemandHistory([]); setSupplyHistory([]);
    setScore(100); setAiMode(false); setSliderVal(50);
  };

  useEffect(() => {
    if (gameOver) onScore?.("apply", survived ? score : 0, 100);
  }, [gameOver]);

  const MiniChart = ({ data, color }) => {
    if (data.length < 2) return <div className="w-full h-full" style={{ background: "rgba(255,255,255,0.02)" }} />;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - v}`).join(" ");
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke"
          style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <Card t={t}>
        <SecHead icon={BookOpen} label="전력망의 미래 — 수동 vs AI 예측 비교" t={t} />
        <p className="text-sm text-slate-400 mb-6">시나리오를 선택해 수동 예측과 AI 예측의 차이를 비교해 보세요.</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {scenarios.map(s => (
            <button key={s.id} onClick={() => { setScenario(s.id); setShowAi(false); }}
              className="p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: scenario === s.id ? t.dim : "rgba(255,255,255,0.03)",
                border: `1px solid ${scenario === s.id ? t.border : "rgba(255,255,255,0.07)"}`,
                boxShadow: scenario === s.id ? `0 0 20px ${t.glow}` : "none",
              }}>
              <span className="text-2xl block mb-2">{s.icon}</span>
              <span className="text-sm font-bold text-white block">{s.label}</span>
              <span className="text-xs text-slate-500">{s.desc}</span>
            </button>
          ))}
        </div>
        {scenario && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "수동 예측", icon: User, color: "#f87171", ok: false, show: true },
              { label: "AI 예측", icon: Bot, color: "#34d399", ok: true, show: showAi },
            ].map((side, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${side.show ? (side.ok ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)") : "rgba(255,255,255,0.07)"}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <side.icon size={13} style={{ color: side.color }} />
                  <span className="text-xs font-bold" style={{ color: side.color }}>{side.label}</span>
                </div>
                <div className="h-20 rounded-lg overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                  {side.show ? (
                    <svg viewBox="0 0 200 80" className="w-full h-full">
                      {i === 0 ? (
                        scenario === "heat"
                          ? <polyline points="0,60 30,55 50,50 70,40 80,20 90,50 110,15 130,55 150,25 180,45 200,30" fill="none" stroke={side.color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 4px ${side.color}60)` }} />
                          : <polyline points="0,50 20,50 40,45 50,15 60,55 80,10 100,60 120,20 150,50 200,45" fill="none" stroke={side.color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 4px ${side.color}60)` }} />
                      ) : (
                        <polyline points="0,60 30,55 50,50 70,40 80,25 90,30 110,22 130,28 150,25 180,27 200,30" fill="none" stroke={side.color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 4px ${side.color}60)` }} />
                      )}
                      <polyline points="0,55 50,53 100,50 150,48 200,45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 2" />
                    </svg>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Lock size={16} className="text-slate-600" />
                    </div>
                  )}
                </div>
                {side.show && (
                  <p className="text-xs font-semibold" style={{ color: side.color }}>
                    {side.ok ? "✅ 수만 건 데이터로 즉시 대응!" : "⚠️ 예측 실패! 수급 불균형!"}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {scenario && !showAi && (
          <div className="mt-4">
            <PBtn t={t} onClick={() => setShowAi(true)}>⚡ AI 예측 활성화</PBtn>
          </div>
        )}
      </Card>

      <Card t={t} game>
        <GameHead icon={Gamepad2} label="블랙아웃을 막아라!" t={t} />
        {!gameRunning ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 mb-2">전력 수요에 맞춰 발전량을 조절하세요!</p>
            <p className="text-xs text-slate-600 mb-6">차이가 너무 크면 정전 발생 💥</p>
            <PBtn t={t} onClick={startGame} icon={Play}>시작하기</PBtn>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{
                    background: score > 50 ? "rgba(52,211,153,0.12)" : score > 20 ? "rgba(251,191,36,0.12)" : "rgba(248,113,113,0.12)",
                    color: score > 50 ? "#34d399" : score > 20 ? "#fbbf24" : "#f87171",
                    border: `1px solid ${score > 50 ? "rgba(52,211,153,0.3)" : score > 20 ? "rgba(251,191,36,0.3)" : "rgba(248,113,113,0.3)"}`,
                  }}>
                  안정도 {score}%
                </div>
                <span className="text-xs text-slate-600 font-mono">{Math.round(gameTime)}%</span>
              </div>
              {!aiMode && !gameOver && (
                <PBtn t={t} onClick={() => setAiMode(true)} className="text-xs py-2 px-3">
                  <Cpu size={12} /> AI 모드
                </PBtn>
              )}
              {aiMode && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: t.dim, border: `1px solid ${t.border}` }}>
                  <Bot size={12} style={{ color: t.accent }} />
                  <span className="text-xs font-bold" style={{ color: t.accent }}>AI 자동 제어</span>
                </div>
              )}
            </div>

            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${gameTime}%`, background: t.grad }} />
            </div>

            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex gap-4 text-xs font-semibold mb-3">
                <span className="flex items-center gap-1.5" style={{ color: "#f87171" }}>
                  <div className="w-4 h-0.5 rounded" style={{ background: "#f87171" }} />전력 수요
                </span>
                <span className="flex items-center gap-1.5" style={{ color: "#38bdf8" }}>
                  <div className="w-4 h-0.5 rounded" style={{ background: "#38bdf8" }} />발전량(나)
                </span>
              </div>
              <div className="h-20 relative rounded-lg overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
                <MiniChart data={demandHistory} color="#f87171" />
                <div className="absolute inset-0"><MiniChart data={supplyHistory} color="#38bdf8" /></div>
              </div>
            </div>

            {!aiMode && !gameOver && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">발전량 조절</span>
                  <span className="font-mono font-bold" style={{ color: t.accent }}>{Math.round(sliderVal)}%</span>
                </div>
                <input type="range" min="0" max="100" value={sliderVal}
                  onChange={e => setSliderVal(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: t.accent }} />
              </div>
            )}

            {gameOver && (
              <div className="p-5 rounded-xl text-center"
                style={{
                  background: survived ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
                  border: `1px solid ${survived ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
                }}>
                <p className="text-xl font-black text-white mb-1">{survived ? "🎉 블랙아웃 방어 성공!" : "💥 정전 발생!"}</p>
                <p className="text-sm text-slate-400">{survived ? (aiMode ? "AI 덕분에 안정 유지!" : "수동으로 성공! 대단합니다!") : "수요와 공급의 괴리가 너무 커졌습니다."}</p>
                <div className="mt-4"><GBtn onClick={startGame}><RotateCcw size={13} />다시 하기</GBtn></div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

// ─── TAB 4: Prompt Tips ───────────────────────────────
const Tab4 = ({ onScore }) => {
  const t = T.prompt;
  const [activeBlock, setActiveBlock] = useState(null);
  const [slots, setSlots] = useState([null, null, null]);
  const [gameSubmitted, setGameSubmitted] = useState(false);

  const conceptBlocks = [
    { id: "role", label: "역할 부여", example: "넌 한국전력 10년 차 과장이야", icon: User, desc: "AI에게 전문가 역할을 부여하면 해당 분야 어조와 전문 용어를 사용한 답변을 받습니다. '신입사원에게 역할을 주는 것'과 같습니다." },
    { id: "context", label: "구체적 맥락", example: "지금 폭우로 송전탑 문제가 생겼어", icon: Target, desc: "현재 상황과 배경을 구체적으로 알려주세요. '문제가 생겼어'보다 '154kV 송전선이 끊겨서 3개 지역이 정전됐어'가 훨씬 정확합니다." },
    { id: "format", label: "출력 형식", example: "안내문을 3문단으로 써줘", icon: FileText, desc: "원하는 출력 형태를 명확히 지정하세요. '알려줘'보다 '5단계 체크리스트로', '3문단 안내문으로' 처럼 구체적으로 요청하세요." },
  ];

  const gradients = [
    "linear-gradient(135deg,#047857,#34d399)",
    "linear-gradient(135deg,#0369a1,#38bdf8)",
    "linear-gradient(135deg,#7c3aed,#a78bfa)",
  ];

  const allBlocks = [
    { id: "g1", text: "넌 전력설비 전문 엔지니어야", type: "role", good: true },
    { id: "g2", text: "오늘 강풍으로 154kV 송전선이 끊겼어", type: "context", good: true },
    { id: "g3", text: "복구 절차를 단계별 체크리스트로 작성해", type: "format", good: true },
    { id: "b1", text: "대충 써줘", type: "bad", good: false },
    { id: "b2", text: "뭔가 좋은 거 만들어봐", type: "bad", good: false },
    { id: "b3", text: "알아서 해", type: "bad", good: false },
  ];

  const shuffled = useRef([...allBlocks].sort(() => Math.random() - 0.5));
  const slotLabels = ["① 역할", "② 맥락", "③ 형식"];

  const fill = (blockId, slotIdx) => {
    if (gameSubmitted) return;
    const ns = [...slots];
    const ex = ns.indexOf(blockId);
    if (ex !== -1) ns[ex] = null;
    ns[slotIdx] = blockId;
    setSlots(ns);
  };

  const allGood = slots.every(s => allBlocks.find(b => b.id === s)?.good);

  useEffect(() => {
    if (gameSubmitted) onScore?.("prompt", allGood ? 3 : slots.filter(s => allBlocks.find(b => b.id === s)?.good).length, 3);
  }, [gameSubmitted]);

  return (
    <div className="space-y-6">
      <Card t={t}>
        <SecHead icon={BookOpen} label="업무 지시 공식 — 완벽한 프롬프트의 3요소" t={t} />
        <p className="text-sm text-slate-400 mb-6">각 블록을 클릭해 설명을 확인하세요.</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {conceptBlocks.map((b, i) => (
            <button key={b.id} onClick={() => setActiveBlock(activeBlock === b.id ? null : b.id)}
              className="flex-1 p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: activeBlock === b.id ? t.dim : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeBlock === b.id ? t.border : "rgba(255,255,255,0.07)"}`,
                boxShadow: activeBlock === b.id ? `0 0 20px ${t.glow}` : "none",
              }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: gradients[i] }}>
                  <b.icon size={13} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">{b.label}</span>
              </div>
              <p className="text-xs font-mono" style={{ color: t.accent }}>"{b.example}"</p>
            </button>
          ))}
        </div>
        {activeBlock && (
          <div className="rounded-xl p-4" style={{ background: t.dim, border: `1px solid ${t.border}`, animation: "fadeIn 0.3s" }}>
            <div className="flex items-start gap-2">
              <Lightbulb size={14} style={{ color: t.accent }} className="mt-0.5 shrink-0" />
              <p className="text-sm text-slate-300">{conceptBlocks.find(b => b.id === activeBlock)?.desc}</p>
            </div>
          </div>
        )}
        <div className="mt-5 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">조합 결과</p>
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="font-bold" style={{ color: "#34d399" }}>[역할]</span> {conceptBlocks[0].example} +{" "}
            <span className="font-bold" style={{ color: "#38bdf8" }}>[맥락]</span> {conceptBlocks[1].example} +{" "}
            <span className="font-bold" style={{ color: "#a78bfa" }}>[형식]</span> {conceptBlocks[2].example}
          </p>
          <p className="text-xs text-slate-500 mt-2">→ 정확하고 실용적인 결과물을 즉시 얻을 수 있습니다!</p>
        </div>
      </Card>

      <Card t={t} game>
        <GameHead icon={Gamepad2} label="프롬프트 깎는 장인" t={t} />
        <p className="text-sm text-slate-400 mb-6">좋은 블록 3개를 골라 올바른 슬롯에 넣으세요!</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {slotLabels.map((label, i) => {
            const block = allBlocks.find(b => b.id === slots[i]);
            const isGood = gameSubmitted && block?.good;
            const isBad = gameSubmitted && block && !block.good;
            return (
              <div key={i} className="rounded-xl p-3 min-h-[90px] flex flex-col transition-all duration-300"
                style={{
                  background: isGood ? "rgba(52,211,153,0.08)" : isBad ? "rgba(248,113,113,0.08)" : slots[i] ? t.dim : "rgba(255,255,255,0.02)",
                  border: `2px dashed ${isGood ? "rgba(52,211,153,0.4)" : isBad ? "rgba(248,113,113,0.4)" : slots[i] ? t.border : "rgba(255,255,255,0.1)"}`,
                }}>
                <span className="text-[10px] font-bold tracking-widest uppercase mb-2"
                  style={{ color: isGood ? "#34d399" : isBad ? "#f87171" : t.accent }}>{label}</span>
                {block ? (
                  <span className="text-xs font-medium text-slate-200 flex-1">{block.text}</span>
                ) : (
                  <span className="text-xs text-slate-600 flex-1">비어있음</span>
                )}
                {isGood && <CheckCircle2 size={13} style={{ color: "#34d399" }} className="mt-1" />}
                {isBad && <XCircle size={13} style={{ color: "#f87171" }} className="mt-1" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {shuffled.current.map(block => {
            const inSlot = slots.includes(block.id);
            return (
              <div key={block.id} className="rounded-xl p-3 transition-all duration-200"
                style={{
                  background: inSlot ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${inSlot ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)"}`,
                  opacity: inSlot ? 0.3 : 1,
                }}>
                <p className="text-xs font-medium text-slate-200 mb-2">{block.text}</p>
                {!inSlot && !gameSubmitted && (
                  <div className="flex gap-1">
                    {[0, 1, 2].map(si => (
                      <button key={si} onClick={() => fill(block.id, si)}
                        className="flex-1 text-[10px] py-1 rounded-lg font-bold transition-all duration-150"
                        style={{ background: t.dim, color: t.accent, border: `1px solid ${t.border}` }}
                        onMouseEnter={e => { e.currentTarget.style.background = t.grad; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = t.dim; e.currentTarget.style.color = t.accent; }}>
                        슬롯{si + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!gameSubmitted ? (
          <PBtn t={t} onClick={() => setGameSubmitted(true)} disabled={slots.some(s => s === null)}>
            제출하기
          </PBtn>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-xl text-center"
              style={{
                background: allGood ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
                border: `1px solid ${allGood ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
              }}>
              <p className="text-xl font-black text-white mb-1">{allGood ? "🏆 프롬프트 장인 달성!" : "😵 AI가 혼란스러워합니다!"}</p>
              <p className="text-sm text-slate-400">{allGood ? "완벽한 조합입니다!" : '"대충 써줘" 같은 모호한 지시는 좋은 결과를 내지 못해요.'}</p>
            </div>
            <GBtn onClick={() => { setSlots([null, null, null]); setGameSubmitted(false); }}>
              <RotateCcw size={13} />다시 하기
            </GBtn>
          </div>
        )}
      </Card>
    </div>
  );
};

// ─── TAB 5: AI Ethics & Hallucination ─────────────────
const Tab5 = ({ onScore }) => {
  const t = T.ethics;
  const [tempSlider, setTempSlider] = useState(30);
  const [showSecurity, setShowSecurity] = useState(false);
  const [secPhase, setSecPhase] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [results, setResults] = useState([]);
  const [cardAnim, setCardAnim] = useState("");

  const hallucinationExamples = [
    { temp: 10, text: "한국전력은 전력 공급을 담당하는 공기업입니다.", label: "✅ 사실" },
    { temp: 35, text: "한국전력은 1961년에 설립된 공기업입니다.", label: "✅ 사실" },
    { temp: 60, text: "한국전력은 세계 최대 규모의 전력 회사 중 하나입니다.", label: "⚠️ 살짝 과장" },
    { temp: 80, text: "에디슨이 1899년에 한국전력을 직접 설립했다고 합니다.", label: "🚨 환각!" },
    { temp: 95, text: "에디슨이 조선시대에 한국전력을 세워 경복궁에 전기를 공급했습니다.", label: "💀 심한 환각!" },
  ];

  const curHalluc = hallucinationExamples.reduce((prev, cur) =>
    Math.abs(cur.temp - tempSlider) < Math.abs(prev.temp - tempSlider) ? cur : prev
  );

  const isWarning = tempSlider > 70;
  const isMild = tempSlider > 50 && !isWarning;

  const handleSecurity = () => {
    setShowSecurity(true); setSecPhase(0);
    setTimeout(() => setSecPhase(1), 800);
    setTimeout(() => setSecPhase(2), 1600);
  };

  const cards = [
    { text: "우리 본부 하반기 예산안 엑셀 요약해 줘", danger: true, reason: "사내 기밀 예산 정보가 외부로 유출될 수 있습니다." },
    { text: "파이썬으로 데이터 정렬하는 코드 짜줘", danger: false, reason: "일반적인 프로그래밍 질문으로 보안 위험이 없습니다." },
    { text: "고객 김OO의 전화번호와 주소 정리해 줘", danger: true, reason: "고객 개인정보 입력 시 개인정보보호법 위반입니다." },
    { text: "이메일 문법 교정해 줘", danger: false, reason: "일반적인 문법 교정은 보안 위험이 없습니다." },
    { text: "신규 발전소 건설 도면 분석해 줘", danger: true, reason: "미공개 인프라 도면은 국가 핵심 기밀입니다." },
    { text: "엑셀 VLOOKUP 함수 사용법 알려줘", danger: false, reason: "일반 업무 도구 사용법은 보안 위험이 없습니다." },
  ];

  const swipe = (block) => {
    const card = cards[currentCard];
    const correct = block === card.danger;
    setCardAnim(block ? "swipe-left" : "swipe-right");
    setTimeout(() => {
      setResults(p => [...p, { correct, card }]);
      setCurrentCard(p => p + 1);
      setCardAnim("");
    }, 300);
  };

  const gameScore = results.filter(r => r.correct).length;
  useEffect(() => {
    if (results.length === cards.length) onScore?.("ethics", gameScore, cards.length);
  }, [results]);

  return (
    <div className="space-y-6">
      <Card t={t}>
        <SecHead icon={BookOpen} label="AI 주의사항 — 환각과 보안 위험" t={t} />

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} style={{ color: t.accent }} />
            <h4 className="font-bold text-white text-sm">환각 (Hallucination)</h4>
          </div>
          <p className="text-sm text-slate-400 mb-5">상상력 온도를 올려보세요. AI가 점점 그럴싸한 거짓말을 만들어냅니다.</p>
          <div className="rounded-xl p-5" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.12)" }}>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">🧊 정확</span>
                <span style={{ color: t.accent }}>상상력 온도 {tempSlider}%</span>
                <span className="text-slate-500">🔥 위험</span>
              </div>
              <input type="range" min="0" max="100" value={tempSlider}
                onChange={e => setTempSlider(Number(e.target.value))}
                className="w-full" style={{ accentColor: t.accent }} />
            </div>
            <div className="p-4 rounded-xl transition-all duration-500"
              style={{
                background: isWarning ? "rgba(248,113,113,0.1)" : isMild ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)",
                border: `1px solid ${isWarning ? "rgba(248,113,113,0.3)" : isMild ? "rgba(251,191,36,0.3)" : "rgba(52,211,153,0.3)"}`,
              }}>
              <div className="flex items-center gap-2 mb-2">
                <Bot size={13} className="text-slate-400" />
                <span className="text-xs text-slate-400">AI 출력:</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: isWarning ? "rgba(248,113,113,0.2)" : isMild ? "rgba(251,191,36,0.2)" : "rgba(52,211,153,0.2)",
                    color: isWarning ? "#f87171" : isMild ? "#fbbf24" : "#34d399",
                  }}>
                  {curHalluc.label}
                </span>
              </div>
              <p className="text-sm text-slate-200">{curHalluc.text}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={15} style={{ color: t.accent }} />
            <h4 className="font-bold text-white text-sm">보안 위험</h4>
          </div>
          <p className="text-sm text-slate-400 mb-5">기밀 데이터를 AI에 입력하면 어떤 일이 생기는지 확인해 보세요.</p>
          <div className="rounded-xl p-5" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.12)" }}>
            {!showSecurity ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <FileText size={13} className="text-slate-400" />
                  <span className="text-sm text-slate-300">"2026_발전소_설계도면_v3.dwg"</span>
                </div>
                <br />
                <PBtn t={t} onClick={handleSecurity}>⬆️ AI에 업로드 시뮬레이션</PBtn>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { phase: 0, icon: Send, bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", text: "rgba(148,163,184,1)", label: "파일을 AI 서버로 전송 중..." },
                  { phase: 1, icon: Globe, bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)", text: "#fbbf24", label: "⚠️ 데이터가 외부 서버(미국)에 저장됨!" },
                  { phase: 2, icon: AlertTriangle, bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", text: "#f87171", label: "🚨 기밀 도면이 외부 서버에 영구 저장될 수 있습니다. 절대 사내 기밀을 외부 AI에 입력하지 마세요!" },
                ].map((row, i) => (
                  secPhase >= i && (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg"
                      style={{ background: row.bg, border: `1px solid ${row.border}`, animation: i > 0 ? "fadeIn 0.4s" : "" }}>
                      <row.icon size={14} style={{ color: row.text }} className="mt-0.5 shrink-0" />
                      <span className="text-sm" style={{ color: row.text }}>{row.label}</span>
                    </div>
                  )
                ))}
                {secPhase >= 2 && (
                  <GBtn onClick={() => { setShowSecurity(false); setSecPhase(0); }}>
                    <RotateCcw size={12} />리셋
                  </GBtn>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card t={t} game>
        <GameHead icon={Gamepad2} label="보안관 스와이프" t={t} />
        <p className="text-sm text-slate-400 mb-6">AI 사용 요청을 심사하세요. 위험하면 차단, 안전하면 허용!</p>

        {currentCard < cards.length ? (
          <div className="space-y-6">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">{currentCard + 1} / {cards.length}</span>
              <span style={{ color: t.accent }}>정답 {gameScore}/{results.length}</span>
            </div>

            <div className={`relative mx-auto max-w-sm transition-all duration-300 ${
              cardAnim === "swipe-left" ? "-translate-x-full opacity-0 -rotate-12" :
              cardAnim === "swipe-right" ? "translate-x-full opacity-0 rotate-12" : ""
            }`}>
              <div className="p-6 rounded-2xl min-h-[150px] flex flex-col items-center justify-center text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <MessageSquare size={22} className="text-slate-500 mb-4" />
                <p className="text-sm font-bold text-white leading-relaxed">"{cards[currentCard].text}"</p>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              {[
                { action: true, icon: ThumbsDown, label: "차단", color: "#f87171", dim: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
                { action: false, icon: ThumbsUp, label: "허용", color: "#34d399", dim: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
              ].map(btn => (
                <button key={btn.label} onClick={() => swipe(btn.action)}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl transition-all duration-200 group"
                  style={{ background: btn.dim, border: `1px solid ${btn.border}` }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 25px ${btn.color}40`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <btn.icon size={26} style={{ color: btn.color }} />
                  <span className="text-xs font-black" style={{ color: btn.color }}>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-5 rounded-xl text-center"
              style={{
                background: gameScore === cards.length ? "rgba(52,211,153,0.08)" : "rgba(251,191,36,0.08)",
                border: `1px solid ${gameScore === cards.length ? "rgba(52,211,153,0.3)" : "rgba(251,191,36,0.3)"}`,
              }}>
              {gameScore === cards.length && <Trophy size={28} style={{ color: "#34d399" }} className="mx-auto mb-2" />}
              <div className="text-4xl font-black text-white mb-1">{gameScore}<span className="text-xl text-slate-500">/{cards.length}</span></div>
              <p className="text-sm text-slate-300">{gameScore === cards.length ? "🛡️ 완벽한 보안관!" : `${cards.length - gameScore}건을 놓쳤습니다.`}</p>
            </div>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="p-3 rounded-xl"
                  style={{
                    background: r.correct ? "rgba(52,211,153,0.06)" : "rgba(248,113,113,0.06)",
                    border: `1px solid ${r.correct ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
                  }}>
                  <div className="flex items-center gap-2 mb-1">
                    {r.correct
                      ? <CheckCircle2 size={13} style={{ color: "#34d399" }} />
                      : <XCircle size={13} style={{ color: "#f87171" }} />}
                    <span className="text-xs font-semibold text-slate-200">"{r.card.text}"</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-5">{r.card.reason}</p>
                </div>
              ))}
            </div>
            <GBtn onClick={() => { setCurrentCard(0); setResults([]); setCardAnim(""); }}>
              <RotateCcw size={13} />다시 하기
            </GBtn>
          </div>
        )}
      </Card>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────
const tabs = [
  { id: "concept", label: "AI 개념과 역사", shortLabel: "AI 개념", icon: Brain, component: Tab1 },
  { id: "how", label: "AI 동작원리", shortLabel: "동작원리", icon: Cpu, component: Tab2 },
  { id: "apply", label: "AI 실무적용", shortLabel: "실무적용", icon: Zap, component: Tab3 },
  { id: "prompt", label: "프롬프트 꿀팁", shortLabel: "프롬프트", icon: Sparkles, component: Tab4 },
  { id: "ethics", label: "AI 주의사항", shortLabel: "주의사항", icon: Shield, component: Tab5 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("concept");
  const [scores, setScores] = useState({});

  const handleScore = (tabId, score, total) => {
    setScores(p => ({ ...p, [tabId]: { score, total } }));
  };

  const totalScore = Object.values(scores).reduce((a, s) => a + s.score, 0);
  const totalMax = Object.values(scores).reduce((a, s) => a + s.total, 0);
  const completedTabs = Object.keys(scores).length;

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;
  const theme = T[activeTab];

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(160deg, #070b18 0%, #0a0f1e 50%, #070b18 100%)",
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        @keyframes pulse-glow { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        .tab-content { animation: fadeIn 0.35s ease-out; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        input[type=range] { height: 6px; border-radius: 6px; cursor: pointer; }
      `}</style>

      {/* Header */}
      <header style={{ background: "rgba(7,11,24,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#6d28d9,#38bdf8)", boxShadow: "0 0 24px rgba(109,40,217,0.5)" }}>
              <Brain size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-black text-white tracking-tight">AI 기초 교육</h1>
              <p className="text-xs text-slate-500">전력산업 종사자를 위한 인터랙티브 학습 가이드</p>
            </div>
            {completedTabs > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-semibold">TOTAL XP</p>
                  <p className="text-sm font-black text-white">{totalScore}<span className="text-slate-600 text-xs">/{totalMax}</span></p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}>
                  <Star size={14} style={{ color: "#fbbf24" }} />
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex gap-1">
            {tabs.map(tab => (
              <div key={tab.id} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: scores[tab.id] ? "100%" : "0%", background: T[tab.id].grad }} />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{ background: "rgba(7,11,24,0.8)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const th = T[tab.id];
              const done = !!scores[tab.id];
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative"
                  style={{
                    background: isActive ? th.dim : "transparent",
                    color: isActive ? th.accent : "#475569",
                    border: `1px solid ${isActive ? th.border : "transparent"}`,
                    boxShadow: isActive ? `0 0 20px ${th.glow}` : "none",
                  }}>
                  <Icon size={15} />
                  <span className="hidden sm:inline">{tab.shortLabel}</span>
                  {done && (
                    <span className="w-1.5 h-1.5 rounded-full absolute top-2 right-2"
                      style={{ background: th.accent, boxShadow: `0 0 6px ${th.glow}` }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="tab-content" key={activeTab}>
          <ActiveComponent onScore={handleScore} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "3rem" }}>
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <p className="text-xs text-slate-600">AI 기초 교육 · 전력산업 종사자 인터랙티브 학습</p>
          {completedTabs === tabs.length && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)" }}>
              <Trophy size={13} style={{ color: "#fbbf24" }} />
              <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>전 과정 완료!</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
