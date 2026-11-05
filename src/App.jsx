import { useEffect, useMemo, useState } from "react";

const SAMPLE_JOBS = [
  {
    id: "sample-persimmon",
    title: "감 수확 보조",
    category: "수확",
    location: "화양읍",
    date: "2026-11-12",
    start: "08:00",
    end: "17:00",
    pay: 100000,
    description: "나무에서 감을 수확하고 수확한 과일을 상자에 담는 작업입니다.",
    source: "sample",
  },
  {
    id: "sample-apple",
    title: "사과 선별 보조",
    category: "선별",
    location: "이서면",
    date: "2026-11-15",
    start: "09:00",
    end: "16:00",
    pay: 85000,
    description: "수확한 사과를 크기별로 나누고 포장을 돕는 작업입니다.",
    source: "sample",
  },
  {
    id: "sample-field",
    title: "밭 정리 작업 보조",
    category: "밭 관리",
    location: "풍각면",
    date: "2026-11-18",
    start: "08:30",
    end: "16:30",
    pay: 95000,
    description: "다음 작업을 위해 밭 주변을 정리하고 도구를 정돈합니다.",
    source: "sample",
  },
];

const CATEGORIES = ["전체 작업", "수확", "선별", "밭 관리", "기타"];

function readBrowserValue(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return { value: fallback, error: false };
    const value = JSON.parse(stored);
    return Array.isArray(value)
      ? { value, error: false }
      : { value: fallback, error: true };
  } catch {
    return { value: fallback, error: true };
  }
}

function useBrowserValue(key, fallback) {
  const [record, setRecord] = useState(() => readBrowserValue(key, fallback));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(record.value));
      if (record.error) {
        setRecord((current) => ({ ...current, error: false }));
      }
    } catch {
      setRecord((current) =>
        current.error ? current : { ...current, error: true },
      );
    }
  }, [key, record.error, record.value]);

  const setValue = (nextValue) => {
    setRecord((current) => ({
      ...current,
      value:
        typeof nextValue === "function"
          ? nextValue(current.value)
          : nextValue,
    }));
  };

  return [record.value, setValue, record.error];
}

function Icon({ name, size = 18 }) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></>,
    wallet: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M3 9h18M16 14h2" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r=".7" /><circle cx="4.5" cy="12" r=".7" /><circle cx="4.5" cy="18" r=".7" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    back: <><path d="M19 12H5M11 18l-6-6 6-6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    farmer: <><path d="M3 20V9l9-6 9 6v11" /><path d="M8 20v-6h8v6M3 20h18" /></>,
    person: <><circle cx="12" cy="8" r="3.3" /><path d="M5 20c.5-3.5 2.8-5.3 7-5.3s6.5 1.8 7 5.3" /></>,
  };

  return <svg {...shared}>{paths[name] ?? paths.info}</svg>;
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function SampleSeal({ selected = false }) {
  return (
    <div className={`sample-seal${selected ? " sample-seal--selected" : ""}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path
            id="sample-seal-path"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
          />
        </defs>
        <circle cx="50" cy="50" r="47" />
        <text>
          <textPath href="#sample-seal-path">체험용 예시 · SAMPLE · </textPath>
        </text>
      </svg>
      <span>예시<br />공고</span>
    </div>
  );
}

function formatDate(value, options = { month: "long", day: "numeric", weekday: "short" }) {
  return new Intl.DateTimeFormat("ko-KR", options).format(
    new Date(`${value}T00:00:00`),
  );
}

function formatPay(value) {
  return `${Number(value).toLocaleString("ko-KR")}원`;
}

async function postAssistantRequest(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.error || "AI 도움을 사용할 수 없습니다. 기본 기능을 계속 이용해 주세요.");
  }
  if (typeof result?.text !== "string" || !result.text.trim()) {
    throw new Error("AI 답변이 비어 있습니다. 작업 조건을 직접 확인해 주세요.");
  }
  return result.text.trim();
}

function Sidebar({ view, setView, role, setRole, onCreate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-role-label">이용 메뉴</div>
      <button
        className={`side-link${view === "jobs" ? " is-active" : ""}`}
        onClick={() => setView("jobs")}
      >
        <Icon name="search" />
        <span>일자리 찾기</span>
      </button>
      <button
        className={`side-link${view === "applications" ? " is-active" : ""}`}
        onClick={() => setView("applications")}
      >
        <Icon name="list" />
        <span>내 신청 내역</span>
      </button>
      <div className="side-rule" />
      <div className="sidebar-role-label">농가 서비스</div>
      <button
        className={`side-link${role === "farmer" ? " is-active" : ""}`}
        onClick={() => setRole("farmer")}
      >
        <Icon name="farmer" />
        <span>농가로 이용하기</span>
      </button>
      <button className="side-link side-link--sub" onClick={onCreate}>
        <Icon name="plus" />
        <span>공고 등록</span>
      </button>
      <div className="sidebar-note">
        <span className="note-mark"><Icon name="info" size={16} /></span>
        <p>체험용 서비스입니다. 실제 일자리 모집이나 신청이 진행되지 않습니다.</p>
      </div>
    </aside>
  );
}

function JobRow({ job, selected, applied, onSelect, role }) {
  const sample = job.source === "sample";
  return (
    <article className={`job-row${selected ? " job-row--selected" : ""}`}>
      <span className="registration-mark registration-mark--top" aria-hidden="true">+</span>
      <span className="registration-mark registration-mark--bottom" aria-hidden="true">+</span>
      <div className="job-main">
        <div className="job-title-line">
          <h2>{job.title}</h2>
          <span className={`job-label${sample ? " job-label--sample" : " job-label--local"}`}>
            {sample ? "체험용 예시" : "내 브라우저에 등록"}
          </span>
        </div>
        <div className="job-location">
          <Icon name="location" size={15} />
          <span>청도군 {job.location}</span>
          <span className="metadata-dot" aria-hidden="true" />
          <span>{job.category}</span>
        </div>
      </div>
      <div className="job-condition">
        <span className="condition-label"><Icon name="calendar" size={15} /> 작업 날짜</span>
        <strong>{formatDate(job.date)}</strong>
      </div>
      <div className="job-condition">
        <span className="condition-label"><Icon name="clock" size={15} /> 근무 시간</span>
        <strong>{job.start}–{job.end}</strong>
      </div>
      <div className="job-pay">
        <span className="condition-label"><Icon name="wallet" size={15} /> 일급</span>
        <strong>{formatPay(job.pay)}</strong>
      </div>
      <div className="job-actions">
        {role === "youth" ? (
          <button
            className={`text-action${applied ? " text-action--done" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
          >
            {applied ? "신청 완료" : "상세 보기"}
            <Icon name={applied ? "check" : "arrow"} size={16} />
          </button>
        ) : (
          <button
            className="text-action"
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
          >
            공고 보기 <Icon name="arrow" size={16} />
          </button>
        )}
      </div>
    </article>
  );
}

function DetailPanel({ job, applied, role, onApply, onCreate, onBrowse, onBack }) {
  if (!job) {
    return (
      <aside className="detail-panel detail-panel--empty">
        <button className="panel-back" type="button" onClick={onBack}>
          <Icon name="back" size={18} /> 목록으로
        </button>
        <div className="empty-seal"><SampleSeal /></div>
        <h2>조건에 맞는 공고가 없어요</h2>
        <p>검색어나 필터를 바꾸면 다른 작업을 확인할 수 있습니다.</p>
        <button className="outline-button" onClick={onBrowse}>전체 공고 보기</button>
      </aside>
    );
  }

  return (
    <aside className="detail-panel">
      <button className="panel-back" type="button" onClick={onBack}>
        <Icon name="back" size={18} /> 목록으로
      </button>
      <div className="detail-heading">
        <div>
          <p className="detail-label">{role === "youth" ? "선택한 작업" : "공고 미리 보기"}</p>
          <h2>작업 상세</h2>
        </div>
        <SampleSeal selected />
      </div>
      <div className="detail-title-block">
        <span className="detail-category">{job.category} · 청도군 {job.location}</span>
        <h3>{job.title}</h3>
        <span className={`job-label${job.source === "sample" ? " job-label--sample" : " job-label--local"}`}>
          {job.source === "sample" ? "체험용 예시 정보" : "현재 브라우저의 예시 공고"}
        </span>
      </div>
      <div className="detail-facts">
        <div className="detail-fact">
          <span>작업 날짜</span>
          <strong>{formatDate(job.date)}</strong>
        </div>
        <div className="detail-fact">
          <span>근무 시간</span>
          <strong>{job.start}–{job.end}</strong>
        </div>
        <div className="detail-fact">
          <span>급여</span>
          <strong className="detail-pay">{formatPay(job.pay)} <small>/ 일</small></strong>
        </div>
      </div>
      <div className="detail-description">
        <h4>작업 내용</h4>
        <p>{job.description || "농가에서 등록한 작업 내용입니다."}</p>
      </div>
      <div className="detail-notice">
        <Icon name="info" size={17} />
        <p>예시 공고입니다. 실제 모집 여부와 근무 조건은 확인되지 않았습니다.</p>
      </div>
      <div className="detail-actions">
        {role === "youth" ? (
          <button
            className={`primary-button${applied ? " primary-button--applied" : ""}`}
            onClick={onApply}
            disabled={applied}
          >
            {applied ? "신청 완료" : "이 일자리 신청하기"}
            <Icon name={applied ? "check" : "arrow"} size={18} />
          </button>
        ) : (
          <button className="primary-button" onClick={onCreate}>
            내 농가 공고 등록하기 <Icon name="plus" size={18} />
          </button>
        )}
        <p className="panel-footnote">신청과 공고는 데모 데이터로 이 브라우저에만 저장됩니다.</p>
      </div>
    </aside>
  );
}

function CreateJobPanel({
  form,
  setForm,
  error,
  onSubmit,
  onCancel,
  assistantAvailable,
  assistantBusy,
  assistantError,
  assistantDraft,
  onDraftDescription,
}) {
  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  return (
    <aside className="detail-panel create-panel">
      <button className="panel-back" type="button" onClick={onCancel}>
        <Icon name="back" size={18} /> 목록으로
      </button>
      <div className="detail-heading">
        <div>
          <p className="detail-label">농가 서비스</p>
          <h2>작업 공고 등록</h2>
        </div>
        <span className="create-mark"><Icon name="plus" size={19} /></span>
      </div>
      <p className="create-intro">작업 조건을 입력해 주세요. 등록한 공고는 이 브라우저에서만 확인할 수 있습니다.</p>
      <form className="job-form" onSubmit={onSubmit}>
        <label>
          <span>작업 제목 <em>필수</em></span>
          <input
            required
            maxLength={40}
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="예: 감 수확 보조"
          />
        </label>
        <div className="form-grid">
          <label>
            <span>작업 종류</span>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option>수확</option>
              <option>선별</option>
              <option>밭 관리</option>
              <option>기타</option>
            </select>
          </label>
          <label>
            <span>지역 <em>필수</em></span>
            <input required maxLength={24} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="예: 화양읍" />
          </label>
        </div>
        <label>
          <span>작업 날짜 <em>필수</em></span>
          <input required type="date" min={minDate} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
        </label>
        <div className="form-grid">
          <label>
            <span>시작 시간 <em>필수</em></span>
            <input required type="time" value={form.start} onChange={(event) => setForm({ ...form, start: event.target.value })} />
          </label>
          <label>
            <span>종료 시간 <em>필수</em></span>
            <input required type="time" value={form.end} onChange={(event) => setForm({ ...form, end: event.target.value })} />
          </label>
        </div>
        <label>
          <span>일급 (원) <em>필수</em></span>
          <input required min="1" max="10000000" type="number" inputMode="numeric" value={form.pay} onChange={(event) => setForm({ ...form, pay: event.target.value })} />
        </label>
        <label>
          <span>작업 설명</span>
          <textarea maxLength={240} rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="어떤 일을 하는지 간단히 적어 주세요." />
        </label>
        <div className="posting-assistant">
          <button
            className="outline-button assistant-button"
            type="button"
            onClick={onDraftDescription}
            disabled={!assistantAvailable || assistantBusy || !form.title.trim() || !form.location.trim()}
          >
            {assistantBusy ? "설명 다듬는 중…" : "AI로 작업 설명 다듬기"}
          </button>
          <p className="assistant-disclaimer">
            {assistantAvailable
              ? "제목·종류·지역·현재 설명만 AI에 전달됩니다. 이름 등 개인정보는 입력하지 마세요. 전화번호·이메일은 전송 전에 차단됩니다."
              : "AI 연결 준비 중입니다. 직접 설명을 입력해도 공고 등록을 계속할 수 있습니다."}
          </p>
          {assistantError && <p className="assistant-error" role="alert">{assistantError}</p>}
          {assistantDraft && (
            <div className="assistant-draft">
              <p>{assistantDraft}</p>
              <button
                type="button"
                className="outline-button"
                onClick={() => setForm((current) => ({ ...current, description: assistantDraft }))}
              >
                제안한 설명 적용
              </button>
            </div>
          )}
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit">예시 공고 등록하기 <Icon name="arrow" size={18} /></button>
        <button className="cancel-button" type="button" onClick={onCancel}>취소하고 공고 보기</button>
      </form>
    </aside>
  );
}

function EmptyApplications({ onBrowse }) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark"><Icon name="list" size={24} /></div>
      <h2>아직 신청한 일자리가 없습니다</h2>
      <p>작업 일정과 급여를 살펴보고 관심 있는 공고에 신청해 보세요.</p>
      <button className="outline-button" onClick={onBrowse}>일자리 둘러보기 <Icon name="arrow" size={16} /></button>
    </div>
  );
}

function App() {
  const [jobs, setJobs, jobsStorageError] = useBrowserValue("ilsonieum.jobs.v1", SAMPLE_JOBS);
  const [applications, setApplications, applicationsStorageError] = useBrowserValue("ilsonieum.applications.v1", []);
  const [role, setRole] = useState("youth");
  const [view, setView] = useState("jobs");
  const [mobileScreen, setMobileScreen] = useState("list");
  const [panelMode, setPanelMode] = useState("detail");
  const [selectedId, setSelectedId] = useState(() => jobs[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체 작업");
  const [sort, setSort] = useState("date");
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [assistantStatus, setAssistantStatus] = useState(null);
  const [matchQuestion, setMatchQuestion] = useState("");
  const [matchAnswer, setMatchAnswer] = useState("");
  const [matchError, setMatchError] = useState("");
  const [matchBusy, setMatchBusy] = useState(false);
  const [postingDraft, setPostingDraft] = useState("");
  const [postingError, setPostingError] = useState("");
  const [postingBusy, setPostingBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "수확",
    location: "",
    date: "",
    start: "08:00",
    end: "17:00",
    pay: "",
    description: "",
  });

  const visibleJobs = useMemo(() => {
    const source = view === "applications"
      ? jobs.filter((job) => applications.includes(job.id))
      : jobs;
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
    return source
      .filter((job) => category === "전체 작업" || job.category === category)
      .filter((job) =>
        !normalizedQuery ||
        `${job.title} ${job.location} ${job.category}`.toLocaleLowerCase("ko-KR").includes(normalizedQuery),
      )
      .sort((left, right) =>
        sort === "pay"
          ? Number(right.pay) - Number(left.pay)
          : left.date.localeCompare(right.date),
      );
  }, [applications, category, jobs, query, sort, view]);

  const displayedJobs =
    view === "jobs" && !showAllJobs ? visibleJobs.slice(0, 2) : visibleJobs;
  const selectedJob =
    displayedJobs.find((job) => job.id === selectedId) ??
    displayedJobs[0] ??
    (view === "applications" ? null : jobs.find((job) => job.id === selectedId)) ??
    null;

  useEffect(() => {
    let active = true;
    fetch("/api/assist/status")
      .then((response) => {
        if (!response.ok) throw new Error("AI 상태를 확인하지 못했습니다.");
        return response.json();
      })
      .then((status) => {
        if (active) setAssistantStatus(status);
      })
      .catch(() => {
        if (active) setAssistantStatus({ copilot: false, agentFramework: false });
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (selectedJob && selectedJob.id !== selectedId) setSelectedId(selectedJob.id);
  }, [selectedId, selectedJob]);

  function showJobs() {
    setView("jobs");
    setMobileScreen("list");
    setShowAllJobs(false);
    setPanelMode("detail");
    setNotice("");
  }

  function showApplications() {
    setView("applications");
    setMobileScreen("list");
    setShowAllJobs(false);
    setCategory("전체 작업");
    setQuery("");
    setPanelMode("detail");
    setNotice("");
  }

  function openCreate() {
    setRole("farmer");
    setView("jobs");
    setMobileScreen("create");
    setPanelMode("create");
    setFormError("");
    setNotice("");
  }

  function applyToJob(job) {
    if (!job || applications.includes(job.id)) return;
    setApplications((current) => [...current, job.id]);
    setSelectedId(job.id);
    setPanelMode("detail");
    setNotice(`"${job.title}" 체험용 신청이 저장되었습니다. 실제 농가에 전달되지는 않습니다.`);
  }

  async function getMatchAdvice() {
    setMatchBusy(true);
    setMatchError("");
    setMatchAnswer("");
    try {
      const text = await postAssistantRequest("/api/assist/match", {
        question: matchQuestion,
        jobs: visibleJobs.slice(0, 10).map((job) => ({
          id: job.id,
          title: job.title,
          category: job.category,
          location: job.location,
          date: formatDate(job.date),
          start: job.start,
          end: job.end,
          pay: Number(job.pay),
        })),
      });
      setMatchAnswer(text);
    } catch (error) {
      setMatchError(error instanceof Error ? error.message : "AI 추천을 불러오지 못했습니다.");
    } finally {
      setMatchBusy(false);
    }
  }

  async function draftJobDescription() {
    setPostingBusy(true);
    setPostingError("");
    setPostingDraft("");
    try {
      const text = await postAssistantRequest("/api/assist/posting", {
        title: form.title,
        category: form.category,
        location: form.location,
        description: form.description,
      });
      setPostingDraft(text);
    } catch (error) {
      setPostingError(error instanceof Error ? error.message : "AI 설명 제안을 불러오지 못했습니다.");
    } finally {
      setPostingBusy(false);
    }
  }

  function submitJob(event) {
    event.preventDefault();
    setFormError("");
    if (form.end <= form.start) {
      setFormError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }
    const pay = Number(form.pay);
    if (!Number.isFinite(pay) || pay <= 0) {
      setFormError("일급을 1원 이상으로 입력해 주세요.");
      return;
    }
    const created = {
      ...form,
      id: `local-${Date.now()}`,
      pay,
      description: form.description.trim() || `${form.title} 작업을 함께할 분을 찾습니다.`,
      source: "local",
    };
    setJobs((current) => [created, ...current]);
    setSelectedId(created.id);
    setShowAllJobs(true);
    setCategory("전체 작업");
    setQuery("");
    setSort("date");
    setPanelMode("detail");
    setMobileScreen("detail");
    setForm({
      title: "",
      category: "수확",
      location: "",
      date: "",
      start: "08:00",
      end: "17:00",
      pay: "",
      description: "",
    });
    setNotice(`"${created.title}" 공고가 이 브라우저에 등록되었습니다.`);
  }

  const storageError = jobsStorageError || applicationsStorageError;

  return (
    <div className={`app-shell${mobileScreen !== "list" ? ` app-shell--mobile-${mobileScreen}` : ""}`}>
      <header className="topbar">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); showJobs(); }}>
          <BrandMark />
          <span>일손이음</span>
        </a>
        <div className="topbar-context">
          <span className="county-label">청도군</span>
          <span className="topbar-divider" />
          <span>농촌 일자리 매칭</span>
        </div>
        <div className="topbar-right">
          <span className="demo-mode"><span /> 체험 모드</span>
          <div className="role-switch" aria-label="이용자 유형">
            <button className={role === "youth" ? "is-current" : ""} onClick={() => { setRole("youth"); setPanelMode("detail"); }}>
              청년
            </button>
            <button className={role === "farmer" ? "is-current" : ""} onClick={() => { setRole("farmer"); setPanelMode("detail"); }}>
              농가
            </button>
          </div>
        </div>
      </header>

      <div className={`workspace${mobileScreen !== "list" ? ` workspace--mobile-${mobileScreen}` : ""}`}>
        <Sidebar
          view={view}
          setView={(nextView) => {
            if (nextView === "applications") showApplications();
            else showJobs();
          }}
          role={role}
          setRole={(nextRole) => { setRole(nextRole); setPanelMode("detail"); }}
          onCreate={openCreate}
        />

        <main className="main-content">
          <div className="page-heading">
            <div>
              <h1>{view === "applications" ? "내 신청 내역" : role === "farmer" ? "농가 작업 공고" : "청도 농촌 일자리"}</h1>
              <p className="page-description">
                {view === "applications"
                  ? "관심 있는 일자리에 보낸 체험용 신청을 확인합니다."
                  : role === "farmer"
                    ? "필요한 작업 조건을 등록하고 공고를 관리해 보세요."
                    : "작업 내용과 조건을 살펴보고 내 일정에 맞는 일에 신청해 보세요."}
              </p>
            </div>
            {role === "farmer" && view === "jobs" && (
              <button className="post-button" onClick={openCreate}>
                <Icon name="plus" size={18} /> 공고 등록
              </button>
            )}
          </div>

          <div className="sample-banner">
            <span className="banner-symbol"><Icon name="info" size={16} /></span>
            <p><strong>체험용 예시 정보</strong>　공고와 급여는 실제 모집 내용이 아닙니다.</p>
            <span className="banner-count">브라우저 내 데모</span>
          </div>

          {notice && <p className="notice-message" role="status">{notice}</p>}
          {storageError && (
            <p className="storage-message" role="alert">
              브라우저 저장소를 사용할 수 없어 변경 사항은 현재 화면에서만 유지됩니다.
            </p>
          )}

          {view === "jobs" && (
            <>
              <section className="filter-bar" aria-label="일자리 검색 조건">
                <label className="search-field">
                  <Icon name="search" size={18} />
                  <span className="sr-only">작업명 또는 지역 검색</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => { setQuery(event.target.value); setShowAllJobs(false); }}
                    placeholder="작업명이나 지역을 검색하세요"
                  />
                </label>
                <label className="select-field">
                  <span className="sr-only">작업 종류</span>
                  <select value={category} onChange={(event) => { setCategory(event.target.value); setShowAllJobs(false); }}>
                    {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="select-field select-field--sort">
                  <span className="sr-only">정렬 기준</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value="date">가까운 일정순</option>
                    <option value="pay">급여 높은 순</option>
                  </select>
                </label>
              </section>

              {role === "youth" && (
                <section className="assistant-box" aria-label="Copilot 일자리 추천 도우미">
                  <div className="assistant-heading">
                    <div>
                      <h2>조건에 맞는 일자리 찾기</h2>
                      <p>일정이나 급여 조건을 말하면 예시 공고를 비교해 드립니다.</p>
                    </div>
                    <span className={`assistant-status${assistantStatus?.copilot ? " is-ready" : ""}`}>
                      Copilot {assistantStatus ? (assistantStatus.copilot ? "연결됨" : "연결 대기") : "확인 중"}
                    </span>
                  </div>
                  <form
                    className="assistant-query"
                    onSubmit={(event) => { event.preventDefault(); getMatchAdvice(); }}
                  >
                    <label className="sr-only" htmlFor="match-question">원하는 일자리 조건</label>
                    <input
                      id="match-question"
                      maxLength={240}
                      value={matchQuestion}
                      onChange={(event) => setMatchQuestion(event.target.value)}
                      placeholder="예: 이번 주말, 오전에 끝나는 작업"
                    />
                    <button
                      className="outline-button"
                      type="submit"
                      disabled={!assistantStatus?.copilot || !matchQuestion.trim() || !visibleJobs.length || matchBusy}
                    >
                      {matchBusy ? "비교 중…" : "AI 조건 비교"}
                    </button>
                  </form>
                  <p className="assistant-disclaimer">
                    {assistantStatus?.copilot
                      ? "체험용 공고 정보와 입력 조건만 전달됩니다. 개인정보를 입력하지 마세요. AI 답변은 참고용이며 실제 모집 여부를 확인하세요."
                      : "Copilot 연결 후 사용할 수 있습니다. 로그인 없이 일자리 검색과 신청은 계속 이용할 수 있습니다."}
                  </p>
                  {matchError && <p className="assistant-error" role="alert">{matchError}</p>}
                  {matchAnswer && <p className="assistant-answer" role="status">{matchAnswer}</p>}
                </section>
              )}

              <section className="listing-section" aria-label="일자리 목록">
                <div className="list-heading">
                  <h2>모집 중인 작업</h2>
                  <span>{visibleJobs.length}개 공고</span>
                </div>
                {visibleJobs.length > 0 ? (
                  <div className="job-list">
                    {displayedJobs.map((job) => (
                      <JobRow
                        key={job.id}
                        job={job}
                        selected={selectedJob?.id === job.id}
                        applied={applications.includes(job.id)}
                        role={role}
                        onSelect={() => { setSelectedId(job.id); setPanelMode("detail"); setMobileScreen("detail"); setNotice(""); }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state empty-state--compact">
                    <h2>조건에 맞는 공고가 없습니다</h2>
                    <p>검색어를 바꾸거나 작업 종류를 전체로 선택해 보세요.</p>
                    <button className="outline-button" onClick={() => { setQuery(""); setCategory("전체 작업"); setShowAllJobs(false); }}>
                      검색 조건 초기화
                    </button>
                  </div>
                )}
                {visibleJobs.length > displayedJobs.length && (
                  <button
                    className="more-jobs-button"
                    onClick={() => setShowAllJobs(true)}
                  >
                    나머지 {visibleJobs.length - displayedJobs.length}개 공고 더 보기
                    <Icon name="plus" size={16} />
                  </button>
                )}
              </section>
            </>
          )}

          {view === "applications" && (visibleJobs.length > 0 ? (
            <section className="listing-section application-list" aria-label="신청한 일자리 목록">
              <div className="list-heading">
                <h2>신청한 작업</h2>
                <span>{visibleJobs.length}개 공고</span>
              </div>
              <div className="job-list">
                {visibleJobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    selected={selectedJob?.id === job.id}
                    applied
                    role="youth"
                    onSelect={() => { setSelectedId(job.id); setPanelMode("detail"); setMobileScreen("detail"); setNotice(""); }}
                  />
                ))}
              </div>
            </section>
          ) : (
            <EmptyApplications onBrowse={showJobs} />
          ))}

          <div className="page-footnote">
            <span className="registration-mini" aria-hidden="true">+</span>
            이 화면은 일손이음 서비스 소개를 위한 프로토타입이며 실제 구인·구직을 중개하지 않습니다.
          </div>
        </main>

        {panelMode === "create" ? (
          <CreateJobPanel
            form={form}
            setForm={setForm}
            error={formError}
            onSubmit={submitJob}
            onCancel={() => { setPanelMode("detail"); setMobileScreen("list"); setFormError(""); }}
            assistantAvailable={Boolean(assistantStatus?.agentFramework)}
            assistantBusy={postingBusy}
            assistantError={postingError}
            assistantDraft={postingDraft}
            onDraftDescription={draftJobDescription}
          />
        ) : (
          <DetailPanel
            job={selectedJob}
            applied={selectedJob ? applications.includes(selectedJob.id) : false}
            role={role}
            onApply={() => applyToJob(selectedJob)}
            onCreate={openCreate}
            onBrowse={showJobs}
            onBack={() => setMobileScreen("list")}
          />
        )}
      </div>

      <nav className="mobile-nav" aria-label="주요 메뉴">
        <button className={view === "jobs" ? "is-current" : ""} onClick={showJobs}>
          <Icon name="search" size={19} /><span>일자리</span>
        </button>
        <button className={view === "applications" ? "is-current" : ""} onClick={showApplications}>
          <Icon name="list" size={19} /><span>내 신청</span>
        </button>
        <button className={role === "farmer" ? "is-current" : ""} onClick={openCreate}>
          <Icon name="plus" size={19} /><span>공고 등록</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
