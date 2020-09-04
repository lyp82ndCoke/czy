Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/img/home.jpg",
      selectedIconPath: "/img/ishome.jpg",
      text: "首页"
    }, {
        pagePath: "/pages/training/index",
        iconPath: "/img/learn.jpg",
        selectedIconPath: "/img/islearn.jpg",
      text: "训练营"
      }, {
        pagePath: "/pages/growing-up/index",
        iconPath: "/img/growup.jpg",
        selectedIconPath: "/img/isgrowup.jpg",
        text: "成长墙"
      }, {
        pagePath: "/pages/my/index",
        iconPath: "/img/my.jpg",
        selectedIconPath: "/img/ismy.jpg",
        text: "我的"
      }]
      
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      console.log(data,"data")
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})