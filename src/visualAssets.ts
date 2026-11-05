// 파일을 추가한 뒤 다시 빌드하면 UI에서 자동으로 찾습니다. 카탈로그·가넷 로직과 분리합니다.
const assets=import.meta.glob<string>('./assets/**/*.{png,webp,jpg,jpeg}',{eager:true,query:'?url',import:'default'});
export function thumbnailUrl(id:string):string|null {
 for(const ext of ['png','webp','jpg','jpeg']){const file=assets[`./assets/thumbnails/${id}.${ext}`];if(file)return file;}
 return null;
}
export const LOBBY_BACKGROUND=assets['./assets/backgrounds/lobby-bg.webp']??assets['./assets/backgrounds/lobby-bg.jpg']??assets['./assets/backgrounds/lobby-bg.png']??null;
export const GARNET_ICON=assets['./assets/icons/garnet.webp']??null;
export const TROPHY_ICON=assets['./assets/icons/trophy.webp']??null;
