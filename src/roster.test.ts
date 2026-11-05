import test from 'node:test';
import assert from 'node:assert/strict';
import {exportRoster} from './roster';
import {type Student} from './core';
const students:Student[]=[{id:'b',name:'하늘',number:'10',active:true},{id:'a',name:'하늘',number:'2',active:true},{id:'c',name:'나래',number:'3',active:false}];
test('명단 복사: 활성 학생만 숫자 번호순, 원본 순서 보존',()=>{assert.equal(exportRoster(students,'number-name'),'2 하늘\n10 하늘');assert.equal(students[0].number,'10');assert.equal(exportRoster(students,'names'),'하늘\n하늘');});
test('TSV는 번호·이름 표로, JSON은 고유 ID를 보존',()=>{assert.equal(exportRoster(students,'tsv'),'번호\t이름\n2\t하늘\n10\t하늘');const out=JSON.parse(exportRoster(students,'json'));assert.deepEqual(out,{version:1,students:[{id:'a',number:'2',name:'하늘'},{id:'b',number:'10',name:'하늘'}]});assert.equal('ledger' in out,false);});
test('빈 명단과 비활성 명단은 이름을 내보내지 않음',()=>{assert.equal(exportRoster([],'names'),'');assert.equal(exportRoster(students.filter(x=>!x.active),'number-name'),'');});
