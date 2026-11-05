import {useState} from 'react';
import {CATALOG} from './catalog';
import {thumbnailUrl} from './visualAssets';
export function GameThumbnail({id}:{id:string}){
 const g=CATALOG.find(x=>x.id===id)!;
 const [failed,setFailed]=useState(false);
 const src=g.thumbnail??thumbnailUrl(id);
 return <div className={`square-thumbnail ${g.color}`} data-thumbnail-ratio="1:1">
  {src&&!failed?<img src={src} alt={`${g.name} 썸네일`} onError={()=>setFailed(true)} loading="lazy" decoding="async"/>:
   <div className="thumbnail-placeholder" role="img" aria-label={`${g.name} 임시 아트 · 정사각형 썸네일 준비 중`}><div className="placeholder-orbit"/><span>{g.symbol}</span><small>{g.id.toUpperCase()}</small><em>정사각형 썸네일 준비 중</em></div>}
 </div>;
}
