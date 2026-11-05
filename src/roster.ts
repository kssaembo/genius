import type {Student} from './core';
export type RosterFormat='names'|'number-name'|'tsv'|'json';
export function exportRoster(students:Student[],format:RosterFormat):string {
 const active=students.filter(s=>s.active).toSorted((a,b)=>a.number.localeCompare(b.number,'ko',{numeric:true}));
 if(format==='json')return JSON.stringify({version:1,students:active.map(({id,number,name})=>({id,number,name}))},null,2);
 if(format==='tsv')return ['번호\t이름',...active.map(s=>`${s.number}\t${s.name}`)].join('\n');
 if(format==='number-name')return active.map(s=>`${s.number} ${s.name}`).join('\n');
 return active.map(s=>s.name).join('\n');
}
