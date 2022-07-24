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

  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${content.title}</h2>
        <div class="text-gray-400 h-20">
          ${content.content}
        </div>

        {{__comments__}}

      </div>
    </div> 
  `;
  template = template.replace('{{__comments__}}', makeComments(content.comments));
  app.innerHTML = template;
}

function showList() {
  const data = callApi(LIST_API)
  const titles = [];

  let template = `
  <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/{{__previous_page__}}" class="text-gray-500">
              Previous
            </a>
            <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
              Next
            </a>
          </div>
        </div> 
      </div>
    </div>
    <div class="p-4 text-2xl text-gray-700">
      {{__titles__}}
    </div>
  </div>
  `;

  for (let i=(store.currentPage - 1) * 10; i< store.currentPage * 10; i++) {
    titles.push(`
      <div class="p-6 ${data[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
      <div class="flex">
        <div class="flex-auto">
          <a href="#/show/${data[i].id}">${data[i].title}</a>  
        </div>
        <div class="text-center text-sm">
          <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${data[i].comments_count}</div>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="grid grid-cols-3 text-sm text-gray-500">
          <div><i class="fas fa-user mr-1"></i>${data[i].user}</div>
          <div><i class="fas fa-heart mr-1"></i>${data[i].points}</div>
          <div><i class="far fa-clock mr-1"></i>${data[i].time_ago}</div>
        </div>
      </div>
    </div>
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

function makeComments(comments, called = 0) {
  const commentString = [];
  
  for (let i = 0; i < comments.length; i++) {
    commentString.push(`
      <div style="padding-left: ${called * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comments[i].user}</strong> ${comments[i].time_ago}
        </div>
        <p class="text-gray-700">${comments[i].content}</p>
      </div>
    `);
    if (comments[i].comments.length > 0) {
      commentString.push(makeComments(comments[i].comments, called + 1));
    }
  }

  return commentString.join('');
}

window.addEventListener('hashchange', router)
router();


