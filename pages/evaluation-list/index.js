
const router = require('../../utils/router.js');
import network from '../../utils/network';
import fromat from "../../utils/fromat"
Page({
    data:{
        list: [],
        assess_data: {},
        page_num: 1,
        page_size: 10
    },
    onLoad:function(options){
        this.setData({camp_times_id: options.id})
        this.getList()
    },
    onShow() {},
    queryBtn(e) {
        const index = e.currentTarget['dataset'].index
        const item = this.data.list[index]
        if (item.status == 2) {
            wx.showToast({
                title: '测评未开始，暂不能测评',
                icon: 'none'
            })
            return
        }
        if (item.status == 3 && item.is_report == 0) {
            wx.showToast({
                title: '测评已结束，不能进行测评',
                icon: 'none'
            })
            return
        }
        if (item.is_report == 1) {
            // 看报告
            router.navigate({path: `pages/evaluation-report/index?paper_id=${item.paper_id}&camp_times_id=${item.camp_times_id}&assess_id=${item.assess_id}&assess_paper_id=${item.assess_paper_id}`})
            return
        }
        const accessInfo = {
            assess_name: this.data.assess_data.assess_name,
            access_target: item.assess_target
        }
        wx.setStorageSync("access_info", accessInfo)
        router.navigate({path: `pages/evaluation-init/index?paper_id=${item.paper_id}&camp_times_id=${item.camp_times_id}&assess_id=${item.assess_id}&assess_paper_id=${item.assess_paper_id}&prevIndex=${index}`})
    },
    getList(type) {
        wx.showLoading({
            title: '数据加载中',
        })
        let params = { page_num: this.data.page_num, page_size: this.data.page_size, camp_times_id: this.data.camp_times_id }
        network.request('campAssessList', params, res => {
            let list = res.list
            list.forEach(el => {
                el.start_time = fromat.formatDate(el.assess_start_time, 'YYYY.MM.DD HH:mm')
                el.end_time = fromat.formatDate(el.assess_end_time, 'YYYY.MM.DD HH:mm')
            })
            this.setData({list: this.data.list.concat(list), assess_data: res.assess_data})
            if (res.sign.count < this.data.page_size) {
                this.setData({isFinish: true})
            }
            wx.hideLoading()
            wx.stopPullDownRefresh()
        }, error => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
        })
    },
    onPullDownRefresh: function() {
        this.setData({
            list: [],
            page_num: 1
        })
        this.getList()
    },
    onReachBottom: function() {
        if(this.data.isFinish){
            wx.showToast({ title:"没有更多了",icon:"none"})
            return
        }
        this.setData({ page_num: this.data.page_num + 1 })
        this.getList()
    }
})