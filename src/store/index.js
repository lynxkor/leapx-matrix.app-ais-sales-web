import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import menu from './modules/menu';
import pageSource from './modules/page-source';
import enumModule from '@/libs/store/enum';
import businessData from './modules/businessData';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    menu,
    pageSource,
    enum: enumModule,
    businessData
  }
});
