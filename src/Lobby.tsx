import {useState,useEffect,useRef} from 'react';
import {Trophy,Settings,ArrowRight,Plus,ChevronLeft,ChevronRight,Users,Gem,Maximize,Volume2,VolumeX,BookOpen,Play,LayoutGrid,HelpCircle} from 'lucide-react';
import {APP_TITLE,CATALOG} from './catalog';
import {ranking,type State,type Round} from './core';
import {GameThumbnail} from './GameThumbnail';
import {LOBBY_BACKGROUND,GARNET_ICON,TROPHY_ICON} from './visualAssets';
import './lobby.css';
function Garnet(){return GARNET_ICON?<img className="garnet-art" src={GARNET_ICON} alt="가넷"/>:<Gem size={17}/>;}
function Cup(){return TROPHY_ICON?<img className="trophy-art" src={TROPHY_ICON} alt="우승 트로피"/>:<Trophy/>;}
type Props={s:State|null;page:'dashboard'|'ranking';onPage:(p:'dashboard'|'ranking')=>void;busy:boolean;gem:React.ReactNode;onCreate:()=>void;onManage:()=>void;onSettings:()=>void;onRoster:()=>void;onHelp:()=>void;onSound:()=>void;onFullscreen:()=>void;onRound:(id:string)=>void;onStart:(r:Round)=>void;onStudent:(id:string)=>void;onResume:()=>void;alerts:React.ReactNode};
const labels={scheduled:'대기',playing:'진행 중',draft:'입력 중',paid:'완료'};
export function Lobby(p:Props){
 const {s,page}=p,ranked=s?ranking(s):[];
 const [filter,setFilter]=useState<'all'|'pending'|'paid'>('all'),[selected,setSelected]=useState(0);
 const rounds=s?.rounds.filter(r=>filter==='all'||(filter==='paid'?r.status==='paid':r.status!=='paid'))??[];
 const cards=s?rounds.map(r=>({key:r.id,game:CATALOG.find(g=>g.id===r.gameId)!,round:r})):CATALOG.map(game=>({key:game.id,game,round:null}));
 const count=cards.length,index=count?Math.min(selected,count-1):0;
 const gesture=useRef<{x:number;y:number;pointer:number;swiped:boolean}|null>(null),blockClick=useRef(false),wheelAt=useRef(0),[dragX,setDragX]=useState(0);
 const step=(delta:number)=>{if(count>1)setSelected(n=>((n+delta)%count+count)%count);};
 useEffect(()=>{setSelected(0);},[filter,s?.id]);
 const done=s?.rounds.filter(r=>r.status==='paid').length??0;
 return <div className={'game-lobby carousel-lobby '+(page==='dashboard'?'showcase-page':'rank-page')} style={LOBBY_BACKGROUND?{'--lobby-bg':`url("${LOBBY_BACKGROUND}")`} as React.CSSProperties:undefined}>
 <header className="lobby-header"><button className="lobby-brand" onClick={()=>p.onPage('dashboard')} aria-label="지니어스 게임 선택으로">{p.gem}<span>{APP_TITLE}</span></button><div className="lobby-season"><span className="season-seal">시즌</span><b>{s?.name??'우리 반 두뇌 챌린지'}</b></div><div className="lobby-tools"><button className="header-create" onClick={p.onCreate}><Plus size={18}/><span>우리 반 시즌 만들기</span></button><span className="lobby-save" role="status">{p.busy?'저장 중…':s?'자동 저장 완료':'기기 내 저장'}</span><button aria-label={s?.settings.sound?'효과음 끄기':'효과음 켜기'} onClick={p.onSound}>{s?.settings.sound?<Volume2 size={19}/>:<VolumeX size={19}/>}</button><button aria-label="전체 화면" onClick={p.onFullscreen}><Maximize size={19}/></button><button className="teacher-control" onClick={p.onSettings}><Settings size={18}/><span>교사 메뉴</span></button></div></header>
 {p.alerts}
 <main className="lobby-main">
 {s&&<div className="season-ribbon"><span>{s.className||s.name}</span><span>{s.students.filter(x=>x.active).length}명 참가</span><span>{done} / {s.rounds.length} 완료</span><div className="ribbon-actions"><span className="copy-wrap"><button className="roster-highlight" onClick={p.onRoster} aria-describedby="copy-help"><Users size={20}/> 학생 이름 복사</button><span className="copy-tooltip" role="tooltip" id="copy-help">복사 버튼을 누른 후 개별 게임의 학생 등록 창에 붙여넣기 해주세요.</span></span></div></div>}
 {page==='dashboard'?<>
 <div className="lobby-grid-heading"><div className="lobby-filters" role="group" aria-label="게임 목록 필터">{(['all','pending','paid'] as const).map(f=><button key={f} disabled={!s&&f!=='all'} aria-pressed={filter===f} className={filter===f?'chosen':''} onClick={()=>setFilter(f)}>{f==='all'?'전체 게임':f==='pending'?'대기·진행': '완료'}</button>)}</div>{s&&<button className="lobby-link manage-link" onClick={p.onManage}>게임 관리</button>}</div>
 {count?<section className="coverflow" aria-label="게임 선택" aria-roledescription="회전형 게임 목록" tabIndex={0} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}}} onWheel={e=>{const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(Math.abs(delta)>10&&Date.now()-wheelAt.current>280){wheelAt.current=Date.now();step(delta>0?1:-1);}}} onPointerDown={e=>{if(e.button!==0)return;blockClick.current=false;gesture.current={x:e.clientX,y:e.clientY,pointer:e.pointerId,swiped:false};}} onPointerMove={e=>{const g=gesture.current;if(!g||g.pointer!==e.pointerId)return;const dx=e.clientX-g.x;if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(e.clientY-g.y)){if(!g.swiped)e.currentTarget.setPointerCapture(e.pointerId);g.swiped=true;blockClick.current=true;setDragX(Math.max(-60,Math.min(60,dx*.25)));}}} onPointerUp={e=>{const g=gesture.current;if(!g||g.pointer!==e.pointerId)return;if(g.swiped&&Math.abs(e.clientX-g.x)>45)step(e.clientX<g.x?1:-1);gesture.current=null;setDragX(0);setTimeout(()=>{blockClick.current=false;},0);}} onPointerCancel={()=>{gesture.current=null;blockClick.current=false;setDragX(0);}} onClickCapture={e=>{if(blockClick.current){e.preventDefault();e.stopPropagation();}}}>
 <div className="coverflow-stage" style={{'--drag-x':`${dragX}px`} as React.CSSProperties}>
 {cards.map((card,i)=>{let offset=i-index;if(offset>count/2)offset-=count;if(offset< -count/2)offset+=count;const active=offset===0,visible=Math.abs(offset)<=2,r=card.round,g=card.game;
 return <article key={card.key} className={`flow-card ${active?'front-card':''}`} data-offset={offset} aria-hidden={!visible} inert={!active} style={{'--offset':offset,'--distance':Math.abs(offset),zIndex:10-Math.abs(offset),visibility:visible?'visible':'hidden'} as React.CSSProperties}>
 <div className="flow-card-shell"><div className="flow-status"><span>{r?labels[r.status]:'대기'}</span>{r?.status==='paid'&&<span>지급 완료</span>}</div>
 <button className="flow-art" aria-label={`${g.name} 게임 열기`} disabled={!g.url} draggable={false} onDragStart={e=>e.preventDefault()} onClick={()=>g.url&&window.open(g.url,'_blank','noopener,noreferrer')}><GameThumbnail id={g.id}/></button>
 <div className="flow-details"><h1>{r?.name??g.name}</h1><div className="flow-actions">{r?<><button className="lobby-primary" disabled={p.busy} onClick={()=>r.status==='scheduled'?p.onStart(r):p.onRound(r.id)}>{r.status==='scheduled'?<Play size={18}/>:<BookOpen size={18}/>} {r.status==='scheduled'?'시작하기':r.status==='paid'?'결과 보기':'가넷 지급'}</button><button className="flow-guide" onClick={()=>p.onRound(r.id)}>게임 소개 <ArrowRight size={17}/></button></>:<button className="lobby-primary" disabled={!g.url} onClick={()=>g.url&&window.open(g.url,'_blank','noopener,noreferrer')}>게임 열기 <ArrowRight size={18}/></button>}</div></div></div>
 </article>;})}
 {cards.map((card,i)=>{let offset=i-index;if(offset>count/2)offset-=count;if(offset< -count/2)offset+=count;return offset&&Math.abs(offset)<=2?<button key={card.key} className="flow-side-select" style={{'--offset':offset,'--distance':Math.abs(offset),zIndex:20-Math.abs(offset)} as React.CSSProperties} aria-label={`${card.game.name} 가운데로 이동`} onClick={()=>setSelected(i)}><span>{card.game.name}</span></button>:null;})}
 </div>
 <div className="flow-navigation"><button aria-label="이전 게임" disabled={count<2} onClick={()=>step(-1)}><ChevronLeft size={24}/></button><span aria-live="polite" aria-atomic="true">{cards[index]?.game.name}</span><button aria-label="다음 게임" disabled={count<2} onClick={()=>step(1)}><ChevronRight size={24}/></button></div>
 <div className="flow-dots" aria-label="게임 바로 선택">{cards.map((c,i)=><button key={c.key} aria-label={`${c.game.name} 선택`} aria-current={index===i?'true':undefined} title={c.game.name} onClick={()=>setSelected(i)}/>)}</div>
 </section>:<div className="lobby-empty"><h2>표시할 게임이 없습니다.</h2><button className="lobby-primary" onClick={p.onManage}>게임 추가</button></div>}
 </>:<section className="lobby-ranking"><div className="ranking-heading"><Cup/><h2>최종 순위</h2><span>누적 획득 / 현재 보유</span></div>{!s?<div className="lobby-empty"><h2>시즌을 만들어 주세요.</h2><button className="lobby-primary" onClick={p.onCreate}>시즌 만들기</button></div>:<div className="lobby-rank-grid">{ranked.map(x=><button key={x.id} className={`lobby-rank-row ${x.rank===1?'leading':''}`} onClick={()=>p.onStudent(x.id)}><span className="rank-medal">{x.rank===1?<Cup/>:x.rank}</span><span><b>{x.name}</b>{x.tied&&<small>공동 {x.rank}위</small>}</span><strong><Garnet/>{x.earned}<small>보유 {x.balance}</small></strong></button>)}</div>}</section>}
 </main>
 <footer className="lobby-bottom"><nav aria-label="로비 화면 전환"><button aria-current={page==='dashboard'?'page':undefined} className={page==='dashboard'?'active':''} onClick={()=>p.onPage('dashboard')}><LayoutGrid size={21}/>게임 선택</button><button aria-current={page==='ranking'?'page':undefined} className={page==='ranking'?'active':''} onClick={()=>p.onPage('ranking')}><Cup/>최종 순위</button></nav><button className="lobby-help" onClick={p.onHelp}><HelpCircle size={17}/> 저장·사용 안내</button></footer>
 </div>;
}
