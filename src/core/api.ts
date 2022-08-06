import { NewsFeed, NewsDetails } from '../types'
import { LIST_API, CONTENT_API } from '../config'

export  class Api {
  getRequest<T>(url: string): T {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);  
  }
}

export class NewsFeedApi extends Api{
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(LIST_API);
  }
}

export class NewsDetailsApi extends Api {
  getData(id: string): NewsDetails {
    return this.getRequest<NewsDetails>(CONTENT_API.replace('@id', id));
  }
}