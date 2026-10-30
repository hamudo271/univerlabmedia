/**
 * 칼럼 본문의 <table> 을 가로 스크롤 래퍼(<div class="table-wrap">)로 감싼다.
 * 편집기(Tiptap)는 저장할 때 이 래퍼를 지우므로, 공개 페이지에서 그릴 때마다
 * 다시 씌운다. 이미 감싸진 표는 한 번 벗긴 뒤 감싸서 겹치지 않는다.
 * 공개 상세(src/pages/ColumnDetail.jsx)와 서버 렌더(server/lib/renderColumnPost.js)가 같이 쓴다.
 */
export function wrapTables(html = "") {
  return String(html)
    .replace(/<div class="table-wrap">\s*(<table[\s\S]*?<\/table>)\s*<\/div>/g, "$1")
    .replace(/<table[\s\S]*?<\/table>/g, (t) => `<div class="table-wrap">${t}</div>`);
}
