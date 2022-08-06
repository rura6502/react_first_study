import { displayPartsToString } from "typescript";

import { NewsFeed, NewsDetails, Store, RouteInfo} from './types';
import { Api, NewsFeedApi, NewsDetailsApi  } from './core/api'
import { NewsDetailsView, NewsFeedView }  from './page';
import Router from './core/router';

export const store: Store = {
  currentPage: 1,
  feeds: [],
}

function applyApiMixins(targetClass: any, baseClasses: [any]) {
  baseClasses.forEach(baseClass => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    })
  });
}

// interface NewsFeedApi extends Api {};
// interface NewsDetailsApi extends Api {};

applyApiMixins(NewsFeedApi, [Api])
applyApiMixins(NewsDetailsApi, [Api])







const router: Router = new Router();
const newsFeedView = new NewsFeedView('app');
const newsDetailsView = new NewsDetailsView('app');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailsView);

router.route();
