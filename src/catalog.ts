export const APP_TITLE = '지니어스 시즌';
export type Product = { id:string; name:string; description:string; price:number|null; enabled:boolean };
export type Game = { id:string; name:string; description:string; symbol:string; color:string; url:string|null; thumbnail:string|null; type:'winner'|'rank'|'team'|'direct'; product:Product };
// 실제 제공받은 고정 URL·이미지·이용권 정보만 이 파일에 입력합니다.
export const CATALOG:Game[] = [
 ['jury','배심원 게임','설득과 판단, 서로의 생각을 읽는 시간','⚖','sage','team'],
 ['virus','바이러스 게임','보이지 않는 선택이 만드는 새로운 판도','✳','red','team'],
 ['bean','콩의 딜레마','협력과 선택 사이, 우리의 전략은?','◉','olive','winner'],
 ['harvest','풍요와 기근','변화하는 상황 속에서 자원을 지켜라','✺','gold','rank'],
 ['number','비밀 숫자','작은 단서로 비밀의 숫자를 찾아라','?','blue','rank'],
 ['monopoly','독점게임','거래와 협상으로 완성하는 나만의 전략','▧','orange','winner'],
 ['twelve','십이장기','작은 판 위에서 펼쳐지는 치열한 수싸움','王','sage','rank'],
 ['laser','레이저 장기','빛의 경로를 읽고 다음 수를 설계하라','↗','red','rank'],
 ['blackwhite','흑과 백','드러난 색 뒤에 숨겨진 숫자의 심리전','◐','blue','rank'],
 ['maze','기억의 미로','기억과 논리로 보이지 않는 길을 열어라','▦','olive','rank'],
].map(([id,name,description,symbol,color,type])=>({id,name,description,symbol,color,url:null,thumbnail:null,type:type as Game['type'],product:{id:`ticket-${id}`,name:'이용권 준비 중',description:'이용권 내용과 가격이 아직 등록되지 않았습니다.',price:null,enabled:false}}));
