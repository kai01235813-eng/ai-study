import { useState, useEffect, useRef, useCallback } from "react";
import {
  Brain, Cpu, Zap, Shield, Sparkles, ChevronRight, ChevronDown,
  Folder, FolderOpen, User, FileText, Target, ArrowRight, ArrowLeft,
  RotateCcw, Play, CheckCircle2, XCircle, AlertTriangle, Lock,
  Unlock, Lightbulb, Timer, TrendingUp, TrendingDown, Activity,
  Gauge, BookOpen, Gamepad2, GripVertical, ThumbsUp, ThumbsDown,
  Award, Star, Eye, Layers, Network, Settings, RefreshCw, X,
  Check, MessageSquare, Bot, ServerCrash, Globe, Send, Blocks,
  CircuitBoard, Workflow, Binary, SlidersHorizontal, Volume2
} from "lucide-react";

// ─── Shared Components ────────────────────────────────
const SectionDivider = ({ conceptTitle, gameTitle }) => null;

const ConceptHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
      <Icon size={16} className="text-gray-500" />
    </div>
    <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{title}</span>
  </div>
);

const GameHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
      <Icon size={16} className="text-white" />
    </div>
    <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{title}</span>
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

// ─── TAB 1: AI Concepts & History ────────────────────
const Tab1 = () => {
  const [expanded, setExpanded] = useState(new Set());
  const [gameAnswers, setGameAnswers] = useState({});
  const [gameSubmitted, setGameSubmitted] = useState(false);

  const orgData = {
    id: "ai",
    label: "AI 본부",
    role: "전체 본부",
    icon: Brain,
    desc: "인간의 지능을 모방하는 모든 기술의 총칭입니다. 규칙 기반 시스템부터 최신 생성형 AI까지, 사람처럼 생각하고 판단하는 모든 프로그램이 여기에 속합니다.",
    example: "예: 스팸 필터, 자동 번역, 음성 인식, 자율주행 등",
    children: [{
      id: "ml",
      label: "머신러닝 팀",
      role: "팀",
      icon: TrendingUp,
      desc: "사람이 일일이 규칙을 짜주는 대신, 데이터를 주고 '스스로 패턴을 찾아라!'라고 시키는 기술입니다. 마치 신입사원에게 과거 보고서를 잔뜩 주고 알아서 요령을 터득하게 하는 것과 같습니다.",
      example: "예: 전력 수요 예측, 고장 장비 탐지, 고객 이탈 예측",
      children: [{
        id: "dl",
        label: "딥러닝 파트",
        role: "파트",
        icon: Network,
        desc: "머신러닝의 '엘리트 부대'입니다. 인간의 뇌 신경망을 모방한 수십~수백 층의 네트워크로 복잡한 패턴을 학습합니다. 데이터가 많을수록 더 똑똑해지는 것이 특징입니다.",
        example: "예: 이미지 인식, 음성 인식, 자연어 처리",
        children: [{
          id: "genai",
          label: "생성형 AI (LLM)",
          role: "에이스 사원",
          icon: Sparkles,
          desc: "딥러닝의 에이스! 기존 AI가 '분류·예측'에 그쳤다면, 생성형 AI는 글, 그림, 코드 등 새로운 콘텐츠를 '창작'합니다. ChatGPT, Claude 등이 여기에 해당합니다.",
          example: "예: 보고서 초안 작성, 코드 생성, 이미지 생성, 요약",
          children: []
        }]
      }]
    }]
  };

  const toggleExpand = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const OrgNode = ({ node, depth = 0 }) => {
    const isOpen = expanded.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const Icon = node.icon;
    const depthColors = [
      "border-gray-300 bg-white",
      "border-gray-200 bg-gray-50/50",
      "border-gray-200 bg-gray-50/30",
      "border-gray-200 bg-gray-50/20"
    ];

    return (
      <div className={`${depth > 0 ? "ml-4 sm:ml-8" : ""}`}>
        <div
          onClick={() => { toggleExpand(node.id); }}
          className={`border ${depthColors[depth]} rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${isOpen ? "shadow-sm" : ""}`}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <div className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ) : <div className="w-4" />}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${depth === 0 ? "bg-gray-900 text-white" : depth === 1 ? "bg-gray-700 text-white" : depth === 2 ? "bg-gray-500 text-white" : "bg-gray-900 text-white"}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{node.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{node.role}</span>
              </div>
            </div>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
            <div className="pl-[52px] sm:pl-[56px]">
              <p className="text-sm text-gray-600 leading-relaxed">{node.desc}</p>
              <p className="text-xs text-gray-400 mt-1.5">{node.example}</p>
            </div>
          </div>
        </div>
        {hasChildren && (
          <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[2000px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            {node.children.map(child => <OrgNode key={child.id} node={child} depth={depth + 1} />)}
          </div>
        )}
      </div>
    );
  };

  const tasks = [
    { id: "t1", text: "정해진 규칙대로 스팸 메일을 자동 차단", answer: "program", emoji: "📧" },
    { id: "t2", text: "과거 10년간의 전력 수요 데이터를 분석해 내일 수요를 예측", answer: "ml", emoji: "📊" },
    { id: "t3", text: "이번 폭염 대비 대국민 절전 안내문 초안 작성", answer: "genai", emoji: "✍️" },
    { id: "t4", text: "송전탑 사진을 보고 결함 부위를 자동 탐지", answer: "ml", emoji: "🔍" },
    { id: "t5", text: "IF-THEN 규칙으로 전압이 낮으면 알람 울리기", answer: "program", emoji: "🚨" },
    { id: "t6", text: "신입사원 교육 자료를 질의응답 챗봇으로 변환", answer: "genai", emoji: "💬" },
  ];

  const targets = [
    { id: "program", label: "일반 프로그램 / 초기 AI", icon: Cpu, desc: "규칙 기반" },
    { id: "ml", label: "머신러닝 / 딥러닝", icon: Network, desc: "데이터 학습" },
    { id: "genai", label: "생성형 AI", icon: Sparkles, desc: "콘텐츠 창작" },
  ];

  const handleAssign = (taskId, targetId) => {
    if (gameSubmitted) return;
    setGameAnswers(prev => ({ ...prev, [taskId]: targetId }));
  };

  const handleSubmit = () => setGameSubmitted(true);
  const handleReset = () => { setGameAnswers({}); setGameSubmitted(false); };

  const score = gameSubmitted ? tasks.filter(t => gameAnswers[t.id] === t.answer).length : 0;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <ConceptHeader icon={BookOpen} title="개념 쏙쏙 — AI 조직도" />
        <p className="text-sm text-gray-500 mb-6">각 항목을 클릭하면 하위 조직과 설명이 펼쳐집니다.</p>
        <OrgNode node={orgData} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <GameHeader icon={Gamepad2} title="실전 게임 — 업무 분장 타이쿤" />
        <p className="text-sm text-gray-500 mb-6">각 업무를 읽고, 가장 적합한 담당자를 선택하세요!</p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {targets.map(t => (
            <div key={t.id} className="text-center p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <t.icon size={20} className="mx-auto mb-1 text-gray-600" />
              <div className="text-xs font-semibold text-gray-700">{t.label}</div>
              <div className="text-[10px] text-gray-400">{t.desc}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {tasks.map(task => {
            const selected = gameAnswers[task.id];
            const isCorrect = gameSubmitted && selected === task.answer;
            const isWrong = gameSubmitted && selected && selected !== task.answer;
            return (
              <div key={task.id} className={`p-4 rounded-xl border transition-all ${isCorrect ? "border-emerald-200 bg-emerald-50/50" : isWrong ? "border-red-200 bg-red-50/50" : "border-gray-100"}`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-lg">{task.emoji}</span>
                  <p className="text-sm text-gray-700 flex-1">{task.text}</p>
                  {gameSubmitted && (isCorrect ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> : isWrong ? <XCircle size={18} className="text-red-500 shrink-0" /> : null)}
                </div>
                <div className="flex gap-2 ml-8">
                  {targets.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleAssign(task.id, t.id)}
                      disabled={gameSubmitted}
                      className={`flex-1 text-xs py-2 px-2 rounded-lg border transition-all ${selected === t.id ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"} ${gameSubmitted ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {t.label.split("/")[0].trim()}
                    </button>
                  ))}
                </div>
                {isWrong && <p className="text-xs text-red-500 mt-2 ml-8">정답: {targets.find(t => t.id === task.answer)?.label}</p>}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-6">
          {!gameSubmitted ? (
            <button onClick={handleSubmit} disabled={Object.keys(gameAnswers).length < tasks.length} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl disabled:opacity-30 hover:bg-gray-800 transition-all">
              제출하기
            </button>
          ) : (
            <>
              <Badge variant={score === tasks.length ? "success" : score >= 4 ? "warning" : "error"}>
                {score}/{tasks.length}점
              </Badge>
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                <RotateCcw size={14} /> 다시 하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── TAB 2: How AI Works ─────────────────────────────
const Tab2 = () => {
  const [step, setStep] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePhase, setGamePhase] = useState("attention"); // attention, predict, result
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(100);
  const [gameScore, setGameScore] = useState(null);
  const timerRef = useRef(null);

  const steps = [
    {
      title: "토큰화 (Tokenization)",
      subtitle: "말 토막 내기",
      icon: Blocks,
      content: () => {
        const [tokenized, setTokenized] = useState(false);
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-3">김대리가 말합니다:</p>
              <div className="relative">
                {!tokenized ? (
                  <p className="text-lg font-medium text-gray-800 tracking-wide">"저 내일 오후에..."</p>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {["저", "내일", "오후에", "..."].map((t, i) => (
                      <span key={i} className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono font-semibold text-gray-800 shadow-sm" style={{ animationDelay: `${i * 150}ms`, animation: "slideUp 0.4s ease-out forwards", opacity: 0, transform: "translateY(10px)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setTokenized(!tokenized)} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all">
              {tokenized ? "원문 보기" : "토큰화 실행 ✂️"}
            </button>
            <p className="text-sm text-gray-500 leading-relaxed">AI는 문장을 한꺼번에 이해하지 못합니다. 마치 긴 문장을 단어 카드로 잘라내듯, 텍스트를 작은 조각(토큰)으로 쪼개는 것이 첫 단계입니다.</p>
          </div>
        );
      }
    },
    {
      title: "임베딩 (Embedding)",
      subtitle: "뇌피셜 수치화",
      icon: Binary,
      content: () => {
        const [showScores, setShowScores] = useState(false);
        const embeddings = [
          { token: "저", scores: [{ label: "주어 확률", val: 9 }, { label: "긴급도", val: 2 }] },
          { token: "내일", scores: [{ label: "시간 관련", val: 9 }, { label: "퇴근 임박", val: 3 }] },
          { token: "오후에", scores: [{ label: "퇴근 임박", val: 8 }, { label: "피곤함", val: 5 }] },
        ];
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">부장님이 김대리의 말을 수첩에 기록합니다. 각 단어에 수치(벡터)를 부여합니다.</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 font-medium">
                <FileText size={14} /> 부장님의 수첩 (엑셀)
              </div>
              {embeddings.map((emb, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-4">
                  <span className="font-mono font-semibold text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-800">{emb.token}</span>
                  <ArrowRight size={14} className="text-gray-300" />
                  <div className="flex-1 flex gap-2 flex-wrap">
                    {showScores && emb.scores.map((s, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs" style={{ animation: "fadeIn 0.3s ease-out forwards", animationDelay: `${(i * 2 + j) * 100}ms`, opacity: 0 }}>
                        <span className="text-gray-500">{s.label}:</span>
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-700 rounded-full transition-all duration-700" style={{ width: `${s.val * 10}%` }} />
                        </div>
                        <span className="font-mono text-gray-700 font-semibold">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowScores(!showScores)} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all">
              {showScores ? "수치 숨기기" : "수치화 시작 📊"}
            </button>
          </div>
        );
      }
    },
    {
      title: "셀프 어텐션 (Self-Attention)",
      subtitle: "눈치 챙기기",
      icon: Eye,
      content: () => {
        const [showLinks, setShowLinks] = useState(false);
        const words = ["저", "내일", "오후에"];
        const context = "어제 김대리가 한숨을 쉬었다는 사실!";
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">부장님은 단어들 사이의 관계와 숨겨진 문맥을 파악합니다.</p>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                {words.map((w, i) => (
                  <span key={i} className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all duration-500 ${showLinks && w === "오후에" ? "bg-gray-900 text-white border-gray-900 scale-110" : "bg-white border-gray-200 text-gray-700"}`}>
                    {w}
                  </span>
                ))}
              </div>
              {showLinks && (
                <div className="space-y-3" style={{ animation: "fadeIn 0.5s ease-out" }}>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-sm">💨</span>
                    <span className="text-sm text-gray-600">{context}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-lg">🔗</span>
                    <div>
                      <p className="text-sm font-medium text-red-700">"한숨" + "오후" → 어텐션 가중치 <span className="font-mono font-bold">0.92</span> (매우 강함)</p>
                      <p className="text-xs text-red-500 mt-0.5">이 두 정보가 강하게 연결됩니다!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setShowLinks(!showLinks)} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all">
              {showLinks ? "초기화" : "문맥 연결 시작 🔗"}
            </button>
          </div>
        );
      }
    },
    {
      title: "순전파 & FFN",
      subtitle: "생각의 직진",
      icon: CircuitBoard,
      content: () => {
        const [running, setRunning] = useState(false);
        const [activeLayer, setActiveLayer] = useState(-1);
        const layers = ["입력층", "은닉층 1", "은닉층 2", "은닉층 3", "출력층"];

        useEffect(() => {
          if (running) {
            let i = 0;
            const interval = setInterval(() => {
              setActiveLayer(i);
              i++;
              if (i >= layers.length) { clearInterval(interval); }
            }, 600);
            return () => clearInterval(interval);
          } else { setActiveLayer(-1); }
        }, [running]);

        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">정보들이 부장님의 뇌세포(신경망)를 차례로 통과하며 결론을 향해 전진합니다.</p>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center justify-between gap-1 sm:gap-2">
                {layers.map((l, i) => (
                  <div key={i} className="flex items-center gap-1 sm:gap-2 flex-1">
                    <div className={`flex-1 h-14 sm:h-16 rounded-xl border-2 flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-500 ${i <= activeLayer ? "bg-gray-900 text-white border-gray-900 scale-105" : "bg-white text-gray-400 border-gray-200"}`}>
                      <span className="hidden sm:inline">{l}</span>
                      <span className="sm:hidden">{i === 0 ? "입력" : i === layers.length - 1 ? "출력" : `H${i}`}</span>
                    </div>
                    {i < layers.length - 1 && (
                      <ArrowRight size={12} className={`shrink-0 transition-colors duration-300 ${i < activeLayer ? "text-gray-900" : "text-gray-300"}`} />
                    )}
                  </div>
                ))}
              </div>
              {activeLayer >= layers.length - 1 && (
                <div className="mt-4 text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
                  <p className="text-sm font-medium text-gray-700">💡 계산 완료! 결론 도출 준비 중...</p>
                </div>
              )}
            </div>
            <button onClick={() => setRunning(!running)} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all">
              {running ? "리셋 🔄" : "순전파 시작 ⚡"}
            </button>
          </div>
        );
      }
    },
    {
      title: "소프트맥스 (Softmax)",
      subtitle: "머릿속 룰렛",
      icon: Gauge,
      content: () => {
        const [showResult, setShowResult] = useState(false);
        const predictions = [
          { label: "반차", prob: 80, color: "#1a1a1a" },
          { label: "외근", prob: 15, color: "#6b7280" },
          { label: "퇴사", prob: 5, color: "#d1d5db" },
        ];
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">최종 계산 결과가 확률 분포로 변환됩니다. 각 예측에 0~100%의 확률이 부여됩니다.</p>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="space-y-3">
                {predictions.map((p, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{p.label}</span>
                      <span className="font-mono font-semibold text-gray-900">{showResult ? `${p.prob}%` : "??%"}</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: showResult ? `${p.prob}%` : "0%", backgroundColor: p.color, transitionDelay: `${i * 200}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
              {showResult && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
                  <p className="text-sm text-gray-600">부장님 결론: <span className="font-bold text-gray-900">"김대리, 내일 반차 쓸 거지?"</span></p>
                </div>
              )}
            </div>
            <button onClick={() => setShowResult(!showResult)} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all">
              {showResult ? "숨기기" : "확률 계산 🎰"}
            </button>
          </div>
        );
      }
    },
    {
      title: "자기회귀 (Auto-regression)",
      subtitle: "꼬리 무는 예측",
      icon: RefreshCw,
      content: () => {
        const [iteration, setIteration] = useState(0);
        const tokens = ["저", "내일", "오후에", "반차", "쓰겠습니다"];
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">예측된 단어를 붙이고, 다시 전체 문장으로 다음 단어를 예측하는 순환 구조입니다.</p>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {tokens.slice(0, 3 + iteration).map((t, i) => (
                  <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${i >= 3 ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-700"}`} style={i >= 3 ? { animation: "slideUp 0.4s ease-out forwards" } : {}}>
                    {t}
                  </span>
                ))}
                {iteration < 2 && <span className="px-3 py-1.5 text-gray-300 text-sm animate-pulse">???</span>}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <RefreshCw size={12} className={iteration > 0 ? "animate-spin" : ""} />
                <span>{iteration === 0 ? "다음 단어를 예측해 보세요" : iteration === 1 ? "'반차'를 예측했습니다! 한 번 더!" : "완성! 순환 예측 종료 ✅"}</span>
              </div>
            </div>
            <button onClick={() => setIteration(prev => Math.min(prev + 1, 2))} disabled={iteration >= 2} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all disabled:opacity-30">
              다음 단어 예측 🔄
            </button>
            {iteration >= 2 && <button onClick={() => setIteration(0)} className="ml-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-800"><RotateCcw size={14} className="inline mr-1" />리셋</button>}
          </div>
        );
      }
    },
    {
      title: "역전파 (Backpropagation)",
      subtitle: "뼈저린 반성",
      icon: RotateCcw,
      content: () => {
        const [phase, setPhase] = useState(0); // 0: before, 1: shock, 2: fix
        const [shake, setShake] = useState(false);

        const handleReveal = () => {
          setPhase(1);
          setShake(true);
          setTimeout(() => setShake(false), 600);
          setTimeout(() => setPhase(2), 1500);
        };

        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">예측이 틀렸을 때 오차를 계산하고, 거꾸로 돌아가며 가중치를 수정합니다.</p>
            <div className={`bg-gray-50 rounded-xl p-5 transition-all ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
              {phase === 0 && (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">부장님의 예측: <span className="font-bold">"반차 쓸 거지?" (80%)</span></p>
                  <p className="text-gray-400 text-sm">그런데 김대리의 실제 대답은...</p>
                </div>
              )}
              {phase >= 1 && (
                <div className="text-center space-y-4" style={{ animation: "fadeIn 0.5s ease-out" }}>
                  <div className="inline-block p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-lg font-bold text-red-700">💥 "사직서 내겠습니다"</p>
                  </div>
                  <p className="text-sm text-red-500 font-medium">예측 실패! 오차율: 95%</p>
                </div>
              )}
              {phase >= 2 && (
                <div className="mt-4 space-y-3" style={{ animation: "fadeIn 0.5s ease-out" }}>
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-400 mb-2">🔧 가중치 수정 중...</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 w-32">"한숨 → 반차" 가중치:</span>
                        <span className="line-through text-red-400">0.92</span>
                        <ArrowRight size={10} />
                        <span className="text-emerald-600 font-bold">0.3</span>
                        <span className="text-gray-400">↓ 대폭 감소</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 w-32">"한숨 → 퇴사" 가중치:</span>
                        <span className="line-through text-red-400">0.05</span>
                        <ArrowRight size={10} />
                        <span className="text-emerald-600 font-bold">0.85</span>
                        <span className="text-gray-400">↑ 대폭 증가</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-700">💡 부장님의 깨달음: <em>"요즘 세대는 피곤하면 반차가 아니라 퇴사구나..."</em></p>
                  </div>
                </div>
              )}
            </div>
            {phase === 0 ? (
              <button onClick={handleReveal} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all">
                실제 답 공개 😱
              </button>
            ) : (
              <button onClick={() => setPhase(0)} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-800">
                <RotateCcw size={14} /> 처음부터
              </button>
            )}
          </div>
        );
      }
    },
  ];

  // Game logic
  const gameWords = ["부장님", "이번", "프로젝트", "예산이"];
  const keyWords = new Set(["프로젝트", "예산이"]);
  const predictionOptions = [
    { word: "부족합니다", prob: 65, correct: true },
    { word: "남았습니다", prob: 20, correct: false },
    { word: "좋습니다", prob: 10, correct: false },
    { word: "삭제됐습니다", prob: 5, correct: false },
  ];

  useEffect(() => {
    if (gameStarted && gamePhase === "attention" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 2), 100);
      return () => clearTimeout(timerRef.current);
    }
    if (timeLeft <= 0 && gamePhase === "attention") {
      setGamePhase("predict");
      setTimeLeft(100);
    }
  }, [gameStarted, gamePhase, timeLeft]);

  useEffect(() => {
    if (gamePhase === "predict" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1.5), 100);
      return () => clearTimeout(timerRef.current);
    }
    if (timeLeft <= 0 && gamePhase === "predict" && !selectedPrediction) {
      setGamePhase("result");
      setGameScore(0);
    }
  }, [gamePhase, timeLeft, selectedPrediction]);

  const handlePrediction = (option) => {
    setSelectedPrediction(option);
    clearTimeout(timerRef.current);
    const attentionScore = [...selectedWords].filter(w => keyWords.has(w)).length * 25;
    const predScore = option.correct ? 50 : 0;
    setGameScore(attentionScore + predScore);
    setGamePhase("result");
  };

  const resetGame = () => {
    setGameStarted(false);
    setGamePhase("attention");
    setSelectedWords(new Set());
    setSelectedPrediction(null);
    setTimeLeft(100);
    setGameScore(null);
  };

  const StepContent = steps[step]?.content;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <ConceptHeader icon={BookOpen} title="개념 쏙쏙 — 부장님의 눈치 게임 👀" />
        <p className="text-sm text-gray-500 mb-6">LLM의 작동 원리를 7단계로 체험하세요. 각 단계를 클릭해서 진행합니다.</p>

        {/* Step nav */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${i === step ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="font-mono">{i + 1}</span>
              <span className="hidden sm:inline">{s.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            {(() => { const Icon = steps[step].icon; return <Icon size={20} className="text-gray-700" />; })()}
            <div>
              <h3 className="font-semibold text-gray-900">{steps[step].title}</h3>
              <p className="text-xs text-gray-400">{steps[step].subtitle}</p>
            </div>
          </div>
          <StepContent />
        </div>

        {/* Step navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors">
            <ArrowLeft size={14} /> 이전
          </button>
          <span className="text-xs text-gray-400 self-center">{step + 1} / {steps.length}</span>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors">
            다음 <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Game section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <GameHeader icon={Gamepad2} title="실전 게임 — 부장님 시뮬레이터" />

        {!gameStarted ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 mb-4">새로운 문장이 들어왔습니다! 핵심 단어를 찾고 다음 단어를 예측하세요.</p>
            <button onClick={() => setGameStarted(true)} className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all">
              <Play size={16} className="inline mr-2" /> 게임 시작
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timer */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{gamePhase === "attention" ? "⏱ 핵심 단어를 클릭!" : gamePhase === "predict" ? "⏱ 다음 단어를 예측!" : "결과"}</span>
                <span>{gamePhase !== "result" ? `${Math.round(timeLeft)}%` : ""}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-100 ${timeLeft > 30 ? "bg-gray-900" : "bg-red-500"}`} style={{ width: `${gamePhase !== "result" ? timeLeft : 0}%` }} />
              </div>
            </div>

            {/* Sentence */}
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-xs text-gray-400 mb-3">💬 김대리:</p>
              <div className="flex gap-2 flex-wrap">
                {gameWords.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (gamePhase === "attention") {
                        setSelectedWords(prev => {
                          const next = new Set(prev);
                          if (next.has(w)) next.delete(w); else next.add(w);
                          return next;
                        });
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedWords.has(w) ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"} ${gamePhase !== "attention" ? "cursor-default" : "cursor-pointer"}`}
                  >
                    {w}
                  </button>
                ))}
                <span className="px-4 py-2 text-gray-400 text-sm">???</span>
              </div>
            </div>

            {/* Prediction phase */}
            {gamePhase === "predict" && (
              <div className="space-y-3" style={{ animation: "fadeIn 0.5s ease-out" }}>
                <p className="text-sm text-gray-600 font-medium">다음 단어로 가장 적절한 것은?</p>
                <div className="grid grid-cols-2 gap-2">
                  {predictionOptions.map((opt, i) => (
                    <button key={i} onClick={() => handlePrediction(opt)} className="p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-400 text-sm text-gray-700 text-left transition-all">
                      <span className="font-medium">{opt.word}</span>
                      <span className="text-xs text-gray-400 ml-2">{opt.prob}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            {gamePhase === "result" && (
              <div className="space-y-4" style={{ animation: "fadeIn 0.5s ease-out" }}>
                <div className={`p-5 rounded-xl border text-center ${gameScore >= 75 ? "bg-emerald-50 border-emerald-200" : gameScore >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                  <div className="text-3xl font-bold mb-1">{gameScore}점</div>
                  <p className="text-sm text-gray-600">
                    {gameScore >= 75 ? "🎉 훌륭한 눈치! 부장님 레벨!" : gameScore >= 50 ? "👍 나쁘지 않아요!" : "😅 눈치가 아직..."}
                  </p>
                  <div className="mt-3 text-xs text-gray-500 space-y-1">
                    <p>어텐션 점수: {[...selectedWords].filter(w => keyWords.has(w)).length}/{keyWords.size} 핵심 단어 (정답: 프로젝트, 예산이)</p>
                    <p>예측: {selectedPrediction ? (selectedPrediction.correct ? "정답! ✅" : `"${selectedPrediction.word}" - 오답 ❌`) : "시간 초과 ⏰"}</p>
                  </div>
                </div>
                <button onClick={resetGame} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-800 mx-auto">
                  <RotateCcw size={14} /> 다시 하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TAB 3: AI in Power Industry ─────────────────────
const Tab3 = () => {
  const [scenario, setScenario] = useState(null);
  const [showAi, setShowAi] = useState(false);

  // Game state
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
    { id: "heat", label: "갑작스러운 폭염 🌡️", icon: "🌡️" },
    { id: "factory", label: "대규모 공장 가동 🏭", icon: "🏭" },
  ];

  // Game loop
  useEffect(() => {
    if (gameRunning && !gameOver) {
      gameRef.current = setInterval(() => {
        setGameTime(prev => {
          const newTime = prev + 1;
          if (newTime >= 100) {
            clearInterval(gameRef.current);
            setGameOver(true);
            setSurvived(true);
            return 100;
          }

          const demand = 50 + Math.sin(newTime * 0.15) * 20 + Math.sin(newTime * 0.07) * 15 + (Math.random() - 0.5) * 10;
          const clampedDemand = Math.max(10, Math.min(90, demand));

          setDemandHistory(prev => [...prev.slice(-40), clampedDemand]);

          if (aiMode) {
            setSliderVal(clampedDemand);
            setSupplyHistory(prev => [...prev.slice(-40), clampedDemand]);
          } else {
            setSupplyHistory(prev => [...prev.slice(-40), sliderVal]);
            const diff = Math.abs(sliderVal - clampedDemand);
            if (diff > 25) {
              setScore(prev => {
                const newScore = prev - 2;
                if (newScore <= 0) {
                  clearInterval(gameRef.current);
                  setGameOver(true);
                  setSurvived(false);
                  return 0;
                }
                return newScore;
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
    setGameRunning(true);
    setGameOver(false);
    setSurvived(false);
    setGameTime(0);
    setDemandHistory([]);
    setSupplyHistory([]);
    setScore(100);
    setAiMode(false);
    setSliderVal(50);
  };

  const MiniChart = ({ data, color, height = 60 }) => {
    if (data.length < 2) return <div style={{ height }} className="bg-gray-50 rounded-lg" />;
    const max = 100;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }} className="w-full">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <ConceptHeader icon={BookOpen} title="개념 쏙쏙 — 전력망의 미래" />
        <p className="text-sm text-gray-500 mb-6">시나리오를 선택해 수동 예측 vs AI 예측의 차이를 비교해 보세요.</p>

        <div className="flex gap-3 mb-6">
          {scenarios.map(s => (
            <button key={s.id} onClick={() => { setScenario(s.id); setShowAi(false); }} className={`flex-1 p-4 rounded-xl border text-sm transition-all ${scenario === s.id ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"}`}>
              <span className="text-lg block mb-1">{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {scenario && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5"><User size={12} /> 수동 예측</div>
              <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                <svg viewBox="0 0 200 80" className="w-full h-full">
                  {scenario === "heat" ? (
                    <>
                      <polyline points="0,60 30,55 50,50 70,40 80,20 90,50 110,15 130,55 150,25 180,45 200,30" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <polyline points="0,55 30,53 50,52 70,50 80,48 90,47 110,46 130,45 150,44 180,43 200,42" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4 2" />
                    </>
                  ) : (
                    <>
                      <polyline points="0,50 20,50 40,45 50,15 60,55 80,10 100,60 120,20 150,50 200,45" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <polyline points="0,48 30,47 60,46 90,45 120,44 150,44 200,43" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4 2" />
                    </>
                  )}
                </svg>
              </div>
              <p className="text-xs text-red-500">⚠️ 예측 실패! 수급 불균형 발생</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5"><Bot size={12} /> AI 예측</div>
              <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                {showAi ? (
                  <svg viewBox="0 0 200 80" className="w-full h-full">
                    <polyline points="0,60 30,55 50,50 70,40 80,25 90,30 110,22 130,28 150,25 180,27 200,30" fill="none" stroke="#10b981" strokeWidth="2" />
                    <polyline points="0,58 30,54 50,49 70,39 80,26 90,31 110,23 130,29 150,26 180,28 200,31" fill="none" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                ) : (
                  <p className="text-xs text-gray-400">AI를 활성화하세요</p>
                )}
              </div>
              {showAi && <p className="text-xs text-emerald-600">✅ 수만 건의 과거 데이터로 즉시 대응!</p>}
            </div>
          </div>
        )}
        {scenario && !showAi && (
          <button onClick={() => setShowAi(true)} className="mt-4 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all">
            AI 예측 활성화 ⚡
          </button>
        )}
      </div>

      {/* Game */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <GameHeader icon={Gamepad2} title="실전 게임 — 블랙아웃을 막아라!" />

        {!gameRunning ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-sm text-gray-500">전력 수요에 맞춰 발전량을 조절하세요! 차이가 크면 정전됩니다.</p>
            <button onClick={startGame} className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all">
              <Play size={16} className="inline mr-2" /> 시작
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Badge variant={score > 50 ? "success" : score > 20 ? "warning" : "error"}>
                  안정도: {score}%
                </Badge>
                <span className="text-xs text-gray-400">{Math.round(gameTime)}%</span>
              </div>
              {!aiMode && !gameOver && (
                <button onClick={() => setAiMode(true)} className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-all">
                  <Cpu size={12} className="inline mr-1" /> AI 모드 켜기
                </button>
              )}
              {aiMode && <Badge variant="info">🤖 AI 자동 제어 중</Badge>}
            </div>

            {/* Progress */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900 rounded-full transition-all" style={{ width: `${gameTime}%` }} />
            </div>

            {/* Chart area */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex gap-4 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1"><div className="w-3 h-0.5 bg-red-500 rounded" /> 전력 수요</span>
                <span className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-500 rounded" /> 발전량(나)</span>
              </div>
              <div className="h-20 relative">
                <MiniChart data={demandHistory} color="#ef4444" height={80} />
                <div className="absolute inset-0">
                  <MiniChart data={supplyHistory} color="#3b82f6" height={80} />
                </div>
              </div>
            </div>

            {/* Slider */}
            {!aiMode && !gameOver && (
              <div className="space-y-2">
                <label className="text-xs text-gray-500">발전량 조절: {Math.round(sliderVal)}%</label>
                <input type="range" min="0" max="100" value={sliderVal} onChange={e => setSliderVal(Number(e.target.value))} className="w-full accent-gray-900" />
              </div>
            )}

            {gameOver && (
              <div className={`p-5 rounded-xl text-center ${survived ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                <p className="text-lg font-bold mb-1">{survived ? "🎉 블랙아웃 방어 성공!" : "💥 정전 발생!"}</p>
                <p className="text-sm text-gray-600">{survived ? (aiMode ? "AI 덕분에 안정적으로 유지했습니다!" : "대단합니다! 수동으로 성공!") : "수요와 공급의 괴리가 너무 커졌습니다."}</p>
                <button onClick={startGame} className="mt-3 px-4 py-2 bg-gray-900 text-white text-xs rounded-lg">
                  <RotateCcw size={12} className="inline mr-1" /> 다시 하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TAB 4: Prompt Tips ──────────────────────────────
const Tab4 = () => {
  const [activeBlock, setActiveBlock] = useState(null);
  const blocks = [
    { id: "role", label: "역할 부여", color: "bg-gray-900", example: "넌 한국전력 10년 차 과장이야", icon: User },
    { id: "context", label: "구체적 맥락", color: "bg-gray-700", example: "지금 폭우로 송전탑 문제가 생겼어", icon: Target },
    { id: "format", label: "출력 형식", color: "bg-gray-500", example: "안내문을 3문단 텍스트로 써줘", icon: FileText },
  ];

  // Game
  const [slots, setSlots] = useState([null, null, null]);
  const [gameSubmitted, setGameSubmitted] = useState(false);

  const allBlocks = [
    { id: "g1", text: "넌 전력설비 전문 엔지니어야", type: "role", good: true },
    { id: "g2", text: "오늘 강풍으로 154kV 송전선이 끊겼어", type: "context", good: true },
    { id: "g3", text: "복구 절차를 단계별 체크리스트로 작성해", type: "format", good: true },
    { id: "b1", text: "대충 써줘", type: "bad", good: false },
    { id: "b2", text: "뭔가 좋은 거 만들어봐", type: "bad", good: false },
    { id: "b3", text: "알아서 해", type: "bad", good: false },
  ];

  const shuffled = useRef([...allBlocks].sort(() => Math.random() - 0.5));

  const handleSlotFill = (blockId, slotIndex) => {
    if (gameSubmitted) return;
    const newSlots = [...slots];
    // Remove from other slot if already placed
    const existingSlot = newSlots.indexOf(blockId);
    if (existingSlot !== -1) newSlots[existingSlot] = null;
    newSlots[slotIndex] = blockId;
    setSlots(newSlots);
  };

  const checkResult = () => setGameSubmitted(true);
  const resetGame = () => { setSlots([null, null, null]); setGameSubmitted(false); };

  const allGood = slots.every(s => allBlocks.find(b => b.id === s)?.good);
  const slotLabels = ["역할", "맥락", "형식"];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <ConceptHeader icon={BookOpen} title="개념 쏙쏙 — 업무 지시 공식" />
        <p className="text-sm text-gray-500 mb-6">좋은 프롬프트는 세 가지 블록으로 구성됩니다. 각 블록을 클릭해 보세요.</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {blocks.map((b, i) => (
            <div key={b.id} className="flex items-center gap-2 flex-1">
              <button onClick={() => setActiveBlock(activeBlock === b.id ? null : b.id)} className={`flex-1 p-4 rounded-xl border transition-all text-left ${activeBlock === b.id ? `${b.color} text-white border-transparent` : "bg-white border-gray-200 hover:border-gray-400"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <b.icon size={16} />
                  <span className="text-xs font-semibold">{b.label}</span>
                </div>
                {activeBlock === b.id && <p className="text-xs mt-2 opacity-90">{b.example}</p>}
              </button>
              {i < blocks.length - 1 && <span className="text-gray-300 hidden sm:block">+</span>}
            </div>
          ))}
        </div>

        {activeBlock && (
          <div className="bg-gray-50 rounded-xl p-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div className="text-sm text-gray-600">
                {activeBlock === "role" && "AI에게 전문가 역할을 부여하면 해당 분야의 어조와 전문 용어를 사용한 답변을 받을 수 있습니다. 마치 신입사원에게 '넌 지금부터 안전관리 담당자야'라고 하면 그 역할에 맞게 행동하는 것과 같습니다."}
                {activeBlock === "context" && "현재 상황과 배경을 구체적으로 알려주세요. '문제가 생겼어'보다 '폭우로 인해 154kV 송전선이 끊겨서 3개 지역이 정전됐어'라고 하면 훨씬 정확한 답변을 얻습니다."}
                {activeBlock === "format" && "원하는 출력 형태를 명확히 지정하세요. '알려줘'보다 '3문단의 안내문 형식으로', '표로 정리해서', '5단계 체크리스트로' 처럼 구체적으로 요청하면 바로 쓸 수 있는 결과물을 얻습니다."}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400 mb-2">💡 조립 결과 미리보기:</p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">[역할]</span> {blocks[0].example} + <span className="font-semibold">[맥락]</span> {blocks[1].example} + <span className="font-semibold">[형식]</span> {blocks[2].example}
          </p>
          <p className="text-xs text-gray-400 mt-2">→ 이렇게 조합하면 정확하고 실용적인 결과물을 얻을 수 있습니다!</p>
        </div>
      </div>

      {/* Game */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <GameHeader icon={Gamepad2} title="실전 게임 — 프롬프트 깎는 장인" />
        <p className="text-sm text-gray-500 mb-6">아래 블록 중 좋은 3개를 골라 슬롯에 넣으세요!</p>

        {/* Slots */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {slotLabels.map((label, i) => {
            const filled = slots[i];
            const block = allBlocks.find(b => b.id === filled);
            return (
              <div key={i} className={`p-4 rounded-xl border-2 border-dashed min-h-[80px] flex flex-col items-center justify-center text-center transition-all ${filled ? (gameSubmitted ? (block?.good ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50") : "border-gray-400 bg-gray-50") : "border-gray-200"}`}>
                <span className="text-[10px] text-gray-400 mb-1">슬롯 {i + 1}: {label}</span>
                {block ? (
                  <span className="text-xs font-medium text-gray-700">{block.text}</span>
                ) : (
                  <span className="text-xs text-gray-300">비어있음</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Available blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {shuffled.current.map(block => {
            const inSlot = slots.includes(block.id);
            return (
              <div key={block.id} className={`p-3 rounded-xl border text-xs transition-all ${inSlot ? "opacity-40 border-gray-100" : "border-gray-200 hover:border-gray-400 cursor-pointer"}`}>
                <p className="font-medium text-gray-700 mb-2">{block.text}</p>
                {!inSlot && !gameSubmitted && (
                  <div className="flex gap-1">
                    {[0, 1, 2].map(si => (
                      <button key={si} onClick={() => handleSlotFill(block.id, si)} className="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-500 hover:bg-gray-900 hover:text-white transition-colors">
                        슬롯{si + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Result */}
        {!gameSubmitted ? (
          <button onClick={checkResult} disabled={slots.some(s => s === null)} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl disabled:opacity-30 hover:bg-gray-800 transition-all">
            제출하기
          </button>
        ) : (
          <div className="space-y-4">
            <div className={`p-5 rounded-xl border text-center ${allGood ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
              {allGood ? (
                <>
                  <p className="text-lg font-bold mb-1">🏆 100점! 프롬프트 장인!</p>
                  <p className="text-sm text-gray-600">완벽한 프롬프트 조합입니다!</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold mb-1">😵 AI가 혼란스러워합니다!</p>
                  <p className="text-sm text-gray-600">"대충 써줘" 같은 모호한 지시로는 좋은 결과를 얻을 수 없어요.</p>
                </>
              )}
            </div>
            <button onClick={resetGame} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-800">
              <RotateCcw size={14} /> 다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TAB 5: AI Ethics & Hallucination ────────────────
const Tab5 = () => {
  const [tempSlider, setTempSlider] = useState(30);
  const [showSecurityDemo, setShowSecurityDemo] = useState(false);
  const [securityPhase, setSecurityPhase] = useState(0);

  // Game state
  const [currentCard, setCurrentCard] = useState(0);
  const [results, setResults] = useState([]);
  const [cardAnim, setCardAnim] = useState("");

  const hallucinationExamples = [
    { temp: 20, text: "한국전력은 전력 공급을 담당하는 공기업입니다.", label: "사실" },
    { temp: 40, text: "한국전력은 1961년에 설립된 공기업입니다.", label: "사실" },
    { temp: 60, text: "한국전력은 세계 최대 규모의 전력 회사 중 하나입니다.", label: "살짝 과장" },
    { temp: 80, text: "에디슨이 1899년에 한국전력을 직접 설립했다고 합니다.", label: "🚨 환각!" },
    { temp: 95, text: "에디슨이 조선시대에 한국전력을 세워 경복궁에 전기를 공급했습니다.", label: "🚨 심한 환각!" },
  ];

  const currentHallucination = hallucinationExamples.reduce((prev, curr) =>
    Math.abs(curr.temp - tempSlider) < Math.abs(prev.temp - tempSlider) ? curr : prev
  );

  // Security demo
  const handleSecurityDemo = () => {
    setShowSecurityDemo(true);
    setSecurityPhase(0);
    setTimeout(() => setSecurityPhase(1), 800);
    setTimeout(() => setSecurityPhase(2), 1600);
  };

  // Tinder game cards
  const cards = [
    { text: "우리 본부 하반기 예산안 엑셀 요약해 줘", danger: true, reason: "사내 기밀 예산 정보가 외부로 유출될 수 있습니다." },
    { text: "파이썬으로 데이터 정렬하는 코드 짜줘", danger: false, reason: "일반적인 프로그래밍 질문으로 보안 위험이 없습니다." },
    { text: "고객 김OO의 전화번호와 주소 정리해 줘", danger: true, reason: "고객 개인정보를 외부 AI에 입력하면 개인정보보호법 위반입니다." },
    { text: "이메일 문법 교정해 줘: '회의 참석 부탁드립니다'", danger: false, reason: "일반적인 문법 교정은 보안 위험이 없습니다." },
    { text: "신규 발전소 건설 도면 분석해 줘", danger: true, reason: "미공개 인프라 도면은 국가 핵심 기밀에 해당합니다." },
    { text: "엑셀 VLOOKUP 함수 사용법 알려줘", danger: false, reason: "일반 업무 도구 사용법은 보안 위험이 없습니다." },
  ];

  const handleSwipe = (block) => {
    const card = cards[currentCard];
    const correct = block === card.danger;
    setCardAnim(block ? "swipe-left" : "swipe-right");
    setTimeout(() => {
      setResults(prev => [...prev, { correct, card }]);
      setCurrentCard(prev => prev + 1);
      setCardAnim("");
    }, 300);
  };

  const resetGame = () => { setCurrentCard(0); setResults([]); setCardAnim(""); };
  const gameScore = results.filter(r => r.correct).length;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <ConceptHeader icon={BookOpen} title="개념 쏙쏙 — AI 주의사항" />

        {/* Hallucination */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <AlertTriangle size={16} /> 환각 (Hallucination)
          </h3>
          <p className="text-sm text-gray-500 mb-4">상상력 온도를 올려보세요. AI가 점점 그럴싸한 거짓말을 만들어냅니다.</p>

          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>🧊 정확</span>
                <span>상상력 온도: {tempSlider}%</span>
                <span>🔥 창의적(위험)</span>
              </div>
              <input type="range" min="0" max="100" value={tempSlider} onChange={e => setTempSlider(Number(e.target.value))} className="w-full accent-gray-900" />
            </div>

            <div className={`p-4 rounded-xl border transition-all ${tempSlider > 70 ? "bg-red-50 border-red-200" : tempSlider > 50 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">AI 출력:</span>
                <Badge variant={tempSlider > 70 ? "error" : tempSlider > 50 ? "warning" : "success"}>
                  {currentHallucination.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-700">{currentHallucination.text}</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Shield size={16} /> 보안 위험
          </h3>
          <p className="text-sm text-gray-500 mb-4">기밀 데이터를 AI에 입력하면 어떤 일이 생기는지 확인해 보세요.</p>

          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            {!showSecurityDemo ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-600 mb-4">
                  <FileText size={14} /> "2026_발전소_설계도면_v3.dwg"
                </div>
                <br />
                <button onClick={handleSecurityDemo} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all">
                  AI에 업로드 시뮬레이션 ⬆️
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${securityPhase >= 0 ? "bg-white border border-gray-200 opacity-100" : "opacity-0"}`}>
                  <Send size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">파일을 AI 서버로 전송 중...</span>
                </div>
                {securityPhase >= 1 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200" style={{ animation: "fadeIn 0.3s" }}>
                    <Globe size={14} className="text-amber-600" />
                    <span className="text-sm text-amber-700">⚠️ 데이터가 외부 서버(미국)에 저장됨!</span>
                  </div>
                )}
                {securityPhase >= 2 && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200" style={{ animation: "fadeIn 0.3s" }}>
                    <AlertTriangle size={18} className="text-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">🚨 보안 경고!</p>
                      <p className="text-xs text-red-600 mt-1">기밀 도면이 외부 서버에 영구 저장될 수 있습니다. 절대 사내 기밀을 외부 AI에 입력하지 마세요!</p>
                    </div>
                  </div>
                )}
                <button onClick={() => { setShowSecurityDemo(false); setSecurityPhase(0); }} className="text-xs text-gray-400 hover:text-gray-600">리셋</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <GameHeader icon={Gamepad2} title="실전 게임 — 보안관 스와이프" />
        <p className="text-sm text-gray-500 mb-6">사내 직원의 AI 사용 요청을 심사하세요. 위험하면 차단, 안전하면 허용!</p>

        {currentCard < cards.length ? (
          <div className="space-y-6">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{currentCard + 1} / {cards.length}</span>
              <span>정답: {gameScore} / {results.length}</span>
            </div>

            {/* Card */}
            <div className={`relative mx-auto max-w-sm transition-all duration-300 ${cardAnim === "swipe-left" ? "-translate-x-full opacity-0 rotate-[-10deg]" : cardAnim === "swipe-right" ? "translate-x-full opacity-0 rotate-[10deg]" : ""}`}>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 min-h-[160px] flex flex-col items-center justify-center text-center">
                <MessageSquare size={20} className="text-gray-400 mb-3" />
                <p className="text-sm text-gray-700 font-medium leading-relaxed">"{cards[currentCard].text}"</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6">
              <button onClick={() => handleSwipe(true)} className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 transition-all group">
                <ThumbsDown size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-red-600">차단</span>
              </button>
              <button onClick={() => handleSwipe(false)} className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-all group">
                <ThumbsUp size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-emerald-600">허용</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-5 rounded-xl border text-center ${gameScore === cards.length ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
              <p className="text-2xl font-bold mb-1">{gameScore}/{cards.length}</p>
              <p className="text-sm text-gray-600">
                {gameScore === cards.length ? "🛡️ 완벽한 보안관!" : `${cards.length - gameScore}건을 놓쳤습니다. 아래에서 확인하세요.`}
              </p>
            </div>

            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className={`p-3 rounded-xl border text-xs ${r.correct ? "border-emerald-100 bg-emerald-50/50" : "border-red-100 bg-red-50/50"}`}>
                  <div className="flex items-center gap-2">
                    {r.correct ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                    <span className="text-gray-700 font-medium">"{r.card.text}"</span>
                  </div>
                  <p className="text-gray-500 mt-1 ml-6">{r.card.reason}</p>
                </div>
              ))}
            </div>

            <button onClick={resetGame} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-800">
              <RotateCcw size={14} /> 다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────
const tabs = [
  { id: "concept", label: "AI 개념과 역사", icon: Brain, component: Tab1 },
  { id: "how", label: "AI의 동작원리", icon: Cpu, component: Tab2 },
  { id: "apply", label: "AI 실무적용", icon: Zap, component: Tab3 },
  { id: "prompt", label: "AI 프롬프트 활용 꿀팁", icon: Sparkles, component: Tab4 },
  { id: "ethics", label: "AI 주의사항", icon: Shield, component: Tab5 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("concept");
  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50/50" style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 50% { transform: translateX(8px); } 75% { transform: translateX(-4px); } }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">AI 기초 교육</h1>
              <p className="text-xs text-gray-400">전력산업 종사자를 위한 인터랙티브 가이드</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ").pop()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ActiveComponent />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-gray-400">AI 기초 교육 · 전력산업 종사자를 위한 인터랙티브 학습 가이드</p>
        </div>
      </footer>
    </div>
  );
}
