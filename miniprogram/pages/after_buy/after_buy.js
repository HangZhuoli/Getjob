// miniprogram/pages/action_detail/action_detail.js
const DB = wx.cloud.database()
let user_content = ""
let users_comment = []
let openid = ""
let user_nickname = ""
let user_head = ""
let id = ""
Page({
  data: {
    user_content: '',
    detail: "",
    comment: [], //评论内容数组
    userstar:[
    "../../img/lightstar.png",
    "../../img/lightstar.png",
    "../../img/lightstar.png",
    "../../img/lightstar.png",
    "../../img/lightstar.png"
    ],
    score:0
  },
  star:function(e){
    let that = this
    var index = e.currentTarget.dataset.index
    var t = this.data.userstar
    var len = t.length
    for(var i=0;i<len;i++){
      if(i<index){
        t[i] = "../../img/deepstar.png"
        that.setData({
          score:i+1
        })
        
      }else{
        t[i] = "../../img/lightstar.png"
      }
    }
    that.setData({
      userstar:t
    })
  },
  onLoad(options) {
    wx.cloud.callFunction({
      name: "get_openid",
      success: res => {
        console.log(res)
        openid = res.result.openid
        console.log("cloudsuccess", openid)
      }
    })
    let user = wx.getStorageSync('user')
    user_nickname = user.nickName
    user_head = user.avatarUrl
    // console.log(options.id)
    id = options.id
    DB.collection("action")
      .doc("2d44d6c2612b8d8407ba0b7c301fcc07")
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
  //获取评论内容
  getContent(e) {
    this.setData({
      user_content: e.detail.value
    })
  },
  //发表评论
  upload_content:function(e) {
    console.log(this.data)
    let that = this
    let user_content = this.data.user_content
    console.log(user_content,user_content.length)
    if (user_content.length < 4) {
      wx.showToast({
        icon: "none",
        title: '评论太短或内容为空',
        success(res){
          that.setData({
            user_content:''
          })
        }
      })
    }else{
    let Comment = {}
    //name需获取用户信息后赋值
    Comment.name = user_nickname
    Comment.content = user_content
    Comment.avatarUrl = user_head
    Comment.point = this.data.score
    let commentArr = this.data.comment
    commentArr.push(Comment)
    wx.showLoading({
      title: '发表中',
    })
    console.log(id)
    console.log(commentArr)
    wx.cloud.callFunction({
      name: "update_comment",
      data: {
        id: "2d44d6c2612b8d8407ba0b7c301fcc07",
        users_comment: commentArr
      }
    }).then(res => {
      console.log("发表成功")
      this.setData({
        comment: commentArr,
        user_content: ''
      })
      wx.hideLoading()
    }).catch(err => {
      console.log("发表失败")
      console.log(err)
      wx.hideLoading()
    })
  }
  },
})