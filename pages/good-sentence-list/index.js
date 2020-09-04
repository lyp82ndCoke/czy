// pages/good-sentence-list/index.js
const router = require('../../utils/router.js');
import network from '../../utils/network'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    page_num: 1,
    page_size: 10,
    loading: false, //加载中
    over: false,
    list: [
    //   {
    //   "sayingDate": "2019-11-11",
    //   "intro": "家庭成员间的关系，是生命中最深刻的一种人际关系，在这样一种关系中所体会到的东西，或好或坏，都会给儿童留下终生印象和一生影响。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1212,
    //   "view_num": 3998
    // }, {
    //   "sayingDate": "2019-11-10",
    //   "intro": "孩子闯祸都是无意的，为什么我们不能原谅孩子无心或无奈下所犯的错误呢？况且，孩子闯了祸他自己心里就很痛苦，有内疚感。家长的打骂只是让他没有自尊，觉得大人更爱的是那损失的钱和物，他感受到大人不体谅他，心里生发出逆反情绪，同时也失去内疚感——经常这样来“教育”孩子，他怎么可能不变得越来越不听话，越来越对什么都满不在乎呢？",
    //   "creators_name": "尹建莉",
    //   "article_id": 1211,
    //   "view_num": 4367
    // }, {
    //   "sayingDate": "2019-11-09",
    //   "intro": "孩子表现不好，把他骂一顿，揍一顿——这是多么容易的事啊，做起来也很痛快，每个家长都做得到——所以它为许多家长所钟爱。只是，它不能解决任何问题。所以，它也会让那些习惯于“痛快”、“容易”地解决问题的家长在以后的日子里，慢慢品味教子无方所带来的更多的不痛快和不容易。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1210,
    //   "view_num": 4775
    // }, {
    //   "sayingDate": "2019-11-08",
    //   "intro": "打骂孩子可能会解决眼前的一个小问题，却给孩子的成长留下大隐患，创痕会伴随孩子一生。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1209,
    //   "view_num": 4736
    // }, {
    //   "sayingDate": "2019-11-07",
    //   "intro": "一个孩子突然不想去上学了，就要考虑他和班里同学的关系是否出现了问题，是否受到某个老师的批评而感到委屈，是否遇到了他人的威胁等，孩子的成绩一路下滑，就要考虑自己对孩子的学习管理是否得当，观察他最近情绪如何，对什么感兴趣，主要和哪些人交往，他遇到了什么打击或诱惑等。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1208,
    //   "view_num": 5541
    // }, {
    //   "sayingDate": "2019-11-06",
    //   "intro": "孩子是敏感而脆弱的，如果老师和家长的见面，变成了让孩子蒙羞挨训的恐怖事件，后果只能是让孩子憎恨老师，讨厌学校，让孩子在学习、自信、道德等方面失去上进心和判断力，而且最后多半会反映在学习上，影响学习成绩。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1206,
    //   "view_num": 5816
    // }, {
    //   "sayingDate": "2019-11-05",
    //   "intro": "家长即使从家长会上发现孩子学习退步，不守纪律，和同学打架，甚至旷课等严重问题，回家后也不应该打骂孩子。要先和老师好好分析沟通一下，尽可能寻找出问题的缘由来。孩子不会凭空出现问题。出现问题一定是有一些长期积淀的症结没得到解决，或是有某个外在因素使一些小问题恶化。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1201,
    //   "view_num": 6635
    // }, {
    //   "sayingDate": "2019-11-04",
    //   "intro": "家长要认识到自己的局限性，知道在孩子的某些发展阶段上和某些发展方面，你是无能为力的，或者说是不需要作为的。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1200,
    //   "view_num": 7026
    // }, {
    //   "sayingDate": "2019-11-03",
    //   "intro": "儿童和成人一样，都喜欢受到肯定，受到激励。在肯定和激励的环境中，他们才更容易自信，更容易进步。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1199,
    //   "view_num": 5368
    // }, {
    //   "sayingDate": "2019-11-02",
    //   "intro": "哲学家弗洛姆说：“当一个不幸的婚姻面临解体时，父母之间陈腐的论据是，他们不能分离，以免剥夺一个完整的家庭给孩子所带来的幸福。然而，任何深入的研究都表明，对孩子来说，家庭中紧张和不愉快的气氛，比公开的决裂更有害，因为后者至少教育孩子，人能够靠勇敢的决断，结束一种不可容忍的生活状况。”",
    //   "creators_name": "尹建莉",
    //   "article_id": 1198,
    //   "view_num": 5343
    // }, {
    //   "sayingDate": "2019-11-01",
    //   "intro": "不要把孩子轻易送回老家，让老人或亲戚帮着带。要尽量想办法把孩子留在自己身边，最好能天天见到孩子。有实际困难，应该由家长去克服，不要让孩子来扛。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1197,
    //   "view_num": 6043
    // }, {
    //   "sayingDate": "2019-10-31",
    //   "intro": "儿童是一个完美独立存在的世界，他幼小身体里深藏着无限蓬勃的活力，他在生命的成长中有一种自我塑造、自我成形的表达潜力，就如一颗种子里藏着根茎、叶片、花朵，在合适的条件下自然会长出来一样。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1188,
    //   "view_num": 6049
    // }, {
    //   "sayingDate": "2019-10-30",
    //   "intro": "不尊重儿童最典型的一个表现就是对孩子管制太多，也就是指导或干涉太多，孩子的许多正常生长秩序被打乱了。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1187,
    //   "view_num": 6279
    // }, {
    //   "sayingDate": "2019-10-29",
    //   "intro": "家长们哪怕没有时间在实物上设一个记录本，至少要在心里设一个这样的“记功簿”。心里有没有这样一个本子，你的目光和言语会流露出来，孩子完全能感受到。你给他记录的“功绩”越多，你就给了他越多的快乐与自信，这会让他变得越来越好。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1186,
    //   "view_num": 6580
    // }, {
    //   "sayingDate": "2019-10-28",
    //   "intro": "不少家长太擅长发现孩子的缺点，对孩子的优点却感觉迟钝，整天对孩子充满了批评和指令。孩子心中原本可以成长起来的优点种子，总是受到冰雹和风霜的打击，不能很好地成长，直至枯菱或死亡——这就是为什么许多孩子到最后真的满身缺点，很难找到优点了。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1185,
    //   "view_num": 6811
    // }, {
    //   "sayingDate": "2019-10-27",
    //   "intro": "房子有了爱才是家，一家人幸福地生活在一起，那就是置身人间天堂！",
    //   "creators_name": "尹建莉",
    //   "article_id": 1184,
    //   "view_num": 6077
    // }, {
    //   "sayingDate": "2019-10-26",
    //   "intro": "现代家庭教育中一个很大的问题是，父母可以为孩子付出生命，却不肯为孩子付出时间和心思。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1183,
    //   "view_num": 5219
    // }, {
    //   "sayingDate": "2019-10-25",
    //   "intro": "很多由他人长期抚养的孩子，在回到父母身边后，都会表现出和父母相处的不和谐。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1182,
    //   "view_num": 5149
    // }, {
    //   "sayingDate": "2019-10-24",
    //   "intro": "如果家长能领悟儿童成长中每一天、每一种境遇的重要，知道这些境遇会对孩子产生巨大的影响，那么父母又带孩子又工作的能力和办法自然就有了。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1181,
    //   "view_num": 6006
    // }, {
    //   "sayingDate": "2019-10-23",
    //   "intro": "如果家长从孩子一上学就只是着眼于每次考试得了多少分，而没有培养起孩子对学习本身的兴趣，那么“优秀成绩”注定只是一时的梦幻彩虹，让那些没有远见、没有踏实心地的家长最终失望。",
    //   "creators_name": "尹建莉",
    //   "article_id": 1180,
    //   "view_num": 6628
    // }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      list:[],
      page_num:1

    })
    this.getSentenceList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.over) {
      wx.showToast({
        title: '已加载全部',
        icon:"none"
      })
    } else {
      this.getSentenceList()
    }

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

  /**
   * 获取金句列表
   */
  getSentenceList() {
    if (this.data.loading) {
      return;
    }
    this.setData({
      loading: true
    })
    const formData = {
      page_num: this.data.page_num,
      page_size: this.data.page_size
    }
    network.request('getMoreGoldsay', formData, data => {
      // 获取原始数据（列表已有数据）
      let list = this.data.list;
      // 获取心情求的数据newData
      let newData = data.list;
      console.log('newdata', newData)
      // 如果是下拉请求更多的话  拼接原始数据
      newData = list.concat(newData)
      console.log(newData)
      let page_num = this.data.page_num+1;
      this.data.page_num = page_num;
      // 如果新的数据小于当前分页数量 设置下拉数据以为空  over为true
      if (data.list.length < this.data.page_size) {
        this.setData({
          over: true
        });
      }
      // 设置数据
      this.setData({
       page_num:this.data.page_num,
        list: newData,
        loading: false
      });
    }, error => {
      this.setData({
        loading: false
      })
    })


  },
  gotoSayDetail(e) {
    var id = e.currentTarget.dataset.id
    router.navigate({
      path: 'pages/good-sentence/index?id=' + id,
    })

  },

  //音频悬浮窗按钮控件
  musicPlay: function () {

  },

  //悬浮上拉下拉
  onPageScroll: function (e) {

  },

  //关闭即隐藏
  musicClosed() {

  },

  // //悬浮标题点击跳详情页
  // gotoDetail: function (e) {
  //   console.log(e);
  //   var id = e.currentTarget.dataset.id;
  //   var course_id = e.currentTarget.dataset.course_id;
  //   wx.navigateTo({
  //     url: '../course_detail/course_detail?id=' + id + "&course_id=" + course_id + "&audioType =1",

  //   })
  // },
})