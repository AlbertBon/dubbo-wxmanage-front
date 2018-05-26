import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
    tabsValue: '1',
    tabIndex: 1,
    tabsJson: [
        {
            name: '1',
            title: '主页',
            content: 'main'
        }
    ]
}

const mutations = {
    addTab(state, item) {
        let tabs = state.tabsJson;
        let reopen= false;
        tabs.forEach((tab, index) => {
            if(item.path == tab.content){
                state.tabsValue=tab.name;
                reopen=true;
                // console.log('重新打开tab'+tab.content);
                return false;
            }
        });
        if (!reopen) {
            let newTabName = ++state.tabIndex + '';
            state.tabsJson.push({
                title: item.title,
                name: newTabName,
                content: item.path
            });
            state.tabsValue = newTabName;
            // console.log('新开页面：'+item.title);
        }
        
    },
    removeTab(state, targetName) {
        let tabs = state.tabsJson;
        let activeName = state.tabsValue;
        if (activeName === targetName) {
            tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                    let nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                        activeName = nextTab.name;
                    }
                }
            });
        }
        state.tabsValue = activeName;
        state.tabsJson = tabs.filter(tab => tab.name !== targetName);
    }
}

export default new Vuex.Store({
    state,mutations
})