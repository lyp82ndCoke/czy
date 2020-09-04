const router = require('../../utils/router.js');
import network from '../../utils/network';
Page({
    data:{
        report_list: [],
        assess_data: {}
    },
    onLoad:function(options){
        this.setData({paper_id: options.paper_id, camp_times_id: options.camp_times_id, assess_id: options.assess_id, assess_paper_id: options.assess_paper_id})
        this.getData()
    },
    getData() {
        wx.showLoading({
            title: '数据加载中',
        })
        const params = {
            camp_times_id: this.data.camp_times_id,
            assess_paper_id: this.data.assess_paper_id,
            assess_id: this.data.assess_id,
            paper_id: this.data.paper_id
        }
        network.request('getAssessReport', params, res => {
            this.setData({report_list: res.list, assess_data: res.assess_data})
            this.handleStatus()
            wx.hideLoading()
        }, error => { wx.hideLoading() })
    },
    handleContact(e) {
        const params = e.currentTarget['dataset']
        network.logsRequest({ apipath: params.button_path, apiparam: params.assess_id }, data => {
            console.log("log日志")
        })
    },
    handleStatus() {
        let list = this.data.report_list
        list.forEach(el => {
            const scoreNum = parseInt(el.score_percent.split('%')[0])
            if (0 <= scoreNum && scoreNum < 30) {
                el.score_progress = 'progress-jiaocha'
                el.score_text = '很差'
            } else if (30 <= scoreNum && scoreNum < 60) {
                el.score_progress = 'progress-hencha'
                el.score_text = '较差'
            } else if (60 <= scoreNum && scoreNum < 80) {
                el.score_progress = 'progress-good'
                el.score_text = '一般'
            } else if (80 <= scoreNum && scoreNum < 90) {
                el.score_progress = 'progress-commonly'
                el.score_text = '良好'
            } else if (90 <= scoreNum && scoreNum <= 100) {
                el.score_progress = 'progress-excellent'
                el.score_text = '优秀'
            }
        })
        this.setData({report_list: list})
    }
})