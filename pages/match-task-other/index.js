import network from '../../utils/network';

Page({
    data: {
        example_list: [],
        count_user_num: 0
    },
    onLoad: function(options){
        this.setData({ camp_times_id: options.camp_times_id, times_task_content_id:options.times_task_content_id })
        this.getTaskExampleList()
    },
    handleContent() {
        let content = this.data.example_list
        content.forEach(item => {
            item['isfold'] = true;
            let contentLength = 0;
            if (item['details']) {
              contentLength = item['details'].length;
              if (item['details'].indexOf("\n")) {
                // 统计换行次数 超过7行就显示全部
                var contentN = item['details'].split("\n").length - 1;
                if (contentN > 0) {
                  contentLength += contentN * 25;
                }
              }
              item.contentLength = contentLength;
            }
        })
        this.setData({example_list: content})
    },
    // 展开收起
    showDetail(e) {
        const index = e.currentTarget.dataset.index;
        this.data.example_list[index]['isfold'] = !this.data.example_list[index]['isfold'];
        this.setData({
            example_list: this.data.example_list
        });
    },
    getTaskExampleList() {
        // 获取任务示例
        let data = {
            camp_times_id: this.data.camp_times_id,
            times_task_content_id: this.data.times_task_content_id
        }
        network.request('getTaskContentExampleList', data, res => {
            this.setData({example_list: res.example_list, count_user_num: res.count_user_num});
            this.handleContent();
        })
    }
});