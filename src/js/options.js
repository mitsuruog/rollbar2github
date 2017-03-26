import Vue from "vue";

import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../css/options.css";

import Settings from "./utils/settings";

const settings = new Settings();

Vue.component('setting-item', {
  props: ['item'],
  template: `
    <div class="row">
      <div class="col-xs-4">
        <input type="text" v-model="item.rollbarKey">
      </div>      
      <div class="col-xs-4">
        <input type="text" v-model="item.rollbarProjectName">
      </div>      
      <div class="col-xs-4">
        <input type="text" v-model="item.githubRepoName">
      </div>      
    </div>
  `
});

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    settingItems: settings.getItems()
  }
});
