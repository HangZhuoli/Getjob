// miniprogram/pages/action_detail/action_detail.js
const DB = wx.cloud.database()
let user_content = ""
let users_comment = []
let useropenid = ""
let user_nickname = ""
let user_head = ""
let id = ""
Page({
  data: {
    isAll:true,
    isGood:false,
    isBad:false,
    user_content: '',
    detail: "",
    comment: [] //评论内容数组
  },
  onLoad(options) {
    wx.cloud.callFunction({
      name: "get_openid",
      success: res => {
        console.log(res)
        useropenid = res.result.openid
        console.log("cloudsuccess", useropenid)
      }
    })
    let user = wx.getStorageSync('user')
    user_nickname = user.nickName
    user_head = user.avatarUrl
    // console.log(options.id)
    id = options.id
    DB.collection("action")
      .doc(id)
      .get()
      .then(res => {
        console.log(res)
        this.setData({
          detail: res.data,
          comment: res.data.comment
        })
      })
      .catch(res => {})
  },
  all:function(){
    this.setData({
      isAll:true,
      isGood:false,
      isBad:false
    })
  },
  good:function(){
    this.setData({
      isAll:false,
      isGood:true,
      isBad:false
    })
  },
  bad:function(){
    this.setData({
      isAll:false,
      isGood:false,
      isBad:true
    })
  },
  goToDetail:function(){
    wx.navigateTo({
      url: '/pages/action_detail/action_detail?id='+id,
    })
  }
})