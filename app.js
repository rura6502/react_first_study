const { toEditorSettings } = require("typescript");

const ajax = new XMLHttpRequest();
const LIST_API = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_API = 'https://api.hnpwa.com/v0/item/@id.json'

const app = document.getElementById("app");

const store = {
  currentPage: 1
}

function callApi(url) {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function showContent() {
  const id = location.hash.substring(7);
  
  const content = callApi(CONTENT_API.replace("@id", id));

  app.innerHTML = `
    <h1>${content.title}</h1>
    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
}

function showList() {
  const data = callApi(LIST_API)
  const titles = [];

  let template = `
    <div>
      <h1>Hacker News</h1>
      <ul>
        {{__titles__}}
      </ul>
      <div>
        <a href="#/page/{{__previous_page__}}">이전</a>
        <a href="#/page/{{__next_page__}}">다음</a>
      </div>
    </div>
  `;

  for (let i=(store.currentPage - 1) * 10; i< store.currentPage * 10; i++) {
    titles.push(`
      <li>
        <a href="#/show/${data[i].id}">
          ${data[i].title} (${data[i].comments_count})
        </a>
      </li>
    `);
  }
  
  template = template.replace('{{__titles__}}', titles.join(''));
  template = template.replace('{{__previous_page__}}', store.currentPage > 1? store.currentPage - 1: 1 )
  template = template.replace('{{__next_page__}}', store.currentPage + 1 )
  app.innerHTML = template;
}

function router() {
  const hash = location.hash;

  if (hash === '') {
    showList();
  } else if (hash.indexOf('#/page/') >= 0) {
    store.currentPage = Number(hash.substring(7));
    showList();
  } else {
    showContent();
  }
}

window.addEventListener('hashchange', router)
router();


