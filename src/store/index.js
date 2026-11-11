import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import menu from './modules/menu';
import pageSource from './modules/page-source';
import enumModule from '@/libs/store/enum';
import customViewModule from '@/libs/store/customView';
import businessData from './modules/businessData';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    menu,
    pageSource,
    enum: enumModule,
    // 自定义视图：AisPageTitle 与业务页之间的桥接，选中态按 bizKey 分桶缓存
    customView: customViewModule,
    businessData
  }
});
