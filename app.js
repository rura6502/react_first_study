const ajax = new XMLHttpRequest();
const LIST_API = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_API = 'https://api.hnpwa.com/v0/item/@id.json'

const app = document.getElementById("app");

ajax.open('GET', LIST_API, false);
ajax.send();

const data = JSON.parse(ajax.response);

window.addEventListener('hashchange', function() {
  const id = location.hash.substring(1);
  ajax.open('GET', CONTENT_API.replace("@id", id), false);
  ajax.send();
  
  const content = JSON.parse(ajax.response);

  app.innerHTML = `
    <h1>${content.title}</h1>
    <div>
      <a href="#">목록으로</a>
    </div>
  `;
})


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