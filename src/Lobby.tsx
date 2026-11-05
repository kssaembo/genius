import {useState,useEffect} from 'react';
import {Trophy,Settings,ArrowUpRight,ArrowRight,Plus,ChevronLeft,ChevronRight,Users,Gem,Check,Download,Maximize,Volume2,VolumeX,BookOpen,Play,LayoutGrid,Flag,HelpCircle} from 'lucide-react';
import {APP_TITLE,CATALOG} from './catalog';
import {ranking,type State,type Round} from './core';
import {GameThumbnail} from './GameThumbnail';
import {LOBBY_BACKGROUND,GARNET_ICON,TROPHY_ICON} from './visualAssets';
function Garnet(){return GARNET_ICON?<img className="garnet-art" src={GARNET_ICON} alt="가넷"/>:<Gem size={17}/>;}
function Cup(){return TROPHY_ICON?<img className="trophy-art" src={TROPHY_ICON} alt="우승 트로피"/>:<Trophy/>;}
import './lobby.css';
type Props={s:State|null;page:'dashboard'|'ranking';onPage:(p:'dashboard'|'ranking')=>void;busy:boolean;gem:React.ReactNode;onCreate:()=>void;onDemo:()=>void;onManage:()=>void;onSettings:()=>void;onBackup:()=>void;onRoster:()=>void;onHelp:()=>void;onSound:()=>void;onFullscreen:()=>void;onRound:(id:string)=>void;onStart:(r:Round)=>void;onStudent:(id:string)=>void;onResume:()=>void;alerts:React.ReactNode};
const labels={scheduled:'도전 예정',playing:'진행 중',draft:'결과 작성 중',paid:'완료'};
function perPage(){return window.innerWidth>=1250&&window.innerHeight>=820?10:window.innerWidth>=1100?(window.innerHeight>=820?6:3):window.innerWidth>=650?4:2;}
export function Lobby(p:Props){
 const {s,page}=p;const ranked=s?ranking(s):[];
 const [tab,setTab]=useState<'all'|'pending'|'paid'>('all'),[size,setSize]=useState(perPage);
 useEffect(()=>{const resize=()=>{setSize(perPage());};window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
 const current=s?.rounds.find(x=>x.status==='playing'||x.status==='draft')??s?.rounds.find(x=>x.status==='scheduled');
 const done=s?.rounds.filter(x=>x.status==='paid').length??0;
 const rounds=s?.rounds.filter(x=>tab==='all'||(tab==='paid'?x.status==='paid':x.status!=='paid'))??[];
 const currentNumber=s&&current?s.rounds.findIndex(x=>x.id===current.id)+1:null;
 return <div className={`game-lobby ${size>=6?'two-rows':'one-row'} ${size===10?'ten-cards':''}`} style={LOBBY_BACKGROUND?{'--lobby-bg':`url("${LOBBY_BACKGROUND}")`} as React.CSSProperties:undefined}>
  <header className="lobby-header"><button className="lobby-brand" onClick={()=>p.onPage('dashboard')} aria-label="지니어스 게임 선택으로">{p.gem}<span>{APP_TITLE}<small>THE GENIUS GAME</small></span></button><div className="lobby-season"><i/><span className="season-seal">시즌</span><b>{s?s.name:'우리 반 두뇌 챌린지'}</b></div><div className="lobby-tools"><span className="lobby-save" role="status">{p.busy?'저장 중…':s?'자동 저장 완료':'기기 내 저장'}</span><button aria-label={s?.settings.sound?'효과음 끄기':'효과음 켜기'} onClick={p.onSound}>{s?.settings.sound?<Volume2 size={19}/>:<VolumeX size={19}/>}</button><button aria-label="전체 화면" onClick={p.onFullscreen}><Maximize size={19}/></button><button className="teacher-control" onClick={p.onSettings}><Settings size={18}/><span>교사 메뉴</span></button></div></header>
  {p.alerts}
  <main className="lobby-main">
   <section className={'lobby-intro '+(s&&page==='dashboard'?'compact-intro':'')}>
    {page==='ranking'&&<div className="intro-copy"><h1>최종 순위</h1><p>누적 획득 가넷 기준</p></div>}
    {!s&&<div className="welcome-controls"><button className="lobby-primary" onClick={p.onCreate}><Plus size={19}/> 우리 반 시즌 만들기</button><div className="welcome-secondary"><button className="lobby-link" onClick={p.onDemo}>체험하기 <ArrowUpRight size={16}/></button><button className="lobby-link" onClick={p.onBackup}><Download size={16}/> 백업 복구</button></div></div>}
   </section>
   {s&&<div className="season-ribbon"><span><Flag size={15}/>{s.className||s.name}</span><span className="round-indicator">{currentNumber?`ROUND ${String(currentNumber).padStart(2,'0')}`:s.status==='final'?'SEASON FINALE':'ALL CLEAR'}</span><span className="ribbon-current">{s.status==='final'?'최종 결과 공개':current?`현재 게임 · ${current.name}`:'모든 도전 완료'}</span><span><Users size={16}/>{s.students.filter(x=>x.active).length}명 참가</span><span><Check size={16}/>{done} / {s.rounds.length} 완료</span><div className="ribbon-actions"><button className="roster-highlight" onClick={p.onRoster}><Users size={20}/> 학생 목록 복사</button><button onClick={p.onBackup} aria-label="시즌 백업"><Download size={16}/></button></div></div>}
   {page==='dashboard'?<>
    {s?.status==='final'&&<div className="lobby-finale"><Cup/><div><span>SEASON WINNER{ranked.filter(x=>x.rank===1).length>1?'S':''}</span><strong>{ranked.filter(x=>x.rank===1).map(x=>x.name).join(' · ')||'모두의 도전'}</strong></div><p>누적 획득 {ranked[0]?.earned??0} 가넷</p><button className="lobby-link" onClick={()=>p.onPage('ranking')}>최종 순위 보기 <ArrowRight size={16}/></button><button className="lobby-link" onClick={p.onResume}>시즌 다시 진행</button></div>}
    <div className="lobby-grid-heading"><div className="lobby-filters" role="group" aria-label="게임 목록 필터">{(['all','pending','paid'] as const).map(t=><button key={t} disabled={!s&&t!=='all'} aria-pressed={tab===t} className={tab===t?'chosen':''} onClick={()=>{setTab(t);}}>{t==='all'?'전체 게임':t==='pending'?'앞으로의 도전':'완료한 도전'}</button>)}</div>{s&&<button className="lobby-link manage-link" onClick={p.onManage}><Plus size={14}/> 게임 관리</button>}</div>
    <div className="lobby-card-grid" aria-label="게임 선택 로비">
     {s?rounds.map(r=>{const g=CATALOG.find(x=>x.id===r.gameId)!;const selected=r.id===current?.id;const i=s.rounds.findIndex(x=>x.id===r.id)+1;return <article key={r.id} className={`lobby-game-card ${selected?'current-card':''} ${r.status==='paid'?'completed-card':''}`}>
      <div className="card-rail"><span>ROUND {String(i).padStart(2,'0')}</span><span className={`card-status ${r.status}`}>{r.status==='paid'?<Check size={12}/>:selected?<span className="status-spark"/>:null}{selected&&r.status==='scheduled'?'이번 도전':labels[r.status]}</span></div>
      <button className="square-game-link" disabled={!g.url} aria-label={`${r.name} 외부 게임 열기${!g.url?' · 주소 준비 중':''}`} onClick={()=>g.url&&window.open(g.url,'_blank','noopener,noreferrer')}><GameThumbnail id={g.id}/></button>
      <div className="lobby-card-info"><div className="card-title-row"><h2>{r.name}</h2>{selected?<button className="card-play" disabled={p.busy} onClick={()=>r.status==='scheduled'?p.onStart(r):p.onRound(r.id)}>{r.status==='scheduled'?<Play size={14}/>:<BookOpen size={14}/>}<span>{r.status==='scheduled'?'회차 시작':'결과 입력'}</span></button>:<span className="card-order">{String(i).padStart(2,'0')}</span>}</div><div className="card-footer"><span>{g.url?'게임 열기':''}</span><button onClick={()=>p.onRound(r.id)} aria-label={`${r.name} 게임 소개`}>게임 소개 <ArrowRight size={13}/></button></div></div>
     </article>;}):CATALOG.map((g,i)=><article className="lobby-game-card preview-card" key={g.id}><div className="card-rail"><span>GAME {String(i+1).padStart(2,'0')}</span><span className="card-status">시즌에서 만나요</span></div><GameThumbnail id={g.id}/><div className="lobby-card-info"><div className="card-title-row"><h2>{g.name}</h2><span className="card-order">{String(i+1).padStart(2,'0')}</span></div><div className="card-footer"><span>{g.description}</span></div></div></article>)}
    </div>{s&&!rounds.length&&<div className="lobby-empty"><LayoutGrid size={32}/><h2>{tab==='all'?'첫 번째 게임을 선택해 주세요.':'이 조건에 해당하는 회차가 없습니다.'}</h2><button className="lobby-primary" onClick={p.onManage}>게임 목록 관리</button></div>}

   </>:<section className="lobby-ranking"><div className="ranking-heading"><Cup/><h2>{s?.status==='final'?'최종 순위':'전체 참가자 순위'}</h2><span>누적 획득 / 현재 보유</span></div>{!s?<div className="lobby-empty"><Trophy size={32}/><h2>시즌을 만들면 도전의 기록이 여기에 쌓입니다.</h2><button className="lobby-primary" onClick={p.onCreate}>시즌 만들기</button></div>:<><div className="lobby-rank-grid">{ranked.map(x=><button key={x.id} className={`lobby-rank-row ${x.rank===1?'leading':''}`} onClick={()=>p.onStudent(x.id)}><span className="rank-medal">{x.rank===1?<Cup/>:String(x.rank).padStart(2,'0')}</span><span><b>{x.name}</b><small>{x.tied?`공동 ${x.rank}위`:`${x.number}번 참가자`}</small></span><strong><Garnet/>{x.earned}<small>보유 {x.balance}</small></strong></button>)}</div></>}</section>}
  </main>
  <footer className="lobby-bottom"><span>{s?`${s.students.filter(x=>x.active).length}명 참가 · ${done}개 도전 완료`:'THINK TOGETHER. PLAY TOGETHER.'}</span><nav aria-label="로비 화면 전환"><button aria-current={page==='dashboard'?'page':undefined} className={page==='dashboard'?'active':''} onClick={()=>p.onPage('dashboard')}><LayoutGrid size={21}/>게임 선택</button><button aria-current={page==='ranking'?'page':undefined} className={page==='ranking'?'active':''} onClick={()=>p.onPage('ranking')}><Cup/>최종 순위</button></nav><button className="lobby-help" onClick={p.onHelp}><HelpCircle size={17}/> 저장·사용 안내</button></footer>
 </div>;
}
