'use strict';

import MarkdownParser from './utils/markdownParser';
import Settings from './utils/settings';

const ROLLBAR_GET_ITEM_COUNTER_URL = 'https://api.rollbar.com/api/1/item_by_counter/<COUNTER>?access_token=<ACCESS_TOKEN>';
const ROLLBAR_GET_ITEM_URL         = 'https://api.rollbar.com/api/1/item/<ITEM_ID>?access_token=<ACCESS_TOKEN>';
const ROLLBAR_GET_ITEM_DETAIL      = 'https://api.rollbar.com/api/1/instance/<OCCURRENCE_ID>?access_token=<ACCESS_TOKEN>';
const GITHUB_POST_ISSUE_URL        = 'https://github.com/givery-technology/code-main/issues/new?title=<TITLE>&body=<BODY>';

class App {

  constructor() {
    const settings    = new Settings();
    this.settingItems = settings.getItems();
    if (settings.hasItem(this.getRollbarProjectNameFromURL())) {
      this.createButton();
    }
  }

  getRollbarProjectNameFromURL() {
    const regexp       = new RegExp('^https:\/\/rollbar.com\/.*\/(.*)\/items\/\d+\/?$');
    const regexpResult = regexp.exec(location.href, regexp);
    return regexpResult;
  }

  handleButtonClick() {

    const rollbarAccessToken = '14e439f85f8849dca316bf2450805fcb';

    fetch(accsessTokenDecorator(ROLLBAR_GET_ITEM_COUNTER_URL, rollbarAccessToken).replace('<COUNTER>', 55))
      .then((data) => data.json())
      .then(({ result }) => {
        return fetch(accsessTokenDecorator(ROLLBAR_GET_ITEM_URL, rollbarAccessToken).replace('<ITEM_ID>', result.id));
      })
      .then((data) => data.json())
      .then(({ result }) => {
        return fetch(accsessTokenDecorator(ROLLBAR_GET_ITEM_DETAIL, rollbarAccessToken).replace('<OCCURRENCE_ID>', result.first_occurrence_id));
      })
      .then((data) => data.json())
      .then(({ result }) => {
        console.log(result);

        const markdown = new MarkdownParser(result.data);
        console.log(markdown.parse());

        const githubPostIssueUrl = createGithubPostIssueURL(markdown.title(), markdown.parse());

        window.open(githubPostIssueUrl);

      })
      .catch((error) => {
        console.error(error);
      });
  }

  createButton() {
    const button     = document.createElement('button');
    const buttonText = document.createTextNode('GitHub issue');
    button.classList.add('btn');
    button.style.marginLeft = '10px';
    button.appendChild(buttonText);
    button.addEventListener('click', this.handleButtonClick);

    const targetElement = document.querySelector('.item-status-level-area');
    targetElement.appendChild(button);
  }
}

function createGithubPostIssueURL(title, body) {
  return GITHUB_POST_ISSUE_URL
    .replace('<TITLE>', title)
    .replace('<BODY>', encodeURIComponent(body));
}

function accsessTokenDecorator(url, token) {
  return url.replace('<ACCESS_TOKEN>', token);
}

new App();
