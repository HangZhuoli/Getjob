// miniprogram/pages/action_detail/action_detail.js
const DB = wx.cloud.database()
let user_content = ""
let users_comment = []
let openid = ""
let user_nickname = ""
let user_head = ""
let id = ""
let choice = ""
Page({
  data: {
    qunmian:1,
    showModal:false,
    isCheck0:false,
    isCheck1:false,
    datalist:'',
    isIng:["正在报名中","已结束报名"],
    user_content: '',
    detail: "",
    comment: [], //评论内容数组
    isPay:0
  },
  goToAction:function(){
    wx.switchTab({
      url: '../action/action'
    });
  },
  goToComment:function(){
    wx.navigateTo({
      url: '/pages/comment/comment?id='+id,
    })
  },
  revise_data:function(){
    wx.navigateTo({
      url: '/pages/manage/revise_data/revise_data?id='+id,
    })
  },
  onLoad(options) {
    let user = wx.getStorageSync('user')
    user_nickname = user.nickName
    user_head = user.avatarUrl
    console.log(options.id)
    id = options.id
    wx.cloud.database().collection("action")
      .doc(id)
      .get()
      .then(res => {
        console.log(res)
        this.setData({
          datalist: res.data,
          comment: res.data.comment
        })
      })
      .catch(res => {})
  },
  //创建订单
  createOrder(e){
    this.setData({
      showModal:true
    })
  },
  tap:function(e){
    console.log(this.data)
    if(this.data.isCheck0){
      choice = 50;
    }
    this.setData({
      isCheck0:true,
      isCheck1:false
    })
    console.log(this.data.isCheck0)
    console.log(this.data.datalist.num_selectable)
  },
  audit(){
    this.setData({
      isCheck0:false,
      isCheck1:true
    })
  },
  goToDetail(){
    this.setData({
      showModal:false
    })
  },
  confirm(e){
    let index = ''
    console.log(this.data)
    if(this.data.isCheck0){
      choice = this.data.datalist.price_all
      index = 0
    }else{
      choice = this.data.datalist.price_audit
      index = 1
    }
    console.log(choice,index)
    wx.navigateTo({
      url: '/pages/order_pay/order_pay?id='+id+'&price='+choice+'&index='+index,
    })
  }
})