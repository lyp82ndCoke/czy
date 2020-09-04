const router = require('../../utils/router.js');
import network from '../../utils/network';
const app = getApp();
Page({
    data: {
      sendred: false,
      fontvaluelength: 0,
      content: '',
      pic_url: [],
      is_open: true,
      times_task_user_info: {},
      camp_times_info: {},
      task_info: {},
      postMsgFlag: true
    },
    onLoad: function(options){
      this.setData({
        times_task_content_id: options.times_task_content_id,
        times_task_id: options.times_task_id,
        camp_times_id: options.camp_times_id,
        task_view_unionid: options.task_view_unionid,
        index: options.index,
        is_bind_match: options.is_bind_match
      })
      this.getUserTaskInfo()
    },
    getUserTaskInfo() {
      network.request('userTaskInfo', {camp_times_id: this.data.camp_times_id, times_task_id: this.data.times_task_id, task_view_unionid: this.data.task_view_unionid}, data => {
        this.setData({
          times_task_user_info: data.times_task_user_info,
          camp_times_info: data.camp_times_info,
          task_info: data.task_info
        })
      })
    },
    radioChang() {
      this.setData({
        is_open: !this.data.is_open
      })
    },
    //点击发布
    publishMsg () {
      if (!this.data.content && this.data.pic_url.length <= 0) {
        wx.showToast({
          title: '请填写内容或上传图片',
          icon: 'none'
        })
        return
      }
      let is_open
      if (this.data.is_open) { is_open = true } else { is_open = 2 }
      let data = {
        times_task_id: this.data.times_task_id,
        camp_times_id: this.data.camp_times_id,
        times_task_content_id: this.data.times_task_content_id,
        is_open: is_open,
        pic_url: this.data.imgList,
        details: this.data.content
      }
      network.request('submitTask', data, res => {
        // 修改上一页的任务完成
        let pages = getCurrentPages();
        let currPage = null;                    //当前页面
        let prevPage = null;                    //上一个页面
        if (pages.length >= 2) {
          currPage = pages[pages.length - 1];   //当前页面
          prevPage = pages[pages.length - 2];   //上一个页面
        }
        if (prevPage) {
          prevPage.setData({
            'times_task_user_info.finish_task_num': parseInt(prevPage.data.times_task_user_info.finish_task_num) + 1
          })
        }
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: () => {
            setTimeout(() => {
              let url
              if (this.data.is_bind_match == 2) {
                url = `pages/match-task-person/index?times_task_id=${this.data.times_task_id}&camp_times_id=${this.data.camp_times_id}&task_submit_id=${res.task_submit_id}&unionid=${this.data.task_view_unionid}&index=${this.data.index}&type=3&shareType=task`
              } else {
                url = `pages/match-task-person/index?times_task_id=${this.data.times_task_id}&camp_times_id=${this.data.camp_times_id}&task_submit_id=${res.task_submit_id}&unionid=${this.data.task_view_unionid}&index=${this.data.index}&type=3&shareType=area`
              }
              router.redirect({path: url})
            }, 2000)
          }
        })
      }, error => {
        wx.hideLoading()
      })
    },
    postMsg: function () {
      if (this.data.postMsgFlag) {
        this.setData({postMsgFlag: false})
        var pics = this.data.pic_url;
        if (pics.length > 0) {
          this.uploadimg(this.publishMsg);
        } else {
          this.publishMsg()
        }
      }
    },
    uploadimg: function (cb) {//这里触发图片上传的方法
      wx.showLoading({
        title: '图片上传中...',
        mask:true
      })
      var pics = this.data.pic_url;
        if (pics.length > 0) {
          network.uploadFils('xrw', pics)
          .then(data => {
            let list = data.success
            if (list) {
              let fromList = Array.from(list, (item) => (item.urlFile))
              this.setData({
                imgList: fromList
              })
              cb()
            }
          })
          .catch(error => {
            cb()
          })
        } else {
          app.func.showToast("请上传图片");
        }
    },
    // 获取文本框的内容
    getAreaValue(e) {
        var value = e.detail.value;
        var vlength = value.length;
        this.setData({
          fontvaluelength: vlength,
        });
        if (value) {
          this.setData({
            sendred: true,
            content: value
          })
        }
        if (!value && this.data.pic_url.length <= 0) {
          this.setData({
            sendred: false,
            content: value
          })
        }
        // if (value.length >= 50) {
        //   this.setData({
        //     sendred: true,
        //     content: value
        //   });
        // } else {
        //   this.setData({
        //     sendred: false,
        //     content: value
        //   });
        // }
    },
    //图片点击事件
    imgYu(event) {
        let src = event.currentTarget.dataset.src;//获取data-src
        let imgList = event.currentTarget.dataset.list;//获取data-list
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    },
    //点击选择图片
    choose() {
        var pic_url = this.data.pic_url;
        wx.chooseImage({
          count: 9 - pic_url.length, // 最多可以选择的图片张数，默认9
          sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success: (res) => {
            var imgsrc = res.tempFilePaths;
            pic_url = pic_url.concat(imgsrc);
            let sendred = false;
            if (pic_url.length){
              sendred=true
            }
            this.setData({
              pic_url: pic_url,
              sendred
            });
          },
          fail: () => {},
          complete: () => {}
        })
    },
    //确认删除图片
    deleteImage(e) {
      var images = this.data.pic_url;
      var index = e.currentTarget.dataset.index;//获取当前长按图片下标
      wx.showModal({
        title: '提示',
        content: '确定要删除此图片吗？',
        success: (res) => {
          if (res.confirm) {
            images.splice(index, 1)
          } else if (res.cancel) {
            return false
          }
          if (images.length <= 0 && this.data.fontvaluelength == 0) {
            this.setData({sendred: false})
          }
          this.setData({ pic_url: images })
        }
      })
    }
});