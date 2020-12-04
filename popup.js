let titleDiv = {
  props: ['tabTitle'],
  data: function () {
    return {
      span: {
        marginRight: "30px",
        wordBreak: "break-all",
        minHeight: "24px",
        display: "flex",
        alignItems: "center",
        margin: "3px 30px 3px 0"
      }
    }
  },
  methods: {
    handleDblclick: function() {
      this.$emit('edit');
    }
  },
  computed: {
    content: function() {
      return this.tabTitle;
    }
  },
  template: `
  <span :style="span" @dblclick="handleDblclick">{{content}}</span>
  `
}

let titleTextarea = {
  props: ['tabTitle'],
  data: function () {
    return {
      content: this.tabTitle,
      textarea: {
        marginRight: "30px",
        wordBreak: "break-all",
        height: "20px",
        width: "260px"
      }
    }
  },
  methods: {
    handleBlur: function () {
      this.$emit('save', this.content);
    }
  },
  template: `
  <textarea :style="textarea" @blur="handleBlur" v-model="content"></textarea>
  `
}

let Tab = {
  props: ['tab', 'mytitle', 'mycolor', 'myicon', 'origintitle'],
  components: {
    "myDiv": titleDiv, 
    "myTextarea": titleTextarea
  },
  data: function () {
    return {
      currentTabComponent: 'myDiv',
      myTitle: this.mytitle,
      colorCircle: [{
        id:0,
        color: "#e8e8e8",
        style: {
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          marginRight: "5px",
          backgroundColor: "#e8e8e8",
          cursor: "pointer"
        }
      }, {
        id:1,
        color: "rgba(92,110,145,0.5)",
        style: {
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          marginRight: "5px",
          backgroundColor: "#5c6e91",
          cursor: "pointer"
        }
      }, {
        id:2,
        color: "rgba(143,56,77,0.5)",
        style: {
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          marginRight: "5px",
          backgroundColor: "#8f384d",
          cursor: "pointer"
        }
      }, {
        id:3,
        color: "rgba(221,152,102,0.5)",
        style: {
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          marginRight: "5px",
          backgroundColor: "#dd9866",
          cursor: "pointer"
        }
      }],
      container: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        width: "300px",
        overflow: "hidden"
      },
      
      backContainer: {
        height: "28px",
        width: "28px",
        borderRadius: "4px",
        backgroundColor: "#e8e8e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "5px",
        cursor: "pointer"
        //display: "none"
      },
      
      back: {
        width: "16px",
        height: "16px"
      },
      
      icon: {
        width: "16px",
        height: "16px",
        marginRight: "5px"
      },
      
      close: {
        width: "20px",
        height: "20px",
        position: "absolute",
        right: "10px"
      },
      
      span: {
        marginRight: "30px",
        wordBreak: "break-all"
      },

      colorContainer: {
        display: "flex"
      },

      titleStyle: {
        width: "300px",
        minHeight: "30px",
        backgroundColor: this.mycolor,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        borderRadius: "4px"
      },
      slideDiv: {
        alignItems: "center",
        display: "none"
      },
      touchArea: {
        height: "30px",
        width: "5px",
      }
    }
  },
  computed: {
    myColor: function () {
      //return this.mycolor;
      return this.tab.color
    },
    myIcon: function () {
      return this.myicon;
    }
  },
  methods: {
    closeTab: function () {
      this.$emit('deletetab', this.tab.id);
    },
    editTitle: function () {
      this.currentTabComponent = "myTextarea";
    },
    saveTitle: function (data) {
      this.$emit('edit', [data, this.tab.id])
      this.currentTabComponent = "myDiv";
      this.myTitle = data
    },
    originName: function () {
      this.myTitle = this.origintitle
      this.$emit('ret')
    },
    changeColor: function (color) {
      this.titleStyle.backgroundColor = color
      this.$emit('color', [color, this.tab.id])
    },
    appear: function () {
      this.slideDiv.display = "flex"
    },
    disappear: function () {
      this.slideDiv.display = "none"
      console.log("disapper")
    }
  },
  template: `
  <div class="container" :style="container">
    <div :style="slideDiv" @mouseleave="disappear">
      <div :style="colorContainer" v-for="color in colorCircle" :key="color.id">
        <div :style="color.style" @click="changeColor(color.color)"></div>
      </div>
      <div class="back-container" :style="backContainer">
        <img src="../images/back.png" alt="" class="back" :style="back" @click="originName">
      </div>
    </div>
    <div class="title" :style="titleStyle">
      <div :style="touchArea" @mouseover="appear"></div>
      <img :src="myIcon" alt="" class="icon" :style="icon" @mouseover="disappear">
      <component :is="currentTabComponent" @edit="editTitle" @save="saveTitle" :tabTitle="myTitle" @mouseover="disappear"></component>
      <img src="../images/close.png" alt="" class="close" :style="close" @click="closeTab" @mouseover="disappear">
    </div>
  </div>
  `
}


let app = new Vue({
  el: "#app",
  components: {
    'my-tab': Tab
  },
  data: {
    tabsCollect: null,
    //tabMap: new Map(),
    tabInfo: null,
    titles: {},
    colors: {},
    icons: {},
    isMounted: false,
  },
  mounted: function () {
    const promise = new Promise((resolve, reject) =>{
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        this.tabsCollect = tabs;
        console.log(this.tabsCollect)
        resolve();
      });
    }).then(() => {
      chrome.storage.sync.get('tabs', (res) => {
        let data = JSON.parse(res.tabs);

        if (data) {
          this.tabInfo = data;                          //tabInfo的key类型为String
          for (let key in this.tabInfo) {
            let keyNumber =  parseInt(key);
            let mytab = this.getTabInfo(keyNumber);
            if (mytab) {
              if (this.tabInfo[key].url !== mytab.url) {
                this.tabInfo[key].id = mytab.id;
                this.tabInfo[key].title = mytab.title;
                this.tabInfo[key].color = "#e8e8e8";
                this.tabInfo[key].index = mytab.index;
                this.tabInfo[key].url = mytab.url;
                this.tabInfo[key].favIconUrl = mytab.favIconUrl
              }
            } else {
              delete this.tabInfo[key];
            }
          }

          this.tabsCollect.forEach((tab) => {
            if(!this.tabInfo[tab.id]) {
              let newObj = {
                title: tab.title,
                url: tab.url,
                color: "#e8e8e8",
                favIconUrl: tab.favIconUrl,
                index: tab.index,
                id: tab.id
              }
              this.tabInfo[tab.id.toString()] = newObj;
            }
          })

        } else {
          this.tabInfo = new Object();
          this.tabsCollect.forEach(tab => {
            let obj = {
              title: tab.title,
              url: tab.url,
              color: "#e8e8e8",
              favIconUrl: tab.favIconUrl,
              index: tab.index
            };
            this.tabInfo[tab.id.toString()] = obj
          });
        }

        for (let key in this.tabInfo) {
          let keyNumber = parseInt(key)
          this.titles[keyNumber] = this.tabInfo[key].title
          this.colors[keyNumber] = this.tabInfo[key].color
          this.icons[keyNumber] = this.tabInfo[key].favIconUrl
        }

        this.isMounted = true
      });
    })

  },
  beforeDestroy: function () {
    this.saveData();
  },
  methods: {
    delTab: function (id) {
      delete this.tabInfo[id];
      console.log(this.tabInfo)
      chrome.tabs.remove(id)
      location.reload()
    },
    returnName: function(id) {
      let obj = this.tabsCollect.filter(tab => {
        return tab.id == id
      })
      this.$set(this.titles, id, obj[0].title)
      this.tabInfo[id].title = obj[0].title
      this.saveData()
    },
    modifyTitle: function ([editedtitle, tabId]) {
     this.$set(this.titles, tabId, editedtitle)
     this.tabInfo[tabId].title = editedtitle
     this.saveData()
    },
    saveData: function() {
      chrome.storage.sync.set({tabs: JSON.stringify(this.tabInfo)}, () => {
        console.log("save it!")
      });
    },
    saveColor: function([color, tabId]) {
      this.$set(this.colors, tabId, color)
      this.tabInfo[tabId].color = color
      this.saveData()
    },
    getTabInfo: function(id) {
      let obj =  this.tabsCollect.filter((tab) => {
        return tab.id === id;
      })
      return obj[0];
    },
  },

})


