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

  titles.push('<ul>');
  for (let i=(store.currentPage - 1) * 10; i< store.currentPage * 10; i++) {
    titles.push(`
      <li>
        <a href="#/show/${data[i].id}">
          ${data[i].title} (${data[i].comments_count})
        </a>
      </li>
    `);
  }
  titles.push('</ul>')

  titles.push(`
    <div>
      <a href="#/page/${store.currentPage > 1? store.currentPage - 1: 1 }">이전</a>
      <span>${store.currentPage}</span>
      <a href="#/page/${store.currentPage + 1}">다음</a>
    </div>
  `)
  app.innerHTML = titles.join('');
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


