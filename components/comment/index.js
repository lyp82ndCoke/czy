
import network from '../../utils/network.js';
const router = require('../../utils/router.js');
Component({
  /**
   * 组件的属性列表
   * type:全部留言1/我的留言2
   * showBtn:是否显示留言按钮
   * articleId:当前文章/金句/群聊的id
   * articleTitle:文章类型 1好文 2群聊 3金句
   * articleTitle:文章title   和按钮一起
   * commTitle:精选留言/我的留言
   * 
   */
  properties: {
    showBtn: {
      type: Boolean,
      value: false
    },
    articleId: {
      type: String,
      value: ""
    },
    commenType: {
      type: String,
      value: ''
    },
    articleTitle: {
      type: String,
      value: ''
    },
    articleType: {
      type: String,
      value: ''
    },
    commTitle: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    page_size: 4,
    page_num: 1,
    list: [

    ],
    loading: false,
    over: false
  },
  
  ready() {
    this.getList()
    console.log('准备好了')
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取留言list
    getList(add) {
      if(!add){
        this.setData({
          page_num:1
        })
      }
      const formData = {
        page_num: this.data.page_num,
        page_size: this.data.page_size,
        article_id: this.data.articleId,
        article_type: this.data.articleType,
        comment_type: this.data.commenType,
      }
      network.request('getComment', formData, data => {
        if (this.data.loading) {
          return false;
        }
        this.setData({
          loading: true
        })
        // 获取原始数据（列表已有数据）
        let list = this.data.list;
        // 获取心情求的数据newData
        let newData = data.list;
        console.log(list.length, this.data.page_size)
        if (newData.length < this.data.page_size) {
          this.triggerEvent('commentOver');
          this.setData({
            over: true
          });
        }
        let page_num=2 ;
        // 如果是下拉请求更多的话  拼接原始数据
        if (add) {
          newData = list.concat(newData)
          page_num = this.data.page_num + 1;
        }
        console.log(newData, "newData")
       
        
        // 如果新的数据小于当前分页数量 设置下拉数据以为空  over为true

        console.log(this.data, "data")
        // 设置数据
        this.setData({
          page_num,
          list: newData,
          loading: false,
        });
      })
    },
    // 点赞
    like(e) {
      console.log("like", e.currentTarget.dataset.index)
      let action_type = e.currentTarget.dataset.like;
      action_type = (action_type == 1 ? 2 : 1);
      const index = e.currentTarget.dataset.index;
      console.log(this.data.list[index])
      const formData = {
        identify_id: this.data.list[index].comment_id,
        identify_type: 6,
        action_type,
      }
      network.request('likeAction', formData, data => {

        const zanStr = `list[${index}].is_zan`;
        const numStr = `list[${index}].zan_num`;
        this.setData({
          [zanStr]: data.is_zans,
          [numStr]: data.zan_num
        })
      })

    },
    // 写留言
    publish(e){
      console.log(e)
      const id = e.currentTarget.dataset.id;
      const title = e.currentTarget.dataset.title;
      const type = e.currentTarget.dataset.type;
      const url = `pages/publish/publish?id=${id}&type=${type}&title=${title}`;
      console.log(url,"url")
      router.navigate({
        path: url
      })
    },



    getuserinfo(e) {
      const userinfo = e.detail.userInfo;
      if (userinfo) {
        const newUserInfo = {
          openid: wx.getStorageSync('openid'),
          nickname: userinfo.nickName,
          sex: userinfo.gender,
          city: userinfo.city,
          province: userinfo.province,
          country: userinfo.country,
          avatar: userinfo.avatarUrl,
        }
        wx.setStorageSync("userinfo", newUserInfo);
        network.request("saveUserInfo", newUserInfo, data => {

        })

        this.triggerEvent('getuserinfo')
      } else {
        this.triggerEvent('cancel')
      }
    },
    cancel() {
      this.triggerEvent('cancel')
    }
  },
})