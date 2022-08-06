import View from '../core/view'
import { NewsDetailsApi  } from '../core/api'
import { NewsDetails, NewsComment } from '../types'
import { store } from '../app'

export default class NewsDetailsView extends View {
  constructor(containerId: string) {

    let template = `
      <div class="bg-gray-600 min-h-screen pb-8">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                  <i class="fa fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
  
        <div class="h-full border rounded-xl bg-white m-6 p-4 ">
          <h2>{{__title__}}</h2>
          <div class="text-gray-400 h-20">
            {{__content__}}
          </div>
  
          {{__comments__}}
  
        </div>
      </div> 
    `;
    
    super(containerId, template);
  }

  render() {
    const id = location.hash.substring(7);
    const api = new NewsDetailsApi();
    const newDetails: NewsDetails = api.getData(id);
    // const content = callApi<NewsDetails>(CONTENT_API.replace("@id", id));
  
    for (let i=0; i<store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
      }
      break;
    }

    this.setTemplateData('comments', this.makeComments(newDetails.comments));
    this.setTemplateData('currentPage', String(store.currentPage));
    this.setTemplateData('title', newDetails.title);
    this.setTemplateData('content', newDetails.content);
    this.updateView();
  }

  private makeComments(comments: NewsComment[]): string {
    const commentString = [];
    
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      this.addHtml(`
        <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>
      `);
      if (comment.comments.length > 0) {
        this.addHtml(this.makeComments(comment.comments));
      }
    }
  
    return this.getHtml();
  }
}
