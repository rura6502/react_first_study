const ajax = new XMLHttpRequest();
const LIST_API = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_API = 'https://api.hnpwa.com/v0/item/@id.json'

const app = document.getElementById("app");

function callApi(url) {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function showContent() {
  const id = location.hash.substring(1);
  
  const content = callApi(CONTENT_API.replace("@id", id));

  app.innerHTML = `
    <h1>${content.title}</h1>
    <div>
      <a href="#">목록으로</a>
    </div>
  `;
}

function showList() {
  const data = callApi(LIST_API)
  const titles = [];
  titles.push('<ul>');
  for (let i=0; i<10; i++) {
    titles.push(`
      <li>
        <a href="#${data[i].id}">
          ${data[i].title} (${data[i].comments_count})
        </a>
      </li>
    `);
  }
  titles.push('</ul>')
  app.innerHTML = titles.join('');
}

window.addEventListener('hashchange', showContent)

showList();