const ajax = new XMLHttpRequest();
const LIST_API = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_API = 'https://api.hnpwa.com/v0/item/@id.json'

const app = document.getElementById("app");

ajax.open('GET', LIST_API, false);
ajax.send();

const data = JSON.parse(ajax.response);

const ul = document.createElement('ul');
window.addEventListener('hashchange', function() {
  const id = location.hash.substring(1);
  ajax.open('GET', CONTENT_API.replace("@id", id), false);
  ajax.send();
  
  const content = JSON.parse(ajax.response);

  const title = this.document.createElement('h1');
  title.innerHTML = `${content.title}`
  app.appendChild(title)
})

for (let i=0; i<10; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a")
  
  a.innerHTML =  `${data[i].title} (${data[i].comments_count})`;
  a.href = `#${data[i].id}`;

  li.appendChild(a);
  ul.appendChild(li);
}

app.appendChild(ul);