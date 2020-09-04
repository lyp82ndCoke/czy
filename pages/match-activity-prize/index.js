const router = require('../../utils/router.js');
import network from '../../utils/network';
Page({
    data: {
        taskInfo: {},
        prizeList: []
    },
    onLoad: function(options){
        this.getPrizeLis(options)
    },
    getPrizeLis(data) {
        wx.showLoading({
            title: '数据加载中',
        })
        let params = {camp_times_id: data.camp_times_id, times_task_id: data.times_task_id}
        network.request('prizeLis', params, res => {
            this.setData({prizeList: res.prizeList, taskInfo: res.taskInfo})
            wx.hideLoading()
        }, error => {
            wx.hideLoading()
        })
    },
    imgView(e) {
        let src = e.currentTarget['dataset'].src
        let imgList = new Array(src)
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    }
});